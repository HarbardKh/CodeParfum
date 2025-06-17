import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import * as cheerio from 'cheerio';
import { choganLogger } from '../utils/logger';

// Types pour les données d'entrée
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
}

export interface AutomationResult {
  success: boolean;
  chogan_link?: string;
  error?: string;
  details?: string;
}

export class ChoganAutomation {
  private axiosInstance: AxiosInstance;
  private cookieJar: CookieJar;
  private baseUrl = 'https://www.chogangroupspa.com';

  constructor() {
    this.cookieJar = new CookieJar();
    
    // Configuration axios avec support des cookies et headers anti-détection Cloudflare
    this.axiosInstance = wrapper(axios.create({
      jar: this.cookieJar,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'cache-control': 'max-age=0'
      }
    }));
  }

  /**
   * Point d'entrée principal pour automatiser une commande
   */
  async processOrder(orderData: OrderRequest): Promise<AutomationResult> {
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      choganLogger.sessionStart(orderId);
      choganLogger.info('CHOGAN_ORDER', 'Début du traitement de commande', {
        orderId,
        client: `${orderData.client.prenom} ${orderData.client.nom}`,
        email: orderData.client.email,
        produits: orderData.produits.length
      });
      
      // Étape 1: Initialisation de session
      await this.initializeSession();
      
      // Étape 2: Soumission des infos client
      await this.submitClientInfo(orderData.client);
      
      // Étape 3: Ajout des produits
      await this.addProducts(orderData.produits);
      
      // Étape 4: Sélection des frais de port
      await this.selectShippingOptions();
      
      // Étape 5: Finalisation et récupération du lien
      const finalLink = await this.finalizOrderAndGetLink();
      
      choganLogger.sessionEnd(true, orderId, finalLink);
      return {
        success: true,
        chogan_link: finalLink
      };
      
    } catch (error) {
      choganLogger.sessionEnd(false, orderId);
      choganLogger.error('CHOGAN_ORDER', 'Erreur lors de l\'automatisation', { orderId }, error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: error instanceof Error ? error.stack : undefined
      };
    }
  }

  /**
   * Étape 1: Initialiser la session Smart Order
   */
  private async initializeSession(): Promise<void> {
    choganLogger.info('CHOGAN_SESSION', 'Initialisation de la session Smart Order...');
    
    const response = await this.axiosInstance.get(`${this.baseUrl}/smartorder`, {
      headers: {
        'Referer': this.baseUrl
      }
    });
    
    choganLogger.httpRequest('GET', '/smartorder', response.status);
    
    if (response.status !== 200) {
      choganLogger.httpError('GET', '/smartorder', new Error(`Status ${response.status}`), response.status);
      throw new Error(`Échec de l'initialisation: ${response.status}`);
    }
    
    // Parsing pour récupérer d'éventuels tokens CSRF
    const $ = cheerio.load(response.data);
    const csrfToken = $('meta[name="csrf-token"]').attr('content') || 
                     $('input[name="_token"]').val() as string;
    
    if (csrfToken) {
      this.axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
      choganLogger.info('CHOGAN_SESSION', 'Token CSRF détecté et configuré');
    }
    
    choganLogger.info('CHOGAN_SESSION', 'Session initialisée avec succès');
  }

  /**
   * Étape 2: Soumettre les informations client
   */
  private async submitClientInfo(client: ClientData): Promise<void> {
    choganLogger.info('CHOGAN_CLIENT', 'Soumission des informations client...');
    
    const clientPayload = {
      prenom: client.prenom,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      code_postal: client.codePostal,
      departement: client.departement,
      ville: client.ville,
      pays: client.pays
    };
    
    // POST vers la vraie URL du formulaire Smart Order
    const response = await this.axiosInstance.post(`${this.baseUrl}/smartorder`, clientPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': `${this.baseUrl}/smartorder`,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'origin': this.baseUrl
      }
    });
    
    choganLogger.httpRequest('POST', '/smartorder', response.status, clientPayload);
    
    if (response.status !== 200 && response.status !== 302) {
      choganLogger.clientSubmitted(client.email, false);
      choganLogger.httpError('POST', '/smartorder', new Error(`Status ${response.status}`), response.status);
      throw new Error(`Échec soumission client: ${response.status}`);
    }
    
    choganLogger.clientSubmitted(client.email, true);
  }

  /**
   * Étape 3: Ajouter les produits au panier
   */
  private async addProducts(produits: ProductData[]): Promise<void> {
    choganLogger.info('CHOGAN_PRODUCT', `Ajout de ${produits.length} produit(s)...`);
    
    for (const produit of produits) {
      await this.addSingleProduct(produit);
      // Délai pour éviter la détection anti-bot
      await this.delay(500);
    }
    
    choganLogger.info('CHOGAN_PRODUCT', 'Tous les produits ajoutés avec succès');
  }

  /**
   * Ajouter un produit individuel
   */
  private async addSingleProduct(produit: ProductData): Promise<void> {
    const productPayload = {
      reference: produit.ref,
      quantite: produit.quantite.toString()
    };
    
    // POST vers la vraie URL pour ajouter un produit
    const response = await this.axiosInstance.post(`${this.baseUrl}/smartorder/add-product`, productPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': `${this.baseUrl}/smartorder`,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'origin': this.baseUrl
      }
    });
    
    choganLogger.httpRequest('POST', '/smartorder/add-product', response.status, productPayload);
    
    if (response.status !== 200 && response.status !== 302) {
      choganLogger.productAdded(produit.ref, produit.quantite, false);
      choganLogger.httpError('POST', '/smartorder/add-product', new Error(`Status ${response.status}`), response.status);
      throw new Error(`Échec ajout produit ${produit.ref}: ${response.status}`);
    }
    
    choganLogger.productAdded(produit.ref, produit.quantite, true);
  }

  /**
   * Étape 4: Sélectionner les frais de port
   */
  private async selectShippingOptions(): Promise<void> {
    choganLogger.info('CHOGAN_SHIPPING', 'Sélection des frais de port...');
    
    const shippingPayload = {
      frais_port: 'client' // Frais à la charge du client
    };
    
    // Les frais de port peuvent être sur la même URL que les produits
    const response = await this.axiosInstance.post(`${this.baseUrl}/smartorder/add-product`, shippingPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': `${this.baseUrl}/smartorder/add-product`,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'origin': this.baseUrl
      }
    });
    
    choganLogger.httpRequest('POST', '/smartorder/add-product (shipping)', response.status, shippingPayload);
    
    if (response.status !== 200 && response.status !== 302) {
      choganLogger.httpError('POST', '/smartorder/add-product (shipping)', new Error(`Status ${response.status}`), response.status);
      throw new Error(`Échec sélection livraison: ${response.status}`);
    }
    
    choganLogger.info('CHOGAN_SHIPPING', 'Frais de port sélectionnés avec succès');
  }

  /**
   * Étape 5: Finaliser et récupérer le lien
   */
  private async finalizOrderAndGetLink(): Promise<string> {
    choganLogger.info('CHOGAN_FINALIZE', 'Finalisation de la commande...');
    
    // Finaliser la commande et rediriger vers completed
    const response = await this.axiosInstance.post(`${this.baseUrl}/smartorder/add-product`, 
      { action: 'complete' }, // Signal pour finaliser
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `${this.baseUrl}/smartorder/add-product`,
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'origin': this.baseUrl
        },
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      }
    );
    
    // Vérifier si on est arrivé sur la page completed
    let finalUrl = '';
    
    if (response.status === 302 && response.headers.location) {
      finalUrl = response.headers.location;
    } else if (response.config?.url?.includes('/completed') || response.request?.responseURL?.includes('/completed')) {
      // On est déjà sur la page completed
      finalUrl = `${this.baseUrl}/smartorder/completed`;
      
      // Extraire le lien de validation de la page completed
      const $ = cheerio.load(response.data);
      const validationLink = $('a[href*="confirmation"]').attr('href') ||
                           $('a[href*="validation"]').attr('href') ||
                           $('a[href*="order"]').attr('href') ||
                           finalUrl;
      
      finalUrl = validationLink.startsWith('http') ? validationLink : `${this.baseUrl}${validationLink}`;
    } else {
      // Essayer d'accéder directement à la page completed
      try {
        const completedResponse = await this.axiosInstance.get(`${this.baseUrl}/smartorder/completed`);
        finalUrl = `${this.baseUrl}/smartorder/completed`;
        
        const $ = cheerio.load(completedResponse.data);
        const validationLink = $('a[href*="confirmation"]').attr('href') ||
                             $('a[href*="validation"]').attr('href') ||
                             $('a[href*="order"]').attr('href');
        
        if (validationLink) {
          finalUrl = validationLink.startsWith('http') ? validationLink : `${this.baseUrl}${validationLink}`;
        }
      } catch (error) {
        throw new Error(`Impossible d'accéder à la page completed: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
    
    if (!finalUrl) {
      throw new Error('Impossible de récupérer le lien final');
    }
    
    choganLogger.info('CHOGAN_FINALIZE', 'Lien de validation récupéré avec succès', { finalUrl });
    return finalUrl;
  }

  /**
   * Utilitaire pour ajouter des délais
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Méthode de test pour vérifier la connectivité
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(this.baseUrl);
      return response.status === 200;
    } catch (error) {
      console.error('Test de connexion échoué:', error);
      return false;
    }
  }
} 