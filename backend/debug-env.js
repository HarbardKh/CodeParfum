const path = require('path');
const fs = require('fs');

console.log('🔍 DEBUG Fichier .env utilisé :');
console.log('Working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Chemins possibles pour .env
const possiblePaths = [
  './.env',
  '../.env',
  './.env.local',
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '.env')
];

console.log('\n📁 Vérification des chemins possibles :');
possiblePaths.forEach(envPath => {
  const fullPath = path.resolve(envPath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${fullPath}`);
});

// Charger dotenv et voir ce qui est lu
require('dotenv').config();

console.log('\n📧 Variables chargées :');
console.log('CHOGAN_REVENDEUR_EMAIL:', process.env.CHOGAN_REVENDEUR_EMAIL);
console.log('CHOGAN_REVENDEUR_PASSWORD défini:', !!process.env.CHOGAN_REVENDEUR_PASSWORD);

// Lire directement le fichier .env local
const localEnvPath = path.join(process.cwd(), '.env');
if (fs.existsSync(localEnvPath)) {
  console.log('\n📄 Contenu direct du fichier .env local :');
  const content = fs.readFileSync(localEnvPath, 'utf8');
  const choganLines = content.split('\n').filter(line => line.includes('CHOGAN_REVENDEUR'));
  choganLines.forEach(line => console.log('  ', line));
} else {
  console.log('\n❌ Fichier .env local non trouvé !');
} 