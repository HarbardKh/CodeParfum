require('dotenv').config();

console.log('🔍 Vérification .env :');
console.log('Email configuré:', process.env.CHOGAN_REVENDEUR_EMAIL ? '✅ OUI' : '❌ NON');
console.log('Password configuré:', process.env.CHOGAN_REVENDEUR_PASSWORD ? '✅ OUI' : '❌ NON');
console.log('PAYLOAD_SECRET configuré:', process.env.PAYLOAD_SECRET ? '✅ OUI' : '❌ NON');

if (process.env.CHOGAN_REVENDEUR_EMAIL && process.env.CHOGAN_REVENDEUR_PASSWORD) {
  console.log('🎯 Configuration OK - Prêt pour les tests !');
} else {
  console.log('⚠️ Il manque des variables dans le fichier .env');
} 