/**
 * Script de test pour l'automatisation Chogan Smart Order
 * Usage: npm run test:chogan
 */

import { ChoganAutomation, OrderRequest } from '../services/chogan-automation';
import { choganLogger } from '../utils/logger';

async function testChoganAutomation() {
  console.log('🧪 Test de l\'automatisation Chogan Smart Order');
  console.log('='.repeat(50));
  
  // Données de test
  const testOrder: OrderRequest = {
    credentials: {
      email: process.env.CHOGAN_REVENDEUR_EMAIL || "test@example.com",
      password: process.env.CHOGAN_REVENDEUR_PASSWORD || "password"
    },
    client: {
      prenom: "Jean",
      nom: "Dupont",
      email: "jean.dupont@example.com",
      telephone: "0612345678",
      adresse: "123 rue de la Paix",
      codePostal: "75001",
      departement: "75",
      ville: "Paris",
      pays: "France"
    },
    produits: [
      { ref: "CHOGAN001", quantite: 1 },
      { ref: "CHOGAN002", quantite: 2 }
    ]
  };

  console.log('📋 Données de test:', JSON.stringify(testOrder, null, 2));
  console.log('');

  try {
    // Test de connectivité d'abord
    console.log('🔗 Test de connectivité...');
    const automation = new ChoganAutomation();
    const isConnected = await automation.testConnection();
    
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à Chogan');
      return;
    }
    
    console.log('✅ Connectivité OK');
    console.log('');

    // Test du processus complet
    console.log('🚀 Lancement du test d\'automatisation...');
    const result = await automation.processOrder(testOrder);
    
    console.log('');
    console.log('📊 Résultat du test:');
    console.log('='.repeat(30));
    
    if (result.success) {
      console.log('✅ Test réussi !');
      console.log('🔗 Lien Chogan:', result.chogan_link);
    } else {
      console.log('❌ Test échoué');
      console.log('💥 Erreur:', result.error);
      if (result.details) {
        console.log('🔍 Détails:', result.details);
      }
    }

  } catch (error) {
    console.error('💥 Erreur critique lors du test:', error);
  }

  // Afficher les logs récents
  console.log('');
  console.log('📜 Logs récents:');
  console.log('='.repeat(20));
  const recentLogs = choganLogger.getRecentLogs(10);
  recentLogs.forEach(log => {
    console.log(`[${log.timestamp}] [${log.level}] [${log.module}] ${log.message}`);
    if (log.data) console.log('   Data:', log.data);
    if (log.error) console.log('   Error:', log.error);
  });

  // Statistiques
  console.log('');
  console.log('📈 Statistiques des logs:');
  console.log('='.repeat(25));
  const stats = choganLogger.getStats();
  console.log('Total:', stats.total);
  console.log('Erreurs:', stats.ERROR);
  console.log('Avertissements:', stats.WARN);
  console.log('Infos:', stats.INFO);
  console.log('Debug:', stats.DEBUG);
}

// Test de l'endpoint de santé
async function testHealthEndpoint() {
  console.log('');
  console.log('🏥 Test de l\'endpoint de santé...');
  
  try {
    const automation = new ChoganAutomation();
    const isHealthy = await automation.testConnection();
    
    console.log('Statut santé Chogan:', isHealthy ? '✅ OK' : '❌ KO');
    
  } catch (error) {
    console.error('❌ Erreur health check:', error);
  }
}

// Fonction principale
async function main() {
  console.log('🎯 Test complet du système d\'automatisation Chogan');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');

  await testHealthEndpoint();
  await testChoganAutomation();
  
  console.log('');
  console.log('🏁 Test terminé');
}

// Exécution si appelé directement
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { testChoganAutomation, testHealthEndpoint }; 