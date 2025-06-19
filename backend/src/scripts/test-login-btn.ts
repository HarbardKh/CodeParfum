import { ChoganAutomation } from '../services/chogan-automation';
import { choganLogger, LogLevel } from '../utils/logger';

/**
 * Script de test pour la méthode de connexion améliorée
 * Teste spécifiquement la gestion du bouton btn_login JavaScript
 */
async function testLoginButton() {
  const automation = new ChoganAutomation();
  
  console.log('\n🔧 TEST DE CONNEXION - BOUTON JAVASCRIPT');
  console.log('==========================================\n');
  
  // Credentials de test (à remplacer par de vrais identifiants)
  const testCredentials = {
    email: process.env.CHOGAN_TEST_EMAIL || 'test@example.com',
    password: process.env.CHOGAN_TEST_PASSWORD || 'testpassword'
  };
  
  try {
    console.log(`📧 Test avec l'email: ${testCredentials.email}`);
    console.log('🔄 Tentative de connexion...\n');
    
    // Test uniquement de la méthode de connexion
    await (automation as any).loginToRevendeurAccount(testCredentials);
    
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('✅ Le bouton de connexion a été traité correctement');
    
    // Affichage des logs de connexion
    console.log('\n📊 LOGS DE CONNEXION:');
    const loginLogs = choganLogger.getLogsByModule('CHOGAN_LOGIN', 20);
    const httpLogs = choganLogger.getLogsByModule('CHOGAN_HTTP', 20);
    const allLogs = [...loginLogs, ...httpLogs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    allLogs.forEach(log => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      console.log(`[${timestamp}] ${log.level} - ${log.message}`);
      if (log.data) {
        console.log(`    Détails:`, log.data);
      }
    });
    
  } catch (error) {
    console.error('❌ ERREUR DE CONNEXION:');
    console.error(error instanceof Error ? error.message : error);
    
    // Affichage des logs d'erreur
    console.log('\n📊 LOGS D\'ERREUR:');
    const errorLogs = choganLogger.getLogsByLevel(LogLevel.ERROR, 10);
    const warnLogs = choganLogger.getLogsByLevel(LogLevel.WARN, 10);
    const allErrorLogs = [...errorLogs, ...warnLogs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    allErrorLogs.forEach(log => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      console.log(`[${timestamp}] ${log.level} - ${log.message}`);
      if (log.error) {
        console.log(`    Erreur:`, log.error);
      }
    });
  }
  
  console.log('\n🔍 ANALYSE DES TENTATIVES:');
  console.log('1. Tentative via action du formulaire');
  console.log('2. Tentative via AJAX (/ajax/login)');
  console.log('3. Tentative via endpoint alternatif (/auth/login)');
  console.log('\n💡 CONSEIL: Vérifiez les logs pour voir quelle méthode a fonctionné');
}

// Configuration pour test avec variables d'environnement
if (require.main === module) {
  console.log('📝 VARIABLES D\'ENVIRONNEMENT REQUISES:');
  console.log('  CHOGAN_TEST_EMAIL=your-email@example.com');
  console.log('  CHOGAN_TEST_PASSWORD=your-password');
  console.log('\n⚠️  ATTENTION: Utilisez des credentials de test uniquement!\n');
  
  testLoginButton()
    .then(() => {
      console.log('\n✅ Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test échoué:', error);
      process.exit(1);
    });
}

export { testLoginButton }; 