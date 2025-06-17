/**
 * Script de diagnostic pour tester l'hypothèse d'authentification
 * Ce script teste l'accès aux pages Smart Order avec et sans cookies d'auth
 */

import axios, { AxiosResponse } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { choganLogger } from '../utils/logger';

// Wrapper axios avec support cookies
const client = wrapper(axios.create({
  timeout: 30000,
  maxRedirects: 5
}));

interface TestResult {
  url: string;
  withAuth: boolean;
  status: number;
  success: boolean;
  responseSize: number;
  hasSessionToken: boolean;
  cloudflareBlocked: boolean;
  authRequired: boolean;
  details: string;
}

class AuthDiagnosticTester {
  private cookieJar: CookieJar;
  private testResults: TestResult[] = [];

  constructor() {
    this.cookieJar = new CookieJar();
  }

  /**
   * Injecte des cookies d'authentification manuels
   */
  async injectAuthCookies(cookies: string[]): Promise<void> {
    choganLogger.info('AUTH_TEST', 'Injection des cookies d\'authentification');
    
    for (const cookie of cookies) {
      try {
        await this.cookieJar.setCookie(cookie, 'https://www.chogangroupspa.com');
        choganLogger.debug('AUTH_TEST', 'Cookie injecté', { cookie: cookie.substring(0, 50) + '...' });
      } catch (error) {
        choganLogger.error('AUTH_TEST', 'Erreur injection cookie', { cookie }, error as Error);
      }
    }
  }

  /**
   * Teste l'accès à une URL spécifique
   */
  async testUrlAccess(url: string, withAuth: boolean): Promise<TestResult> {
    const testStart = Date.now();
    choganLogger.info('AUTH_TEST', `Test d'accès ${withAuth ? 'AVEC' : 'SANS'} auth`, { url });

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };

    let result: TestResult = {
      url,
      withAuth,
      status: 0,
      success: false,
      responseSize: 0,
      hasSessionToken: false,
      cloudflareBlocked: false,
      authRequired: false,
      details: ''
    };

    try {
      const response: AxiosResponse = await client.get(url, {
        headers,
        jar: withAuth ? this.cookieJar : undefined,
        withCredentials: withAuth,
        validateStatus: () => true // Accepter tous les status codes
      });

      const duration = Date.now() - testStart;
      result.status = response.status;
      result.responseSize = response.data?.length || 0;

      // Analyser la réponse
      const responseText = response.data?.toString() || '';
      
      // Vérifier les indices d'authentification
      result.hasSessionToken = /csrf|session|token/i.test(responseText);
      result.cloudflareBlocked = response.headers['cf-ray'] !== undefined || /cloudflare/i.test(responseText);
      result.authRequired = /login|signin|unauthorized|access denied/i.test(responseText) || 
                           responseText.includes('Se connecter') || 
                           responseText.includes('Connexion requise');

      // Déterminer le succès
      result.success = response.status === 200 && result.responseSize > 1000; // Page complète

      // Détails de diagnostic
      const details: string[] = [];
      details.push(`Status: ${response.status}`);
      details.push(`Taille réponse: ${result.responseSize} bytes`);
      details.push(`Durée: ${duration}ms`);
      details.push(`Headers CF: ${Object.keys(response.headers).filter(h => h.startsWith('cf-')).join(', ')}`);
      
      if (result.hasSessionToken) details.push('Tokens de session détectés');
      if (result.cloudflareBlocked) details.push('Protection Cloudflare active');
      if (result.authRequired) details.push('Authentification requise détectée');

      result.details = details.join(' | ');

      // Logging détaillé
      choganLogger.httpRequest('GET', url, response.status, {
        withAuth,
        responseSize: result.responseSize,
        hasSessionToken: result.hasSessionToken,
        cloudflareBlocked: result.cloudflareBlocked,
        authRequired: result.authRequired,
        duration
      });

      // Extraire quelques lignes significatives pour le debug
      const significantLines = responseText
        .split('\n')
        .filter(line => line.includes('login') || line.includes('auth') || line.includes('session') || line.includes('csrf'))
        .slice(0, 3);
      
      if (significantLines.length > 0) {
        choganLogger.debug('AUTH_TEST', 'Lignes significatives détectées', { lines: significantLines });
      }

    } catch (error: any) {
      result.details = `Erreur: ${error.message}`;
      choganLogger.httpError('GET', url, error as Error, error.response?.status);
    }

    this.testResults.push(result);
    return result;
  }

  /**
   * Lance une série de tests complets
   */
  async runCompleteDiagnosis(authCookies?: string[]): Promise<void> {
    choganLogger.sessionStart('AUTH_DIAGNOSIS');
    
    const urlsToTest = [
      'https://www.chogangroupspa.com/smartorder',
      'https://www.chogangroupspa.com/smartorder/add-product',
      'https://www.chogangroupspa.com/smartorder/completed'
    ];

    choganLogger.info('AUTH_TEST', 'Début du diagnostic d\'authentification', {
      urls: urlsToTest.length,
      hasAuthCookies: !!authCookies
    });

    // Phase 1: Tests sans authentification
    choganLogger.info('AUTH_TEST', '=== PHASE 1: Tests SANS authentification ===');
    for (const url of urlsToTest) {
      await this.testUrlAccess(url, false);
      await this.delay(2000); // Délai entre requêtes
    }

    // Phase 2: Tests avec authentification (si cookies fournis)
    if (authCookies && authCookies.length > 0) {
      choganLogger.info('AUTH_TEST', '=== PHASE 2: Injection cookies et tests AVEC authentification ===');
      await this.injectAuthCookies(authCookies);
      
      for (const url of urlsToTest) {
        await this.testUrlAccess(url, true);
        await this.delay(2000);
      }
    }

    // Génération du rapport de diagnostic
    this.generateDiagnosisReport();
  }

  /**
   * Génère un rapport de diagnostic complet
   */
  private generateDiagnosisReport(): void {
    choganLogger.info('AUTH_TEST', '=== RAPPORT DE DIAGNOSTIC ===');

    // Grouper par URL pour comparaison
    const urlGroups = this.groupResultsByUrl();

    for (const [url, results] of Object.entries(urlGroups)) {
      choganLogger.info('AUTH_TEST', `Analyse pour: ${url}`);
      
      results.forEach(result => {
        const authText = result.withAuth ? 'AVEC auth' : 'SANS auth';
        const statusText = result.success ? '✅ SUCCÈS' : '❌ ÉCHEC';
        
        choganLogger.info('AUTH_TEST', `  ${authText}: ${statusText}`, {
          status: result.status,
          size: result.responseSize,
          details: result.details
        });
      });

      // Comparaison si on a les deux résultats
      if (results.length === 2) {
        const [withoutAuth, withAuth] = results.sort((a, b) => a.withAuth ? 1 : -1);
        this.compareResults(withoutAuth, withAuth);
      }
    }

    // Conclusions
    this.drawConclusions();
  }

  /**
   * Compare les résultats avec/sans auth
   */
  private compareResults(withoutAuth: TestResult, withAuth: TestResult): void {
    const differences: string[] = [];
    
    if (withoutAuth.status !== withAuth.status) {
      differences.push(`Status: ${withoutAuth.status} → ${withAuth.status}`);
    }
    
    if (Math.abs(withoutAuth.responseSize - withAuth.responseSize) > 500) {
      differences.push(`Taille: ${withoutAuth.responseSize} → ${withAuth.responseSize} bytes`);
    }

    if (withoutAuth.authRequired !== withAuth.authRequired) {
      differences.push(`Auth requise: ${withoutAuth.authRequired} → ${withAuth.authRequired}`);
    }

    if (differences.length > 0) {
      choganLogger.warn('AUTH_TEST', '  🔍 DIFFÉRENCES DÉTECTÉES:', { differences });
    } else {
      choganLogger.info('AUTH_TEST', '  ⚖️ Résultats identiques (authentification sans effet)');
    }
  }

  /**
   * Tire les conclusions du diagnostic
   */
  private drawConclusions(): void {
    choganLogger.info('AUTH_TEST', '=== CONCLUSIONS DU DIAGNOSTIC ===');

    const successWithoutAuth = this.testResults.filter(r => !r.withAuth && r.success).length;
    const successWithAuth = this.testResults.filter(r => r.withAuth && r.success).length;
    const authRequiredDetected = this.testResults.some(r => r.authRequired);
    const allCloudflareBlocked = this.testResults.every(r => r.cloudflareBlocked);

    if (successWithAuth > successWithoutAuth) {
      choganLogger.info('AUTH_TEST', '🎯 CONCLUSION: L\'authentification RÉSOUT le problème!');
      choganLogger.info('AUTH_TEST', 'Recommandation: Implémenter l\'extraction et injection de cookies d\'auth');
    } else if (successWithoutAuth === 0 && successWithAuth === 0) {
      if (allCloudflareBlocked) {
        choganLogger.warn('AUTH_TEST', '🛡️ CONCLUSION: Problème Cloudflare persistant même avec auth');
      } else if (authRequiredDetected) {
        choganLogger.warn('AUTH_TEST', '🔐 CONCLUSION: Authentification détectée comme requise mais cookies insuffisants');
      } else {
        choganLogger.error('AUTH_TEST', '❓ CONCLUSION: Problème non lié à l\'authentification');
      }
    } else {
      choganLogger.info('AUTH_TEST', '⚖️ CONCLUSION: L\'authentification n\'a pas d\'impact significatif');
    }

    choganLogger.sessionEnd(successWithAuth > 0, 'AUTH_DIAGNOSIS');
  }

  private groupResultsByUrl(): { [url: string]: TestResult[] } {
    return this.testResults.reduce((groups, result) => {
      if (!groups[result.url]) groups[result.url] = [];
      groups[result.url].push(result);
      return groups;
    }, {} as { [url: string]: TestResult[] });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Méthode utilitaire pour extraire les cookies depuis une chaîne de cookies de navigateur
   */
  static parseBrowserCookies(browserCookiesString: string): string[] {
    return browserCookiesString
      .split(';')
      .map(cookie => cookie.trim())
      .filter(cookie => cookie.length > 0);
  }
}

// Script principal
async function runAuthDiagnosis() {
  const tester = new AuthDiagnosticTester();
  
  choganLogger.info('MAIN', 'Démarrage du diagnostic d\'authentification Chogan');
  
  // VRAIS COOKIES Chogan fournis par l'utilisateur
  const authCookies = [
    'user_token=eyJpdiI6IlltdmRPTUdkckEyZGRJb1RRUkx0ZXc9PSIsInZhbHVlIjoiTlAySnFpQlJhVHZwWEx4cUhGR3JadjRqVUZsY0twazBvSW14L2crdU55Y1RKSjFobmNSdkNXWnRFWWdUUzVaR2FKSWNGVUpZSWdJYVVnS1RjRzcrb21vUi81OE56aTBkRk5uS3lHS1pGcU9QZElvd2lYbnZyS1dIMGtSTDZnbDl1azRDcDFOWUc4aTFueFVBTnBjQkU1Z1NDY2hLSVo4Y1BoMlZ6emp3aWxBPSIsIm1hYyI6IjhmMjIyYzQ4Yjg5ZmQ2ZmZmM2MyYmJlMTQ2M2VlMWIzOGQ4OTk4MGE4MWQwOGU5NjllNmQzNGNiNDNjYTYxYmUiLCJ0YWciOiIifQ%3D%3D; Domain=.chogangroupspa.com; Path=/; HttpOnly',
    'XSRF-TOKEN=eyJpdiI6IkkzeFRjM1Fzd3cyL09QOW5EZVFKeEE9PSIsInZhbHVlIjoieHYrT2lISCt5aUZMQXlZVHhyekwxSTJTMWdaK2IyVm9TZzNNWmp1SzJkaCtRbThvQ1hoUUlpOWVReWNzOXBmWnZPVjJnbmE3ejUvT1lvcGo1RElWOFJuUVlJaVNCRHJUdnh4R1FYcldtM1JMR3Uzb2xxbkUwZUJjcnphOEpGQVIiLCJtYWMiOiJkZGFlODkwOGYzMGFkZmE0NThiNzhiODVmYjk5ZDUyMWVhN2Q1NDU4OTZmZWVmMDg4MDllYjk5NWE4YTVmOWNhIiwidGFnIjoiIn0%3D; Domain=.chogangroupspa.com; Path=/',
    'sponsor_code_referral=eyJpdiI6IkI4NkZkbHYyZzdVd3NpSmxmaVNXM1E9PSIsInZhbHVlIjoiTUlWMERWMkFUSFBMcm1kL2VpVVA1V0Q0ZUlETUZTQWRJWCt4U29TTmpHWUN6QjErejBFQlE0amFaNko2YXliUCIsIm1hYyI6Ijk2YTZhZDFmZDA4MTkyZWZkMjg3NjZjNTYyOWMzYTM4OGIyZjkwMmM2NzI4NDM3YmE2YjM0YjA5OGM4YTQ3NzEiLCJ0YWciOiIifQ%3D%3D; Domain=.chogangroupspa.com; Path=/; HttpOnly',
    'lang_changed=eyJpdiI6IkQ1d2U2N0FqOWgvZXVJM2VIdTE3aVE9PSIsInZhbHVlIjoiRTl2L2NjWWYzL3BoUGhubFdVeXd6cDVTR0NPSDlYTzR5WXZPdE4xV2VYbllnS3J4blUvSWhaaEd0U3VCQXZPdyIsIm1hYyI6ImNiYTllNjNjZWMzNjZlYWRlNTZmMmM4OGFlNmY3MTE2YWIxNTQwOTliZDQwNGZhMDMyMWRiMjIzNzRkZmI3MWEiLCJ0YWciOiIifQ%3D%3D; Domain=.chogangroupspa.com; Path=/'
  ];

  choganLogger.info('MAIN', 'Cookies d\'authentification Chogan détectés', {
    cookieCount: authCookies.length,
    hasuserToken: true,
    hasXSRF: true,
    hasSponsorCode: true
  });

  await tester.runCompleteDiagnosis(authCookies);
  
  choganLogger.info('MAIN', 'Diagnostic terminé - Consulter les logs pour les résultats détaillés');
}

// Exporter pour utilisation
export { AuthDiagnosticTester, runAuthDiagnosis };

// Exécution directe si script appelé
if (require.main === module) {
  runAuthDiagnosis().catch(error => {
    choganLogger.error('MAIN', 'Erreur fatale du diagnostic', {}, error);
    process.exit(1);
  });
} 