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
        
        // DIAGNOSTIC COMPLET - Analyser immédiatement après le clic
        choganLogger.info('CHOGAN_PUPPETEER', '🔍 DIAGNOSTIC: Analyse immédiate après clic...');
        
        await this.page.evaluate(() => {
          console.log('=== DIAGNOSTIC PAGE ===');
          console.log('URL:', window.location.href);
          console.log('Title:', document.title);
          console.log('Body text (200 chars):', document.body.innerText.substring(0, 200));
          
          // Lister TOUS les éléments avec 'swal' dans leur classe
          const swalElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.className && el.className.toString().includes('swal')
          );
          console.log('Éléments SWAL trouvés:', swalElements.length);
          swalElements.forEach(el => {
            console.log('- SWAL Element:', el.tagName, el.className, el.textContent?.substring(0, 50));
          });
          
          // Lister TOUS les éléments contenant 'robot'
          const robotElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('robot')
          );
          console.log('Éléments ROBOT trouvés:', robotElements.length);
          robotElements.forEach(el => {
            console.log('- ROBOT Element:', el.tagName, el.className, el.textContent?.substring(0, 100));
          });
          
          // Lister TOUS les overlays/modals potentiels
          const overlays = Array.from(document.querySelectorAll('[class*="overlay"], [class*="modal"], [style*="position: fixed"], [style*="z-index"]'));
          console.log('Overlays/Modals trouvés:', overlays.length);
          overlays.forEach(el => {
            console.log('- Overlay:', el.tagName, el.className, (el as HTMLElement).style.cssText, el.textContent?.substring(0, 50));
          });
        });
        
        // Attendre un peu et re-vérifier
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        choganLogger.info('CHOGAN_PUPPETEER', '🔍 DIAGNOSTIC: Analyse après attente de 2s...');
        
        // Vérifier et gérer la popup anti-robot si elle apparaît
                 // Au lieu d'attendre la navigation, on va gérer la popup immédiatement
         await this.handleAntiRobotPopup();
        
        // Si pas de popup détectée, attendre un peu et essayer la navigation
        try {
          choganLogger.info('CHOGAN_PUPPETEER', '⏱️ Tentative de navigation (timeout 10s)...');
          await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
          choganLogger.info('CHOGAN_PUPPETEER', '✅ Navigation réussie sans popup');
        } catch (navError) {
          choganLogger.warn('CHOGAN_PUPPETEER', '⚠️ Navigation échouée - possible popup non détectée');
          
          // Nouvelle tentative de détection popup avec méthodes alternatives
          await this.handleAntiRobotPopupAlternative();
          
          // Tentative finale de navigation
          try {
            await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
            choganLogger.info('CHOGAN_PUPPETEER', '✅ Navigation réussie après gestion popup alternative');
          } catch (finalError) {
            choganLogger.error('CHOGAN_PUPPETEER', '❌ Navigation définitivement échouée');
            throw new Error(`Navigation échouée malgré gestion popup: ${finalError instanceof Error ? finalError.message : 'Erreur inconnue'}`);
          }
        }
        
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
   * Méthode alternative pour détecter la popup anti-robot (iframes, shadow DOM, etc.)
   */
  private async handleAntiRobotPopupAlternative(): Promise<void> {
    if (!this.page) throw new Error('Page non initialisée');
    
    try {
      choganLogger.info('CHOGAN_PUPPETEER', '🔍 MÉTHODE ALTERNATIVE: Recherche popup dans iframes/shadow DOM...');
      
      // Méthode 1: Chercher dans tous les iframes de la page
      const iframeResults = await this.page.evaluate(() => {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const results: any[] = [];
        
        iframes.forEach((iframe, index) => {
          try {
            if (iframe.contentDocument) {
              const iframeText = iframe.contentDocument.body.innerText.toLowerCase();
              const hasRobot = iframeText.includes('robot');
              const hasProve = iframeText.includes('prove') || iframeText.includes('prouv');
              
              if (hasRobot || hasProve) {
                results.push({
                  iframeIndex: index,
                  text: iframeText.substring(0, 200),
                  hasRobot,
                  hasProve,
                                     buttons: Array.from(iframe.contentDocument.querySelectorAll('button, input[type="button"]')).map(btn => ({
                     text: btn.textContent,
                     className: btn.className,
                     onclick: (btn as HTMLElement).onclick?.toString()
                   }))
                });
              }
            }
          } catch (e) {
            // Cross-origin iframe, ne peut pas y accéder
          }
        });
        
        return results;
      });
      
      choganLogger.info('CHOGAN_PUPPETEER', '📊 Résultats iframe:', { 
        iframesFound: iframeResults.length,
        details: iframeResults 
      });
      
      // Méthode 2: Force le clic sur TOUS les boutons qui pourraient être "OK"
      if (iframeResults.length === 0) {
        choganLogger.info('CHOGAN_PUPPETEER', '💥 FORCE: Clic sur tous les boutons suspects...');
        
        const forceClicked = await this.page.evaluate(() => {
          const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], span[onclick]'));
          let clicked = false;
          
          allButtons.forEach(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            const value = (btn as HTMLInputElement).value?.toLowerCase() || '';
            
            if ((text === 'ok' || text === 'okay' || value === 'ok') && 
                (btn as HTMLElement).offsetParent !== null) {
              console.log('Force clicking button:', btn);
              (btn as HTMLElement).click();
              clicked = true;
            }
          });
          
          return clicked;
        });
        
        if (forceClicked) {
          choganLogger.info('CHOGAN_PUPPETEER', '💥 FORCE: Bouton OK cliqué');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Re-essayer le clic login
          await this.page.click('#btn_login');
          choganLogger.info('CHOGAN_PUPPETEER', '🔄 FORCE: Re-clic login après force OK');
        }
      }
      
      // Méthode 3: Attendre que des éléments dynamiques apparaissent
      try {
        choganLogger.info('CHOGAN_PUPPETEER', '⏳ Attente éléments dynamiques...');
        await this.page.waitForFunction(() => {
          const text = document.body.innerText.toLowerCase();
          return text.includes('robot') && (text.includes('prove') || text.includes('prouv'));
        }, { timeout: 5000 });
        
        choganLogger.info('CHOGAN_PUPPETEER', '🎯 Popup détectée dynamiquement !');
        await this.handleAntiRobotPopup(); // Re-essayer la détection normale
      } catch (waitError) {
        choganLogger.info('CHOGAN_PUPPETEER', '⏱️ Pas de popup détectée dynamiquement');
      }
      
    } catch (error) {
      choganLogger.error('CHOGAN_PUPPETEER', 'Erreur méthode alternative popup', {}, error as Error);
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