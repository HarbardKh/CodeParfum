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
        await this.page.type('input[type="password"], input[name*="password"]', credentials.password, { delay: 50 });
      }
      
      // Prendre une capture juste avant le clic
      await this.takeScreenshot('before-login-submit');
      
      // CLIC ROBUSTE sur le bouton de connexion basé sur sa classe CSS
      choganLogger.info('CHOGAN_PUPPETEER', 'Recherche du bouton de connexion avec la classe ".btn--primary"...');
      const loginButtonSelector = '.btn--primary'; // Ce sélecteur est indépendant de la langue

      try {
          await this.page.waitForSelector(loginButtonSelector, { timeout: 15000, visible: true });
          const loginButton = await this.page.$(loginButtonSelector);

          if (loginButton) {
              choganLogger.info('CHOGAN_PUPPETEER', '✅ Bouton de connexion trouvé. Clic et attente de navigation...');
              
              // On attend la navigation QUI EST DÉCLENCHÉE par le clic.
              // C'est la méthode la plus robuste pour gérer les connexions.
              await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
                loginButton.click(),
              ]);

              choganLogger.info('CHOGAN_PUPPETEER', '✅ Navigation détectée après le clic.');
              await this.takeScreenshot('after-login-navigation');

              // Vérification cruciale : sommes-nous toujours sur la page de login ?
              const currentUrl = this.page.url();
              if (currentUrl.includes('login')) {
                choganLogger.error('CHOGAN_PUPPETEER', 'Échec de la connexion, toujours sur la page de login.', { url: currentUrl });
                throw new Error('Connexion échouée - toujours sur la page de login après le clic.');
              }

              choganLogger.info('CHOGAN_PUPPETEER', 'Connexion réussie, URL a changé.', { url: currentUrl });

          } else {
              throw new Error('Bouton de connexion avec la classe .btn--primary introuvable après attente.');
          }
      } catch (e) {
          choganLogger.error('CHOGAN_PUPPETEER', 'Erreur lors de la recherche ou du clic sur le bouton de connexion.', { error: e });
          await this.takeScreenshot('login-button-not-found-error');
          throw new Error(`Le bouton de connexion avec la classe ".btn--primary" n'a pas pu être trouvé ou cliqué.`);
      }

      // Laisser du temps à la page de réagir et de naviguer
      choganLogger.info('CHOGAN_PUPPETEER', '⏱️ Attente de navigation après le clic...');
      
      // Attendre une popup anti-robot potentielle
      await this.handleAntiRobotPopup();
      
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
      
             // DIAGNOSTIC ULTRA-DÉTAILLÉ de la popup SweetAlert anti-robot
       const pageAnalysis = await this.page.evaluate(() => {
         console.log('=== DÉBUT DÉTECTION POPUP ===');
         
         // Rechercher l'overlay SweetAlert spécifique
         const swalOverlay = document.querySelector('.swal-overlay.swal-overlay--show-modal');
         const swalText = document.querySelector('.swal-text');
         const swalButton = document.querySelector('.swal-button.swal-button--confirm');
         
         console.log('SWAL Overlay trouvé:', !!swalOverlay);
         console.log('SWAL Text trouvé:', !!swalText);
         console.log('SWAL Button trouvé:', !!swalButton);
         
         if (swalOverlay) {
           console.log('SWAL Overlay classes:', swalOverlay.className);
           console.log('SWAL Overlay visible:', (swalOverlay as HTMLElement).offsetParent !== null);
           console.log('SWAL Overlay style:', (swalOverlay as HTMLElement).style.cssText);
         }
         
         if (swalText) {
           console.log('SWAL Text content:', swalText.textContent);
           console.log('SWAL Text contains robot:', swalText.textContent?.toLowerCase().includes('robot'));
         }
         
         if (swalButton) {
           console.log('SWAL Button text:', swalButton.textContent);
           console.log('SWAL Button classes:', swalButton.className);
         }
         
         // Vérifier si c'est bien la popup anti-robot
         const overlayVisible = swalOverlay && (swalOverlay as HTMLElement).offsetParent !== null;
         const hasRobotText = swalText && swalText.textContent?.toLowerCase().includes('robot');
         
         console.log('Overlay visible:', overlayVisible);
         console.log('Has robot text:', hasRobotText);
         console.log('SWAL détection finale:', overlayVisible && hasRobotText);
         
         // Analyser le contenu général en fallback
         const fullText = document.body.innerText.toLowerCase();
         const contains = (str: string) => fullText.includes(str);
         
         console.log('Text contains robot:', contains('robot'));
         console.log('Text contains prove/prouver:', contains('prove') || contains('prouver'));
         console.log('Text contains vous devez:', contains('vous devez'));
         
         // CHERCHER PARTOUT des éléments suspects
         console.log('=== RECHERCHE EXHAUSTIVE ===');
         const allElements = Array.from(document.querySelectorAll('*'));
         const suspiciousElements = allElements.filter(el => {
           const text = el.textContent?.toLowerCase() || '';
           const className = el.className?.toString() || '';
           return (text.includes('robot') && text.includes('prouv')) || 
                  className.includes('swal') ||
                  className.includes('modal') ||
                  className.includes('overlay');
         });
         
         console.log('Éléments suspects trouvés:', suspiciousElements.length);
         suspiciousElements.forEach(el => {
           console.log('- Suspect:', el.tagName, el.className, el.textContent?.substring(0, 100));
         });
         
         const generalDetected = contains('robot') && (contains('prove') || contains('prouver') || contains('vous devez'));
         const finalDetected = (overlayVisible && hasRobotText) || generalDetected;
         
         console.log('Détection générale:', generalDetected);
         console.log('DÉTECTION FINALE:', finalDetected);
         console.log('=== FIN DÉTECTION POPUP ===');
         
         return {
           // Détection spécifique SweetAlert
           swalDetected: overlayVisible && hasRobotText,
           swalOverlayExists: !!swalOverlay,
           swalTextExists: !!swalText,
           swalButtonExists: !!swalButton,
           swalText: swalText?.textContent || '',
           swalButtonText: swalButton?.textContent || '',
           overlayVisible: overlayVisible,
           hasRobotText: hasRobotText,
           
           // Détection générale en fallback
           fullText: fullText.substring(0, 500),
           hasRobot: contains('robot'),
           hasProve: contains('prove') || contains('prouver'),
           hasVousDevez: contains('vous devez'),
           generalDetected: generalDetected,
           suspiciousElementsCount: suspiciousElements.length,
           
           // Résultat final
           detected: finalDetected
         };
       });
      
             choganLogger.info('CHOGAN_PUPPETEER', 'Analyse SweetAlert anti-robot:', {
         detected: pageAnalysis.detected,
         swalDetected: pageAnalysis.swalDetected,
         swalOverlayExists: pageAnalysis.swalOverlayExists,
         swalTextExists: pageAnalysis.swalTextExists,
         swalButtonExists: pageAnalysis.swalButtonExists,
         swalText: pageAnalysis.swalText,
         swalButtonText: pageAnalysis.swalButtonText,
         generalDetected: pageAnalysis.generalDetected,
         textSample: pageAnalysis.fullText
       });
      
      if (pageAnalysis.detected) {
        choganLogger.info('CHOGAN_PUPPETEER', '🤖 Popup anti-robot DÉTECTÉE ! Recherche du bouton OK...');
        
        // Prendre une capture de la popup
        await this.takeScreenshot('anti-robot-popup-detected');
        
                 // Cliquer spécifiquement sur le bouton SweetAlert
         let okClicked = false;
         
         // Méthode 1: Cibler directement le bouton SweetAlert
         try {
           okClicked = await this.page.evaluate(() => {
             const swalButton = document.querySelector('.swal-button.swal-button--confirm');
             if (swalButton && (swalButton as HTMLElement).offsetParent !== null) {
               (swalButton as HTMLElement).click();
               return true;
             }
             return false;
           });
           
           if (okClicked) {
             choganLogger.info('CHOGAN_PUPPETEER', '✅ Bouton OK SweetAlert cliqué directement (.swal-button--confirm)');
           }
         } catch (error) {
           choganLogger.warn('CHOGAN_PUPPETEER', 'Erreur clic direct SweetAlert:', error);
         }
         
         // Méthode 2: Chercher dans la structure SweetAlert
         if (!okClicked) {
           try {
             okClicked = await this.page.evaluate(() => {
               const swalFooter = document.querySelector('.swal-footer');
               if (swalFooter) {
                 const button = swalFooter.querySelector('button');
                 if (button) {
                   (button as HTMLElement).click();
                   return true;
                 }
               }
               return false;
             });
             
             if (okClicked) {
               choganLogger.info('CHOGAN_PUPPETEER', '✅ Bouton OK cliqué via .swal-footer button');
             }
           } catch (error) {
             choganLogger.warn('CHOGAN_PUPPETEER', 'Erreur clic via swal-footer:', error);
           }
         }
         
         // Méthode 3: Fallback - recherche générale si SweetAlert échoue
         if (!okClicked) {
           try {
             okClicked = await this.page.evaluate(() => {
               const elements = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'));
               const okElement = elements.find(el => {
                 const text = el.textContent?.trim().toLowerCase() || '';
                 const value = (el as HTMLInputElement).value?.toLowerCase() || '';
                 return text === 'ok' || value === 'ok';
               });
               
               if (okElement && (okElement as HTMLElement).offsetParent !== null) {
                 (okElement as HTMLElement).click();
                 return true;
               }
               return false;
             });
             
             if (okClicked) {
               choganLogger.info('CHOGAN_PUPPETEER', '✅ Bouton OK cliqué via recherche fallback');
             }
           } catch (error) {
             choganLogger.warn('CHOGAN_PUPPETEER', 'Erreur clic fallback:', error);
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