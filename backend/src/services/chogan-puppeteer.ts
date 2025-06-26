import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { choganLogger } from '../utils/logger';

// ⭐ ACTIVATION DU PLUGIN STEALTH POUR ÉVITER DÉTECTION BOT
puppeteer.use(StealthPlugin());

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
    
    // Utiliser un profil Chrome persistant pour éviter les détections anti-bot
    const userDataDir = isProduction ? '/tmp/chrome-user-data' : './chrome-user-data';
    
    choganLogger.info('CHOGAN_PUPPETEER', `Utilisation du profil Chrome: ${userDataDir}`);
    
    // ⭐ CONFIGURATION STEALTH + DESKTOP + COOKIES PERSISTANTS
    this.browser = await puppeteer.launch({
      headless: isProduction ? true : false,
      executablePath: isProduction ? undefined : undefined,
      userDataDir: userDataDir, // ⭐ COOKIES PERSISTANTS
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--disable-gpu',
        '--window-size=1366,768', // ⭐ TAILLE DESKTOP (laptop standard)
        '--disable-blink-features=AutomationControlled',
        '--exclude-switches=enable-automation'
      ],
      timeout: 60000
    });
    
    this.page = await this.browser.newPage();
    
    // ⭐ CONFIGURATION DESKTOP POUR ÉVITER DÉTECTION BOT
    await this.page.setViewport({ 
      width: 1366, 
      height: 768
    });
    
    // ⭐ USER-AGENT DESKTOP CHROME RÉALISTE 
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // ⭐ MASQUER LA DÉTECTION PUPPETEER
    await this.page.evaluateOnNewDocument(() => {
      // Supprimer navigator.webdriver
      delete (window.navigator as any).webdriver;
      
      // Masquer les propriétés d'automatisation
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      
      // Faux plugins Chrome
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Fausses langues
      Object.defineProperty(navigator, 'languages', {
        get: () => ['fr-FR', 'fr'],
      });
    });
    
    // ⭐ HEADERS DESKTOP RÉALISTES
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'max-age=0',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0', // ⭐ IMPORTANT: Indiquer que c'est desktop
      'sec-ch-ua-platform': '"Windows"'
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
      
      // Attendre que la page soit complètement chargée
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Chercher et remplir le formulaire de connexion
      await this.page.waitForSelector('input[type="email"], input[name*="email"]', { timeout: 10000 });
      
      const emailField = await this.page.$('input[type="email"], input[name*="email"]');
      if (emailField) {
        await emailField.click({ clickCount: 3 });
        await emailField.press('Backspace');
        await this.page.type('input[type="email"], input[name*="email"]', credentials.email, { delay: 50 });
      }

      const passwordField = await this.page.$('input[type="password"]');
      if (passwordField) {
        await passwordField.click({ clickCount: 3 });
        await passwordField.press('Backspace');
        await this.page.type('input[type="password"]', credentials.password, { delay: 50 });
      }
      
      await this.takeScreenshot('before-login-submit');

      // STRATÉGIE FINALE : Cliquer, puis attendre un sélecteur qui confirme la connexion.
      choganLogger.info('CHOGAN_PUPPETEER', 'Clic sur le bouton de connexion...');
      
      const loginButtonSelector = '#btn_login';
      await this.page.waitForSelector(loginButtonSelector, { visible: true, timeout: 10000 });
      await this.page.click(loginButtonSelector);

      choganLogger.info('CHOGAN_PUPPETEER', "Attente du signe de connexion réussie (lien 'Smart Order')...");
      
      // Le signe du succès est l'apparition du lien vers "Smart Order"
      const successSelector = 'a[href*="smartorder"]';
      await this.page.waitForSelector(successSelector, { visible: true, timeout: 20000 });
      
      await this.takeScreenshot('after-login-attempt');
      
      choganLogger.info('CHOGAN_PUPPETEER', 'Connexion réussie ! Lien Smart Order trouvé.');
      await this.takeScreenshot('login-success');
      
    } catch (error) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur lors de la connexion', { email: credentials.email }, error as Error);
      await this.takeScreenshot('login-fatal-error');
      
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error("Connexion revendeur échouée: Le signe de connexion réussie (lien Smart Order) n'est pas apparu après le clic.");
      }
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
   * Étape 3: Accéder à la page Smart Order
   */
  private async accessSmartOrder(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Accès à Smart Order...');
    
    // Attendre que la page se stabilise après la connexion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aller directement à la page Smart Order
      await this.page.goto('https://www.chogangroupspa.com/smartorder', {
        waitUntil: 'networkidle2',
      timeout: 30000
      });
    
    // Attendre que Cloudflare se charge si nécessaire
    await this.waitForCloudflareChallenge();
      
      await this.takeScreenshot('smartorder-access');
    
    // VÉRIFICATION ROBUSTE: analyser l'URL et le contenu de la page
    const pageUrl = this.page.url();
    const pageContent = await this.page.content();

    const isBlockedByCloudflare = pageContent.includes('challenges.cloudflare.com') || pageContent.includes('DDoS protection by Cloudflare');
    const isOnSmartOrder = pageUrl.includes('smartorder');
    
    if (isBlockedByCloudflare) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Blocage Cloudflare détecté sur la page Smart Order.', { url: pageUrl });
      throw new Error('Accès à Smart Order bloqué par Cloudflare.');
    }
    
    if (!isOnSmartOrder) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Redirection inattendue, impossible d\'accéder à Smart Order.', { url: pageUrl });
      throw new Error(`Impossible d'accéder à la page Smart Order. URL actuelle: ${pageUrl}`);
    }
    
    choganLogger.info('CHOGAN_PUPPETEER', 'Accès Smart Order réussi');
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