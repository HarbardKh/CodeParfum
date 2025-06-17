import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

// Charge les variables d'environnement
config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atelier-olfactif';

/**
 * Script pour tester la connexion à MongoDB
 * Exécutez avec: ts-node src/pingMongo.ts
 */
async function testMongoConnection() {
  console.log('Tentative de connexion à MongoDB...');
  console.log(`URI: ${MONGODB_URI.replace(/\/\/(.+?)@/, '//***@')}`); // Masque le nom d'utilisateur et mot de passe

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Vérification des collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections disponibles:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:');
    console.error(error);
    return false;
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('\nConnexion fermée');
  }
}

// Si ce fichier est exécuté directement (pas importé)
if (require.main === module) {
  testMongoConnection()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('Erreur non gérée:', err);
      process.exit(1);
    });
}

export default testMongoConnection;
