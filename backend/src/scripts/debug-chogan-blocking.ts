import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import * as cheerio from 'cheerio';

async function debugChoganBlocking() {
  console.log('🔍 DIAGNOSTIC : Pourquoi Chogan bloque l\'authentification\n');
  
  const cookieJar = new CookieJar();
  const axiosInstance = wrapper(axios.create({
    jar: cookieJar,
    timeout: 30000,
    maxRedirects: 0, // Désactiver les redirections pour voir ce qui se passe
    validateStatus: () => true // Accepter tous les status codes
  }));

  // Test 1: Accès page principale Chogan
  console.log('📋 TEST 1: Accès à la page principale Chogan...');
  try {
    const response = await axiosInstance.get('https://www.chogangroupspa.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers: ${JSON.stringify(Object.fromEntries(Object.entries(response.headers).slice(0, 5)))}`);
    
    if (response.status === 403) {
      console.log('   🚨 403 dès la page principale = Protection Cloudflare active');
      const isCloudflare = response.data.includes('cloudflare') || response.data.includes('Cloudflare');
      console.log(`   Cloudflare détecté: ${isCloudflare}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 2: Accès direct à login_page
  console.log('\n📋 TEST 2: Accès direct à /login_page...');
  try {
    const response = await axiosInstance.get('https://www.chogangroupspa.com/login_page', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.chogangroupspa.com/'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('   ✅ Accès à login_page réussi !');
      
      // Analyser le contenu
      const $ = cheerio.load(response.data);
      const forms = $('form').length;
      const emailField = $('input[type="email"], input[name*="email"], input[name*="Email"]').length;
      const passwordField = $('input[type="password"]').length;
      const captcha = $('[class*="captcha"], [id*="captcha"], [class*="recaptcha"]').length;
      
      console.log(`   Formulaires trouvés: ${forms}`);
      console.log(`   Champ email: ${emailField > 0 ? '✅' : '❌'}`);
      console.log(`   Champ password: ${passwordField > 0 ? '✅' : '❌'}`);
      console.log(`   CAPTCHA détecté: ${captcha > 0 ? '🚨 OUI' : '✅ NON'}`);
      
      // Chercher des tokens CSRF
      const csrfToken = $('meta[name="csrf-token"]').attr('content') || 
                       $('input[name="_token"]').val();
      console.log(`   Token CSRF: ${csrfToken ? '✅ Trouvé' : '❌ Absent'}`);
      
    } else if (response.status === 403) {
      console.log('   🚨 403 sur login_page');
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      
      // Analyser si c'est Cloudflare
      const bodyText = response.data.toString().toLowerCase();
      const cloudflareIndicators = [
        'cloudflare',
        'cf-ray',
        'challenge',
        'just a moment',
        'checking your browser',
        'ddos protection'
      ];
      
      const detectedIndicators = cloudflareIndicators.filter(indicator => 
        bodyText.includes(indicator)
      );
      
      console.log(`   Indicateurs Cloudflare: ${detectedIndicators.join(', ') || 'Aucun'}`);
      
    } else if (response.status === 302 || response.status === 301) {
      console.log(`   🔀 Redirection vers: ${response.headers.location}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 3: Headers plus sophistiqués
  console.log('\n📋 TEST 3: Tentative avec headers navigateur complets...');
  try {
    const response = await axiosInstance.get('https://www.chogangroupspa.com/login_page', {
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
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'cache-control': 'max-age=0',
        'dnt': '1',
        'Referer': 'https://www.chogangroupspa.com/'
      }
    });
    
    console.log(`   Status avec headers complets: ${response.status}`);
    
    if (response.status === 200) {
      console.log('   ✅ Succès avec headers complets !');
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 4: Délai et retry
  console.log('\n📋 TEST 4: Test avec délai (anti rate-limiting)...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const response = await axiosInstance.get('https://www.chogangroupspa.com/login_page');
    console.log(`   Status après délai: ${response.status}`);
  } catch (error) {
    console.log(`   ❌ Erreur après délai: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log('\n🎯 CONCLUSION:');
  console.log('   - Si 403 partout = Protection Cloudflare/WAF');
  console.log('   - Si 200 sur page principale mais 403 sur login = Protection spécifique');
  console.log('   - Si CAPTCHA détecté = Besoin de résolution humaine');
  console.log('   - Si token CSRF = Besoin de récupération préalable');
}

// Exécution
if (require.main === module) {
  debugChoganBlocking().then(() => {
    console.log('\n🏁 Diagnostic terminé');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Erreur de diagnostic:', error);
    process.exit(1);
  });
}

export { debugChoganBlocking }; 