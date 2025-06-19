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
    
    // SIMPLE CLIC
    await this.page.click('#btn_login');
    choganLogger.info('CHOGAN_PUPPETEER', '✅ Clic effectué');
    
    // Attendre quelques secondes pour voir ce qui se passe
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Vérifier l'URL actuelle
    const currentUrl = this.page.url();
    choganLogger.info('CHOGAN_PUPPETEER', 'URL après clic:', currentUrl);
    
    // Si on est toujours sur login, il y a un problème
    if (currentUrl.includes('login')) {
      // Prendre une capture pour debug
      await this.page.screenshot({ path: 'screenshots/login-debug.png', fullPage: true });
      throw new Error('Toujours sur la page de login après clic');
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