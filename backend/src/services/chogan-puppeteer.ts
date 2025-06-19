import puppeteer, { Browser, Page } from 'puppeteer';
import { choganLogger } from '../utils/logger';

// Types pour les données d'entrée (reprise de l'ancien service)
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
  screenshots?: string[]; // Pour debug
}

export class ChoganPuppeteerAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Installer Chrome automatiquement si nécessaire
   */
  private async ensureChromeInstalled(): Promise<void> {
    try {
      choganLogger.info('CHOGAN_PUPPETEER', 'Vérification de Chrome...');
      
      // Tenter de lancer Puppeteer pour voir si Chrome est disponible
      const testBrowser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      await testBrowser.close();
      
      choganLogger.info('CHOGAN_PUPPETEER', 'Chrome trouvé et fonctionnel');
      
    } catch (error) {
      choganLogger.info('CHOGAN_PUPPETEER', 'Chrome non trouvé, installation en cours...');
      
      // Installer Chrome avec Puppeteer
      const { execSync } = require('child_process');
      try {
        execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
        choganLogger.info('CHOGAN_PUPPETEER', 'Chrome installé avec succès');
      } catch (installError) {
        choganLogger.error('CHOGAN_PUPPETEER', 'Erreur installation Chrome', {}, installError as Error);
        throw new Error(`Impossible d'installer Chrome: ${installError}`);
      }
    }
  }

  /**
   * Point d'entrée principal pour automatiser une commande avec Puppeteer
   */
  async processOrder(orderData: OrderRequest): Promise<AutomationResult> {
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      choganLogger.sessionStart(orderId);
      choganLogger.info('CHOGAN_PUPPETEER', 'Début du traitement de commande', {
        orderId,
        client: `${orderData.client.prenom} ${orderData.client.nom}`,
        email: orderData.client.email,
        produits: orderData.produits.length,
        revendeur: orderData.credentials.email
      });
      
      // Étape 1: Initialiser le navigateur
      await this.initializeBrowser();
      
      // Étape 2: Connexion au compte revendeur
      await this.loginToRevendeurAccount(orderData.credentials);
      
      // Étape 3: Accéder à Smart Order
      await this.accessSmartOrder();
      
      // Étape 4: Remplir les informations client
      await this.fillClientInfo(orderData.client);
      
      // Étape 5: Ajouter les produits
      await this.addProducts(orderData.produits);
      
      // Étape 6: Finaliser et récupérer le lien
      const finalLink = await this.finalizOrderAndGetLink();
      
      choganLogger.sessionEnd(true, orderId, finalLink);
      return {
        success: true,
        chogan_link: finalLink
      };
      
    } catch (error) {
      choganLogger.sessionEnd(false, orderId);
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur lors de l\'automatisation', { orderId }, error as Error);
      
      // Prendre une capture d'écran pour debug
      const screenshot = await this.takeScreenshot('error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: error instanceof Error ? error.stack : undefined,
        screenshots: screenshot ? [screenshot] : undefined
      };
    } finally {
      // Nettoyage
      await this.cleanup();
    }
  }

  /**
   * Étape 1: Initialiser le navigateur Puppeteer
   */
  private async initializeBrowser(): Promise<void> {
    choganLogger.info('CHOGAN_PUPPETEER', 'Initialisation du navigateur...');
    
    // S'assurer que Chrome est installé
    await this.ensureChromeInstalled();
    
    // Configuration optimisée pour les environnements conteneurisés (Render)
    const isProduction = process.env.NODE_ENV === 'production';
    
    this.browser = await puppeteer.launch({
      headless: isProduction ? true : false, // Headless en production, visible en dev
      executablePath: isProduction ? undefined : undefined, // Laisser Puppeteer trouver Chrome
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--window-size=1280,720',
        '--memory-pressure-off',
        '--max_old_space_size=4096'
      ],
      timeout: 60000 // Timeout plus long pour les environnements lents
    });
    
    this.page = await this.browser.newPage();
    
    // Configuration de la page pour ressembler à un utilisateur réel
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Émuler les comportements humains
    await this.page.evaluateOnNewDocument(() => {
      // Désactiver la détection de webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Navigateur initialisé avec succès');
  }

  /**
   * Étape 2: Connexion au compte revendeur
   */
  private async loginToRevendeurAccount(credentials: { email: string; password: string }): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Connexion au compte revendeur...', { email: credentials.email });
    
    try {
      // Aller à la page de connexion
      await this.page.goto('https://www.chogangroupspa.com/login_page', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Attendre que Cloudflare se charge et se résove automatiquement
      await this.waitForCloudflareChallenge();
      
      // Prendre une capture après Cloudflare
      await this.takeScreenshot('after-cloudflare');
      
      // Chercher et remplir le formulaire de connexion
      await this.page.waitForSelector('input[type="email"], input[name*="email"]', { timeout: 10000 });
      
      // Remplir l'email de manière plus humaine
      const emailField = await this.page.$('input[type="email"], input[name*="email"]');
      if (emailField) {
        await emailField.click(); // Focus d'abord
        await emailField.evaluate(el => (el as HTMLInputElement).value = ''); // Clear le champ
        await this.page.type('input[type="email"], input[name*="email"]', credentials.email, { 
          delay: Math.random() * 50 + 80 // Délai variable entre 80-130ms
        });
      }
      
      // Petite pause entre les champs
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      // Remplir le mot de passe de manière plus humaine
      const passwordField = await this.page.$('input[type="password"]');
      if (passwordField) {
        await passwordField.click(); // Focus d'abord
        await passwordField.evaluate(el => (el as HTMLInputElement).value = ''); // Clear le champ
        await this.page.type('input[type="password"]', credentials.password, { 
          delay: Math.random() * 50 + 80 // Délai variable entre 80-130ms
        });
      }
      
      // Petite pause avant de soumettre
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      // Prendre une capture avant soumission
      await this.takeScreenshot('before-login-submit');
      
      // Cliquer sur le bouton de connexion avec l'ID exact
      // Le bouton a l'ID "btn_login" et le texte "Me connecter" ou "Log in"
      try {
        choganLogger.info('CHOGAN_PUPPETEER', 'Recherche du bouton de connexion #btn_login...');
        
        // Attendre que le bouton soit présent
        await this.page.waitForSelector('#btn_login', { timeout: 10000 });
        
        // Vérifier que le bouton est visible et cliquable
        const buttonInfo = await this.page.evaluate(() => {
          const button = document.querySelector('#btn_login') as HTMLElement;
          if (!button) return null;
          
          return {
            text: button.textContent?.trim(),
            className: button.className,
            href: (button as HTMLAnchorElement).href,
            visible: button.offsetParent !== null,
            disabled: (button as HTMLInputElement).disabled
          };
        });
        
        choganLogger.info('CHOGAN_PUPPETEER', 'Bouton de connexion trouvé:', buttonInfo);
        
        if (!buttonInfo) {
          throw new Error('Bouton #btn_login non trouvé');
        }
        
        if (!buttonInfo.visible) {
          throw new Error('Bouton #btn_login non visible');
        }
        
        // Cliquer sur le bouton
        await this.page.click('#btn_login');
        choganLogger.info('CHOGAN_PUPPETEER', 'Clic effectué sur le bouton #btn_login');
        
        // Attendre un peu pour voir si une popup anti-robot apparaît
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Vérifier et gérer la popup anti-robot si elle apparaît
        await this.handleAntiRobotPopup();
        
      } catch (error) {
        // Debug : analyser tous les éléments de la page pour diagnostic
        const pageElements = await this.page.evaluate(() => {
          const allButtons = Array.from(document.querySelectorAll('button, input, a'));
          return allButtons.map(btn => ({
            tagName: btn.tagName,
            type: (btn as HTMLInputElement).type || '',
            value: (btn as HTMLInputElement).value || '',
            textContent: btn.textContent?.trim() || '',
            className: btn.className || '',
            id: btn.id || '',
            href: (btn as HTMLAnchorElement).href || ''
          }));
        });
        
        choganLogger.error('CHOGAN_PUPPETEER', 'Erreur détection bouton #btn_login', { 
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          elements: pageElements.slice(0, 15)
        });
        
        await this.takeScreenshot('no-button-found-debug');
        throw new Error(`Bouton de connexion #btn_login introuvable: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Attendre la redirection après connexion (timeout plus long)
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      
      // Vérifier que la connexion a réussi
      const currentUrl = this.page.url();
      if (currentUrl.includes('login')) {
        throw new Error('Connexion échouée - toujours sur la page de login');
      }
      
      choganLogger.info('CHOGAN_PUPPETEER', 'Connexion revendeur réussie');
      await this.takeScreenshot('login-success');
      
    } catch (error) {
      await this.takeScreenshot('login-error');
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur lors de la connexion', { email: credentials.email }, error as Error);
      throw new Error(`Connexion revendeur échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Gérer la popup anti-robot "You have to prove you're not a robot to go on"
   */
  private async handleAntiRobotPopup(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    try {
      choganLogger.info('CHOGAN_PUPPETEER', 'Vérification popup anti-robot (scan approfondi)...');
      
      // Analyser toute la page y compris iframes et modals
      const pageAnalysis = await this.page.evaluate(() => {
        const getAllText = () => {
          // Récupérer le texte de tous les éléments, y compris dans les iframes et modals
          let allText = document.body.innerText.toLowerCase();
          
          // Ajouter le contenu des iframes
          const iframes = Array.from(document.querySelectorAll('iframe'));
          iframes.forEach(iframe => {
            try {
              if (iframe.contentDocument) {
                allText += ' ' + iframe.contentDocument.body.innerText.toLowerCase();
              }
            } catch (e) {
              // Cross-origin iframe, ignorer
            }
          });
          
          // Ajouter le contenu des éléments cachés/modals
          const hiddenElements = Array.from(document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"], .modal, .popup, .overlay'));
          hiddenElements.forEach(el => {
            allText += ' ' + (el.textContent || '').toLowerCase();
          });
          
          return allText;
        };
        
        const fullText = getAllText();
        const contains = (str: string) => fullText.includes(str);
        
        // Analyser tous les boutons visibles et cachés
        const allButtons = Array.from(document.querySelectorAll('button, input, a, div[role="button"], span[onclick]'));
        const buttonInfo = allButtons.map(btn => ({
          text: (btn.textContent || '').trim(),
          value: (btn as HTMLInputElement).value || '',
          className: btn.className,
          id: btn.id,
          visible: (btn as HTMLElement).offsetParent !== null,
          style: (btn as HTMLElement).style.cssText
        }));
        
        return {
          fullText: fullText.substring(0, 800), // Plus de texte pour debug
          buttons: buttonInfo.filter(b => b.text.toLowerCase().includes('ok') || b.value.toLowerCase().includes('ok')),
          hasRobot: contains('robot'),
          hasProve: contains('prove'),
          hasYouHave: contains('you have'),
          detected: contains('robot') && (
            contains('prove') || 
            contains('not a robot') ||
            contains('you have to') ||
            contains('go on')
          )
        };
      });
      
      choganLogger.info('CHOGAN_PUPPETEER', 'Analyse complète de la page:', {
        detected: pageAnalysis.detected,
        hasRobot: pageAnalysis.hasRobot,
        hasProve: pageAnalysis.hasProve,
        hasYouHave: pageAnalysis.hasYouHave,
        okButtons: pageAnalysis.buttons,
        textSample: pageAnalysis.fullText
      });
      
      if (pageAnalysis.detected) {
        choganLogger.info('CHOGAN_PUPPETEER', '🤖 Popup anti-robot DÉTECTÉE ! Recherche du bouton OK...');
        
        // Prendre une capture de la popup
        await this.takeScreenshot('anti-robot-popup-detected');
        
        // Essayer de cliquer sur le bouton OK de plusieurs façons
        let okClicked = false;
        
        // Méthode 1: Sélecteurs CSS simples
        const okSelectors = ['button', 'input[type="button"]', 'input[type="submit"]', 'a', 'div[role="button"]'];
        for (const baseSelector of okSelectors) {
          try {
                         okClicked = await this.page.evaluate((selector) => {
               const elements = Array.from(document.querySelectorAll(selector));
               const okElement = elements.find(el => {
                 const text = el.textContent?.toLowerCase() || '';
                 const value = (el as HTMLInputElement).value?.toLowerCase() || '';
                 return text.includes('ok') || value.includes('ok');
               });
               
               if (okElement) {
                 (okElement as HTMLElement).click();
                 return true;
               }
               return false;
             }, baseSelector);
             
             if (okClicked) {
               choganLogger.info('CHOGAN_PUPPETEER', `✅ Bouton OK cliqué via sélecteur: ${baseSelector}`);
               break;
             }
          } catch (error) {
            continue;
          }
        }
        
        // Méthode 2: Recherche par texte exact si la première méthode échoue
        if (!okClicked) {
          okClicked = await this.page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));
            const okElement = elements.find(el => {
              const text = el.textContent?.trim().toLowerCase() || '';
              return text === 'ok' || text === 'okay';
            });
            
            if (okElement) {
              (okElement as HTMLElement).click();
              return true;
            }
            return false;
          });
          
          if (okClicked) {
            choganLogger.info('CHOGAN_PUPPETEER', '✅ Bouton OK cliqué via recherche par texte exact');
          }
        }
        
        if (okClicked) {
          // Attendre que la popup disparaisse
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Prendre une capture après fermeture popup
          await this.takeScreenshot('after-popup-closed');
          
          // Re-cliquer sur le bouton de connexion
          choganLogger.info('CHOGAN_PUPPETEER', '🔄 Re-clic sur le bouton de connexion après popup...');
          await this.page.click('#btn_login');
          choganLogger.info('CHOGAN_PUPPETEER', '✅ Second clic effectué sur #btn_login');
          
          // Attendre encore un peu pour la redirection
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          choganLogger.error('CHOGAN_PUPPETEER', '❌ Popup anti-robot détectée mais impossible de cliquer sur OK');
          await this.takeScreenshot('popup-ok-not-found');
        }
      } else {
        choganLogger.info('CHOGAN_PUPPETEER', '✅ Pas de popup anti-robot détectée');
      }
      
    } catch (error) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur lors de la gestion popup anti-robot', {}, error as Error);
      await this.takeScreenshot('popup-error');
    }
  }

  /**
   * Attendre que Cloudflare se résolve automatiquement
   */
  private async waitForCloudflareChallenge(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Vérification Cloudflare...');
    
    try {
      // Attendre soit le challenge Cloudflare, soit la page normale
      await this.page.waitForFunction(
        () => {
          const text = document.body.innerText.toLowerCase();
          // Si on voit "just a moment" = challenge Cloudflare
          // Si on voit un formulaire de login = page normale
          return !text.includes('just a moment') && !text.includes('checking your browser');
        },
        { timeout: 30000 }
      );
      
             // Attendre un peu plus pour être sûr
       await new Promise(resolve => setTimeout(resolve, 2000));
      
      choganLogger.info('CHOGAN_PUPPETEER', 'Cloudflare résolu automatiquement');
      
    } catch (error) {
      choganLogger.info('CHOGAN_PUPPETEER', 'Pas de challenge Cloudflare détecté ou résolu');
    }
  }

  /**
   * Étape 3: Accéder à Smart Order
   */
  private async accessSmartOrder(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Accès à Smart Order...');
    
    try {
      await this.page.goto('https://www.chogangroupspa.com/smartorder', {
        waitUntil: 'networkidle2',
        timeout: 30000 // Timeout plus long pour Smart Order
      });
      
      await this.takeScreenshot('smartorder-access');
      choganLogger.info('CHOGAN_PUPPETEER', 'Accès Smart Order réussi');
      
    } catch (error) {
      await this.takeScreenshot('smartorder-error');
      throw new Error(`Accès Smart Order échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Étape 4: Remplir les informations client
   */
  private async fillClientInfo(client: ClientData): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Remplissage des informations client...');
    
    // TODO: À implémenter selon la structure réelle de la page Smart Order
    // Cette partie sera adaptée après avoir vu la vraie page
    await this.takeScreenshot('client-info-form');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Informations client remplies');
  }

  /**
   * Étape 5: Ajouter les produits
   */
  private async addProducts(produits: ProductData[]): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', `Ajout de ${produits.length} produit(s)...`);
    
    // TODO: À implémenter selon la structure réelle de la page Smart Order
    await this.takeScreenshot('products-form');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Produits ajoutés');
  }

  /**
   * Étape 6: Finaliser et récupérer le lien
   */
  private async finalizOrderAndGetLink(): Promise<string> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Finalisation de la commande...');
    
    // TODO: À implémenter selon le processus réel
    await this.takeScreenshot('final-page');
    
    const finalLink = this.page.url(); // Temporaire
    choganLogger.info('CHOGAN_PUPPETEER', 'Commande finalisée', { finalLink });
    
    return finalLink;
  }

  /**
   * Prendre une capture d'écran pour debug
   */
  private async takeScreenshot(name: string): Promise<string | null> {
    if (!this.page) return null;
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `chogan-${name}-${timestamp}.png`;
      const path = `./screenshots/${filename}`;
      
             await this.page.screenshot({ path: path as `${string}.png`, fullPage: true });
      choganLogger.info('CHOGAN_PUPPETEER', `Capture d'écran: ${filename}`);
      
      return path;
    } catch (error) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur capture d\'écran', { name }, error as Error);
      return null;
    }
  }

  /**
   * Nettoyage des ressources
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
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur de nettoyage', {}, error as Error);
    }
  }

  /**
   * Test de connexion
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.initializeBrowser();
      if (!this.page) return false;
      
      await this.page.goto('https://www.chogangroupspa.com/', { timeout: 15000 });
      await this.cleanup();
      return true;
    } catch (error) {
      await this.cleanup();
      return false;
    }
  }
} 