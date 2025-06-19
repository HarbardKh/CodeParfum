import { ChoganPuppeteerSimple } from '../services/chogan-puppeteer-simple';
import { choganLogger } from '../utils/logger';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function testSimpleLogin() {
  console.log('🧪 Test de connexion SIMPLE - sans complications\n');
  
  // Vérifier les credentials
  const email = process.env.CHOGAN_REVENDEUR_EMAIL;
  const password = process.env.CHOGAN_REVENDEUR_PASSWORD;
  
  if (!email || !password) {
    console.error('❌ ERREUR: Variables d\'environnement manquantes !');
    console.error('📝 Configure dans ton fichier .env :');
    console.error('   CHOGAN_REVENDEUR_EMAIL=ton-email@revendeur.com');
    console.error('   CHOGAN_REVENDEUR_PASSWORD=ton-mot-de-passe');
    return;
  }
  
  console.log('📧 Email:', email);
  console.log('🔐 Password: Configuré\n');
  
  try {
    const automation = new ChoganPuppeteerSimple();
    
    // Test simple de connexion seulement
    console.log('🔄 Test uniquement de la connexion...');
    
    const testOrder = {
      credentials: { email, password },
      client: {
        prenom: "Test", nom: "User", email: "test@example.com",
        telephone: "0123456789", adresse: "123 rue Test",
        codePostal: "75001", departement: "75",
        ville: "Paris", pays: "France"
      },
      produits: [{ ref: "006", quantite: 1 }]
    };
    
    const result = await automation.processOrder(testOrder);
    
    if (result.success) {
      console.log('\n✅ SUCCÈS ! Connexion simple réussie !');
      console.log('🔗 URL finale:', result.chogan_link);
    } else {
      console.log('\n❌ ÉCHEC de la connexion simple');
      console.log('🔍 Erreur:', result.error);
    }
    
  } catch (error) {
    console.error('\n💥 Erreur de test:', error);
  }
  
  // Afficher les logs
  console.log('\n📋 Logs récents:');
  const logs = choganLogger.getRecentLogs(10);
  logs.forEach(log => {
    console.log(`[${log.level}] ${log.message}`);
  });
}

// Exécuter le test
if (require.main === module) {
  console.log('🎯 === TEST CONNEXION SIMPLE ===\n');
  console.log('⚠️  Le navigateur va s\'ouvrir - tu pourras voir ce qui se passe !\n');
  
  testSimpleLogin()
    .then(() => {
      console.log('\n🏁 Test terminé');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test échoué:', error);
      process.exit(1);
    });
}

export { testSimpleLogin }; 