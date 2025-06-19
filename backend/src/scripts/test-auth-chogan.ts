import { ChoganAutomation, OrderRequest } from '../services/chogan-automation';
import { choganLogger } from '../utils/logger';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function testChoganAuth() {
  console.log('🧪 Test d\'authentification Chogan...\n');
  
  // Vérifier que les credentials sont configurés de manière sécurisée
  const email = process.env.CHOGAN_REVENDEUR_EMAIL;
  const password = process.env.CHOGAN_REVENDEUR_PASSWORD;
  
  // 🔍 DEBUG: Afficher les variables pour vérifier
  console.log('🔍 DEBUG Email chargé:', email);
  console.log('🔍 DEBUG Password défini:', password ? 'OUI' : 'NON');
  
  if (!email || !password) {
    console.error('❌ ERREUR: Variables d\'environnement manquantes !');
    console.error('📝 Assure-toi d\'avoir configuré dans ton fichier .env :');
    console.error('   CHOGAN_REVENDEUR_EMAIL=ton-email@revendeur.com');
    console.error('   CHOGAN_REVENDEUR_PASSWORD=ton-mot-de-passe');
    return;
  }
  
  try {
    // Création d'une commande de test avec tes credentials depuis l'environnement (SÉCURISÉ)
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

    console.log('📧 Tentative de connexion avec:', testOrder.credentials.email);
    
    const automation = new ChoganAutomation();
    const result = await automation.processOrder(testOrder);
    
    if (result.success) {
      console.log('✅ SUCCÈS ! Lien Chogan généré:', result.chogan_link);
    } else {
      console.log('❌ ÉCHEC:', result.error);
      if (result.details) {
        console.log('📝 Détails:', result.details);
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur de test:', error);
  }
  
  // Affichage des logs pour debug
  console.log('\n📋 Logs récents:');
  const logs = choganLogger.getRecentLogs(10);
  logs.forEach(log => {
    console.log(`[${log.timestamp}] ${log.level} - ${log.module}: ${log.message}`);
  });
}

// Exécution du test
if (require.main === module) {
  testChoganAuth().then(() => {
    console.log('\n🏁 Test terminé');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { testChoganAuth }; 