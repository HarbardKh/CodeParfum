import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const COLLECTIONS_TO_RESET = ['parfums', 'familles-olfactives']; // Collections à réinitialiser

// Fonction principale
async function resetCollections() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI || '');
    console.log('Connecté à MongoDB avec succès');

    // Obtenir la liste de toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections disponibles avant réinitialisation:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Réinitialiser uniquement les collections spécifiées
    for (const collectionName of COLLECTIONS_TO_RESET) {
      if (collections.some(c => c.name === collectionName)) {
        console.log(`\nSuppression de la collection: ${collectionName}`);
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`Collection ${collectionName} vidée avec succès`);
      } else {
        console.log(`\nCollection ${collectionName} n'existe pas encore, aucune action nécessaire`);
      }
    }

    console.log('\nRéinitialisation terminée avec succès');
    console.log('Vous pouvez maintenant exécuter votre script d\'importation');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des collections:', error);
  } finally {
    // Fermer la connexion à MongoDB
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

// Demander confirmation avant d'exécuter
console.log('ATTENTION: Cette opération va vider les collections suivantes:');
COLLECTIONS_TO_RESET.forEach(coll => console.log(`- ${coll}`));
console.log('Toutes les données existantes dans ces collections seront perdues.');
console.log('Cette action est recommandée uniquement en phase de développement.');
console.log('\nPour continuer, appuyez sur ENTER. Pour annuler, appuyez sur CTRL+C');

// Lire l'entrée utilisateur
process.stdin.once('data', () => {
  resetCollections();
});
