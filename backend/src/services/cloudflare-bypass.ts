/**
 * Module spécialisé pour contourner les protections Cloudflare
 */

import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export class CloudflareBypass {
  private axiosInstance: AxiosInstance;
  private cookieJar: CookieJar;
  
  constructor() {
    this.cookieJar = new CookieJar();
    this.axiosInstance = wrapper(axios.create({
      jar: this.cookieJar,
      timeout: 30000,
      maxRedirects: 10,
      validateStatus: (status) => status < 500, // Accepter les 4xx pour gérer les challenges
    }));
  }

  /**
   * Génère des headers ultra-réalistes pour contourner Cloudflare
   */
  private generateRealisticHeaders(referer?: string): any {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': referer ? 'same-origin' : 'none',
      'Sec-Fetch-User': '?1',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Cache-Control': 'max-age=0',
    };

    if (referer) {
      headers['Referer'] = referer;
    }

    return headers;
  }

  /**
   * Essaie d'accéder à une URL avec différentes stratégies
   */
  async bypassCloudflare(url: string, retries: number = 3): Promise<any> {
    const strategies = [
      () => this.basicRequest(url),
      () => this.requestWithDelay(url),
      () => this.requestWithMultipleAttempts(url),
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`🔄 Tentative ${i + 1} de contournement Cloudflare...`);
        const result = await strategies[i]();
        
        if (result.status === 200) {
          console.log('✅ Cloudflare contourné avec succès !');
          return result;
        } else if (result.status === 403) {
          console.log(`⚠️ Tentative ${i + 1} bloquée (403), essai de la stratégie suivante...`);
        }
      } catch (error) {
        console.log(`❌ Tentative ${i + 1} échouée:`, error instanceof Error ? error.message : String(error));
      }

      // Délai entre les tentatives
      if (i < strategies.length - 1) {
        await this.randomDelay(2000, 5000);
      }
    }

    throw new Error('Impossible de contourner Cloudflare après toutes les tentatives');
  }

  /**
   * Requête basique avec headers réalistes
   */
  private async basicRequest(url: string): Promise<any> {
    return await this.axiosInstance.get(url, {
      headers: this.generateRealisticHeaders()
    });
  }

  /**
   * Requête avec délais aléatoires (simulation humaine)
   */
  private async requestWithDelay(url: string): Promise<any> {
    // Délai initial pour simuler le temps de chargement
    await this.randomDelay(1000, 3000);
    
    return await this.axiosInstance.get(url, {
      headers: {
        ...this.generateRealisticHeaders(),
        'DNT': '1',
        'Sec-GPC': '1'
      }
    });
  }

  /**
   * Requête avec tentatives multiples et headers variables
   */
  private async requestWithMultipleAttempts(url: string): Promise<any> {
    // Simuler une navigation depuis Google
    const googleReferer = 'https://www.google.com/';
    
    return await this.axiosInstance.get(url, {
      headers: {
        ...this.generateRealisticHeaders(googleReferer),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
      }
    });
  }

  /**
   * Délai aléatoire pour simuler un comportement humain
   */
  private randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Injecter des cookies Cloudflare manuellement (si fournis par l'utilisateur)
   */
  async injectCloudflareTokens(tokens: { [key: string]: string }, domain: string = '.chogangroupspa.com'): Promise<void> {
    for (const [name, value] of Object.entries(tokens)) {
      try {
        await this.cookieJar.setCookie(`${name}=${value}; Domain=${domain}; Path=/; Secure; HttpOnly`, `https://${domain.replace('.', '')}`);
        console.log(`✅ Cookie ${name} injecté`);
      } catch (error) {
        console.log(`⚠️ Erreur injection cookie ${name}:`, error instanceof Error ? error.message : String(error));
      }
    }
  }

  /**
   * Obtenir l'instance axios configurée
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Obtenir le jar de cookies
   */
  getCookieJar(): CookieJar {
    return this.cookieJar;
  }
} 