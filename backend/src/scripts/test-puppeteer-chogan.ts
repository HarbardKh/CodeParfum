import { ChoganPuppeteerAutomation, OrderRequest } from '../services/chogan-puppeteer';
import { choganLogger } from '../utils/logger';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function testPuppeteerChogan() {
  console.log('🚀 Test d\'automatisation Chogan avec Puppeteer...\n');
  
  // Vérifier que les credentials sont configurés
  const email = process.env.CHOGAN_REVENDEUR_EMAIL;
  const password = process.env.CHOGAN_REVENDEUR_PASSWORD;
  
  if (!email || !password) {
    console.error('❌ ERREUR: Variables d\'environnement manquantes !');
    console.error('📝 Assure-toi d\'avoir configuré dans ton fichier .env :');
    console.error('   CHOGAN_REVENDEUR_EMAIL=ton-email@revendeur.com');
    console.error('   CHOGAN_REVENDEUR_PASSWORD=ton-mot-de-passe');
    return;
  }
  
  console.log('🔍 Test avec Puppeteer (navigateur réel)');
  console.log('📧 Email configuré:', email);
  console.log('🔐 Password configuré: OUI\n');
  
  try {
    // Créer une commande de test
    const testOrder: OrderRequest = {
      credentials: {
        email: email,
        password: password
      },
      client: {
        prenom: "Jean",
        nom: "Dupont", 
        email: "client.test@example.com",
        telephone: "0123456789",
        adresse: "123 rue de la Paix",
        codePostal: "75001",
        departement: "75",
        ville: "Paris",
        pays: "France"
      },
      produits: [
        { ref: "006", quantite: 1 }
      ]
    };

    console.log('🎯 Début de l\'automatisation Puppeteer...');
    console.log('⚠️  Un navigateur Chrome va s\'ouvrir - c\'est normal !');
    console.log('📱 Tu pourras voir le processus en temps réel\n');
    
    const automation = new ChoganPuppeteerAutomation();
    const result = await automation.processOrder(testOrder);
    
    if (result.success) {
      console.log('✅ SUCCÈS ! Automatisation Puppeteer réussie !');
      console.log('🔗 Lien Chogan généré:', result.chogan_link);
      
      if (result.screenshots && result.screenshots.length > 0) {
        console.log('📸 Captures d\'écran générées:');
        result.screenshots.forEach(screenshot => {
          console.log(`   - ${screenshot}`);
        });
      }
    } else {
      console.log('❌ ÉCHEC de l\'automatisation Puppeteer');
      console.log('🔍 Erreur:', result.error);
      
      if (result.details) {
        console.log('📝 Détails:', result.details);
      }
      
      if (result.screenshots && result.screenshots.length > 0) {
        console.log('📸 Captures d\'écran d\'erreur:');
        result.screenshots.forEach(screenshot => {
          console.log(`   - ${screenshot}`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur de test Puppeteer:', error);
  }
  
  // Affichage des logs pour debug
  console.log('\n📋 Logs récents:');
  const logs = choganLogger.getRecentLogs(15);
  logs.forEach(log => {
    console.log(`[${log.timestamp}] ${log.level} - ${log.module}: ${log.message}`);
  });
}

// Test de connexion simple d'abord
async function testSimpleConnection() {
  console.log('🔧 Test de connexion simple...');
  
  try {
    const automation = new ChoganPuppeteerAutomation();
    const isConnected = await automation.testConnection();
    
    if (isConnected) {
      console.log('✅ Connexion Puppeteer réussie !');
      console.log('🎯 Prêt pour l\'automatisation complète\n');
      return true;
    } else {
      console.log('❌ Connexion Puppeteer échouée');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error);
    return false;
  }
}

// Exécution des tests
if (require.main === module) {
  console.log('🧪 === TEST AUTOMATISATION CHOGAN PUPPETEER ===\n');
  
  testSimpleConnection().then(connectionOk => {
    if (connectionOk) {
      return testPuppeteerChogan();
    } else {
      console.log('⚠️ Test de connexion échoué, arrêt des tests');
    }
  }).then(() => {
    console.log('\n🏁 Tests terminés');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { testPuppeteerChogan }; 