const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').wrapper;
const tough = require('tough-cookie');
const cheerio = require('cheerio');

async function debugChoganBlocking() {
  console.log('🔍 DIAGNOSTIC : Pourquoi Chogan bloque l\'authentification\n');
  
  const cookieJar = new tough.CookieJar();
  const axiosInstance = axiosCookieJarSupport(axios.create({
    jar: cookieJar,
    timeout: 30000,
    maxRedirects: 0,
    validateStatus: () => true
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
    console.log(`   Server: ${response.headers.server || 'N/A'}`);
    console.log(`   Content-Type: ${response.headers['content-type'] || 'N/A'}`);
    
    if (response.status === 403) {
      console.log('   🚨 403 dès la page principale = Protection active');
      const bodyText = response.data.toString().toLowerCase();
      const isCloudflare = bodyText.includes('cloudflare') || bodyText.includes('cf-ray');
      console.log(`   Cloudflare détecté: ${isCloudflare}`);
      
      if (isCloudflare) {
        console.log('   📋 Type de protection: Cloudflare');
        const hasChallenge = bodyText.includes('challenge') || bodyText.includes('just a moment');
        console.log(`   Challenge page: ${hasChallenge}`);
      }
    } else if (response.status === 200) {
      console.log('   ✅ Page principale accessible');
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
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
      
      const $ = cheerio.load(response.data);
      const forms = $('form').length;
      const emailField = $('input[type="email"], input[name*="email"], input[name*="Email"]').length;
      const passwordField = $('input[type="password"]').length;
      const captcha = $('[class*="captcha"], [id*="captcha"], [class*="recaptcha"]').length;
      
      console.log(`   Formulaires trouvés: ${forms}`);
      console.log(`   Champ email: ${emailField > 0 ? '✅' : '❌'}`);
      console.log(`   Champ password: ${passwordField > 0 ? '✅' : '❌'}`);
      console.log(`   CAPTCHA détecté: ${captcha > 0 ? '🚨 OUI' : '✅ NON'}`);
      
    } else if (response.status === 403) {
      console.log('   🚨 403 sur login_page');
      const bodyText = response.data.toString().toLowerCase();
      
      const cloudflareIndicators = [
        'cloudflare', 'cf-ray', 'challenge', 'just a moment',
        'checking your browser', 'ddos protection'
      ];
      
      const detected = cloudflareIndicators.filter(indicator => 
        bodyText.includes(indicator)
      );
      
      console.log(`   Indicateurs Cloudflare: ${detected.length > 0 ? detected.join(', ') : 'Aucun'}`);
      
    } else if (response.status === 302 || response.status === 301) {
      console.log(`   🔀 Redirection vers: ${response.headers.location}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }

  // Test 3: Différents User-Agents
  console.log('\n📋 TEST 3: Test avec différents User-Agents...');
  
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];
  
  for (let i = 0; i < userAgents.length; i++) {
    try {
      const response = await axiosInstance.get('https://www.chogangroupspa.com/login_page', {
        headers: { 'User-Agent': userAgents[i] }
      });
      console.log(`   User-Agent ${i+1}: Status ${response.status}`);
      if (response.status === 200) {
        console.log('   ✅ Succès avec ce User-Agent !');
        break;
      }
    } catch (error) {
      console.log(`   User-Agent ${i+1}: Erreur`);
    }
    
    // Délai entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎯 CONCLUSIONS:');
  console.log('   - 403 sur page principale = Protection globale Cloudflare');
  console.log('   - 403 uniquement sur login = Protection spécifique anti-bot');
  console.log('   - 200 avec certains User-Agents = Filtrage basique');
  console.log('   - Redirection = Besoin d\'authentification préalable');
}

debugChoganBlocking().then(() => {
  console.log('\n🏁 Diagnostic terminé');
}).catch(error => {
  console.error('💥 Erreur:', error.message);
}); 