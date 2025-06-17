/**
 * Script de test pour le contournement Cloudflare
 */

import { CloudflareBypass } from '../services/cloudflare-bypass';

async function testCloudflareBypass() {
  console.log('🧪 Test du contournement Cloudflare');
  console.log('='.repeat(50));
  
  const bypass = new CloudflareBypass();
  
  try {
    console.log('🎯 Test d\'accès à Chogan avec contournement Cloudflare...');
    
    const response = await bypass.bypassCloudflare('https://www.chogangroupspa.com');
    
    console.log('✅ Réponse reçue !');
    console.log('Status:', response.status);
    console.log('Headers:', Object.keys(response.headers));
    
    if (response.status === 200) {
      console.log('🎉 Cloudflare contourné avec succès !');
      
      // Tester maintenant le Smart Order
      console.log('\n🎯 Test d\'accès au Smart Order...');
      const smartOrderResponse = await bypass.bypassCloudflare('https://www.chogangroupspa.com/smartorder');
      
      console.log('Smart Order Status:', smartOrderResponse.status);
      
      if (smartOrderResponse.status === 200) {
        console.log('🎉 Smart Order accessible !');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error instanceof Error ? error.message : String(error));
    
    // Suggestions pour l'utilisateur
    console.log('\n💡 Solutions possibles:');
    console.log('1. Récupérer manuellement les cookies Cloudflare');
    console.log('2. Utiliser un VPN ou changer d\'IP');
    console.log('3. Attendre quelques minutes et réessayer');
  }
}

// Fonction pour tester avec des cookies manuels
async function testWithManualCookies() {
  console.log('\n🍪 Test avec injection de cookies manuels');
  console.log('=' .repeat(50));
  
  const bypass = new CloudflareBypass();
  
  // Exemple de cookies (à remplacer par les vrais)
  const mockCookies = {
    'cf_clearance': 'exemple_token_clearance',
    '__cf_bm': 'exemple_token_bm',
    '_cfuvid': 'exemple_cfuvid'
  };
  
  try {
    await bypass.injectCloudflareTokens(mockCookies);
    
    const response = await bypass.getAxiosInstance().get('https://www.chogangroupspa.com/smartorder', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });
    
    console.log('Status avec cookies:', response.status);
    
  } catch (error) {
    console.log('❌ Test avec cookies échoué:', error instanceof Error ? error.message : String(error));
    console.log('\n📝 Instructions pour récupérer les vrais cookies:');
    console.log('1. Ouvrir Chrome DevTools (F12)');
    console.log('2. Aller sur https://www.chogangroupspa.com/smartorder');
    console.log('3. Résoudre le challenge Cloudflare');
    console.log('4. Application → Cookies → chogangroupspa.com');
    console.log('5. Copier cf_clearance, __cf_bm, _cfuvid');
  }
}

async function main() {
  await testCloudflareBypass();
  await testWithManualCookies();
  
  console.log('\n🏁 Tests terminés');
}

if (require.main === module) {
  main().catch(console.error);
} 