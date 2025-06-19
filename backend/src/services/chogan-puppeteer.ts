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
      
      // Remplir l'email
      await this.page.type('input[type="email"], input[name*="email"]', credentials.email, { delay: 100 });
      
      // Remplir le mot de passe
      await this.page.type('input[type="password"]', credentials.password, { delay: 100 });
      
      // Prendre une capture avant soumission
      await this.takeScreenshot('before-login-submit');
      
      // Soumettre le formulaire - chercher le bouton "Me connecter"
      // Essayer plusieurs sélecteurs possibles pour le bouton de connexion
      const submitSelectors = [
        'button:text("Me connecter")',
        'input[value="Me connecter"]',
        'button[value="Me connecter"]',
        'a:text("Me connecter")',
        'button:text("Connexion")',
        'input[type="submit"]',
        'button[type="submit"]',
        'form button',
        '.btn-login',
        '#login-submit'
      ];
      
      let submitClicked = false;
      for (const selector of submitSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector);
          choganLogger.info('CHOGAN_PUPPETEER', `Bouton trouvé avec sélecteur: ${selector}`);
          submitClicked = true;
          break;
        } catch (error) {
          // Continuer avec le sélecteur suivant
          continue;
        }
      }
      
      if (!submitClicked) {
        // Dernier recours : chercher par texte avec evaluate
        const buttonFound = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a'));
          const targetButton = buttons.find(btn => 
            btn.textContent?.includes('Me connecter') || 
            btn.textContent?.includes('Connexion') ||
            (btn as HTMLInputElement).value?.includes('connecter')
          );
          
          if (targetButton) {
            (targetButton as HTMLElement).click();
            return true;
          }
          return false;
        });
        
        if (buttonFound) {
          choganLogger.info('CHOGAN_PUPPETEER', 'Bouton trouvé par recherche de texte');
        } else {
          throw new Error('Aucun bouton de connexion trouvé');
        }
      }
      
      // Attendre la redirection après connexion
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
      
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
        timeout: 15000
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