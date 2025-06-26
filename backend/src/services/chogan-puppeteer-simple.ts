import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { choganLogger } from '../utils/logger';

// Plugin Stealth pour éviter la détection
puppeteer.use(StealthPlugin());

export interface ClientData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  departement: string;
  ville: string;
  pays: string;
}

export interface ProductData {
  ref: string;
  quantite: number;
}

export interface OrderRequest {
  client: ClientData;
  produits: ProductData[];
  credentials: {
    email: string;
    password: string;
  };
}

export interface AutomationResult {
  success: boolean;
  chogan_link?: string;
  error?: string;
  details?: string;
  screenshots?: string[];
}

export class ChoganPuppeteerSimple {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Point d'entrée principal pour automatiser une commande
   */
  async processOrder(orderData: OrderRequest): Promise<AutomationResult> {
    try {
      choganLogger.info('CHOGAN_PUPPETEER', 'Début automatisation simplifiée');
      
      // Étape 1: Initialiser le navigateur
      await this.initializeBrowser();
      
      // Étape 2: Connexion SIMPLE
      await this.loginSimple(orderData.credentials);
      
      // Étape 3: Accéder Smart Order
      await this.accessSmartOrder();
      
      // Étape 4: Finaliser
      const link = await this.finalizOrder();
      
      return {
        success: true,
        chogan_link: link
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Initialiser le navigateur - SIMPLE
   */
  private async initializeBrowser(): Promise<void> {
    choganLogger.info('CHOGAN_PUPPETEER', 'Initialisation navigateur...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Visible pour debug
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1366,768'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1366, height: 768 });
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Navigateur initialisé');
  }

  /**
   * Connexion SIMPLE - sans complications
   */
  private async loginSimple(credentials: { email: string; password: string }): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Connexion simple...', { email: credentials.email });
    
    // Aller à la page de login
    await this.page.goto('https://www.chogangroupspa.com/login_page', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Attendre que Cloudflare se charge
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Remplir les champs
    await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await this.page.type('input[type="email"]', credentials.email);
    
    await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await this.page.type('input[type="password"]', credentials.password);
    
    // CLIC SIMPLE sur le bouton
    choganLogger.info('CHOGAN_PUPPETEER', 'Clic sur bouton login...');
    
    await this.page.waitForSelector('#btn_login', { timeout: 10000 });
    
    // Vérifier que le bouton existe et est visible
    const buttonInfo = await this.page.$eval('#btn_login', (btn) => ({
      text: btn.textContent?.trim(),
      visible: (btn as HTMLElement).offsetParent !== null,
      tagName: btn.tagName,
      href: (btn as HTMLAnchorElement).href
    }));
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Bouton détecté:', buttonInfo);
    
    // CLIC + DÉCLENCHER LE JAVASCRIPT MANUELLEMENT
    choganLogger.info('CHOGAN_PUPPETEER', 'Clic + déclenchement JavaScript...');
    
    // 1. Clic normal d'abord
    await this.page.click('#btn_login');
    choganLogger.info('CHOGAN_PUPPETEER', '✅ Clic effectué');
    
    // 2. Déclencher tous les événements JavaScript manuellement
    await this.page.evaluate(() => {
      const button = document.querySelector('#btn_login') as HTMLElement;
      if (button) {
        // Déclencher tous les événements possibles
        button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        button.dispatchEvent(new Event('click', { bubbles: true }));
        
        // Si c'est un formulaire, essayer de le soumettre
        const form = button.closest('form');
        if (form) {
          console.log('Formulaire trouvé, soumission...');
          form.submit();
        }
        
        // Chercher et exécuter tout JavaScript associé
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
          console.log('onclick trouvé:', onclickAttr);
          eval(onclickAttr);
        }
        
        console.log('Tous les événements déclenchés');
      }
    });
    
    choganLogger.info('CHOGAN_PUPPETEER', '🔥 Événements JavaScript déclenchés manuellement');
    
    // Attendre pour voir la réaction
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Vérifier l'URL actuelle et analyser la page
    const currentUrl = this.page.url();
    choganLogger.info('CHOGAN_PUPPETEER', 'URL après clic:', currentUrl);
    
    // Analyser ce qui s'est passé sur la page
    const pageAnalysis = await this.page.evaluate(() => {
      const body = document.body;
      const title = document.title;
      const text = body.innerText.toLowerCase();
      
      // Chercher des indices de ce qui s'est passé
      const hasLogin = text.includes('me connecter') || text.includes('connexion');
      const hasError = text.includes('erreur') || text.includes('error') || text.includes('invalid');
      const hasSuccess = text.includes('tableau') || text.includes('dashboard') || text.includes('smartorder');
      const hasRobot = text.includes('robot') || text.includes('captcha');
      
      return {
        title,
        url: window.location.href,
        hasLogin,
        hasError, 
        hasSuccess,
        hasRobot,
        textSample: text.substring(0, 200)
      };
    });
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Analyse après clic:', pageAnalysis);
    
    // Si on est toujours sur login, analyser pourquoi
    if (currentUrl.includes('login') || pageAnalysis.hasLogin) {
      // Prendre une capture pour debug
      await this.page.screenshot({ path: 'screenshots/login-debug.png', fullPage: true });
      
           if (pageAnalysis.hasRobot) {
       choganLogger.info('CHOGAN_PUPPETEER', '🤖 Popup robot détectée - tentative de résolution...');
       
       // Prendre une capture de la popup robot
       await this.page.screenshot({ path: 'screenshots/popup-robot-detected.png', fullPage: true });
       choganLogger.info('CHOGAN_PUPPETEER', '📸 Capture popup robot sauvée');
       
       // Essayer de cliquer sur le bouton OK de la popup robot
       try {
         // Attendre que la popup soit complètement chargée
         await new Promise(resolve => setTimeout(resolve, 2000));
         
         // Chercher et cliquer sur différents boutons possibles
         const robotResolved = await this.page.evaluate(() => {
           // Chercher le bouton OK de la popup
           const okButtons = [
             ...Array.from(document.querySelectorAll('button')),
             ...Array.from(document.querySelectorAll('input[type="button"]')),
             ...Array.from(document.querySelectorAll('a'))
           ].filter(btn => {
             const text = btn.textContent?.toLowerCase().trim() || '';
             return text === 'ok' || text === 'continue' || text === 'proceed' || 
                    text === 'confirmer' || text === 'valider';
           });
           
           console.log('Boutons OK trouvés:', okButtons.length);
           
           if (okButtons.length > 0) {
             (okButtons[0] as HTMLElement).click();
             return true;
           }
           
           // Fallback: essayer d'appuyer sur Entrée
           document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
           return false;
         });
         
         choganLogger.info('CHOGAN_PUPPETEER', robotResolved ? 'Bouton OK cliqué' : 'Entrée pressée');
         
         // Attendre la réaction
         await new Promise(resolve => setTimeout(resolve, 3000));
         
         // Prendre une capture après clic OK
         await this.page.screenshot({ path: 'screenshots/after-ok-click.png', fullPage: true });
         choganLogger.info('CHOGAN_PUPPETEER', '📸 Capture après clic OK sauvée');
         
         // Vérifier si on a réussi à passer la popup
         const newUrl = this.page.url();
         if (!newUrl.includes('login')) {
           choganLogger.info('CHOGAN_PUPPETEER', '✅ Popup robot résolue - connexion réussie');
           return; // Sortir de la fonction, connexion réussie
         } else {
           choganLogger.warn('CHOGAN_PUPPETEER', '⚠️ Popup robot non résolue');
         }
         
       } catch (robotError) {
         choganLogger.warn('CHOGAN_PUPPETEER', 'Erreur gestion popup robot:', robotError);
       }
       
       throw new Error('Popup robot/captcha non résolue automatiquement');
     } else if (pageAnalysis.hasError) {
        throw new Error('Erreur de connexion détectée après clic');
      } else {
        throw new Error('Toujours sur la page de login après clic - JavaScript non déclenché');
      }
    }
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Connexion réussie');
  }

  /**
   * Accéder Smart Order
   */
  private async accessSmartOrder(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Accès Smart Order...');
    
    await this.page.goto('https://www.chogangroupspa.com/smartorder', {
      waitUntil: 'networkidle2'
    });
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Smart Order accessible');
  }

  /**
   * Finaliser et récupérer le lien
   */
  private async finalizOrder(): Promise<string> {
    if (!this.page) throw new Error('Page non initialisée');
    
    // Pour l'instant, juste retourner l'URL actuelle
    const currentUrl = this.page.url();
    choganLogger.info('CHOGAN_PUPPETEER', 'URL finale:', currentUrl);
    
    return currentUrl;
  }

  /**
   * Nettoyer les ressources
   */
  private async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      choganLogger.info('CHOGAN_PUPPETEER', 'Nettoyage terminé');
    } catch (error) {
      choganLogger.warn('CHOGAN_PUPPETEER', 'Erreur nettoyage:', error);
    }
  }

  /**
   * Test de connexion simple
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.initializeBrowser();
      
      if (!this.page) return false;
      
      await this.page.goto('https://www.chogangroupspa.com');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const title = await this.page.title();
      choganLogger.info('CHOGAN_PUPPETEER', 'Test connexion OK:', title);
      
      return true;
    } catch (error) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Test connexion échoué:', error);
      return false;
    } finally {
      await this.cleanup();
    }
  }
} 