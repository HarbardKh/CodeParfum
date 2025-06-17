import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Fonction principale
async function examineSchema() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI || '');
    console.log('Connecté à MongoDB avec succès');

    // Obtenir la liste des collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections disponibles:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Examiner le schéma de la collection 'parfums'
    if (collections.some(c => c.name === 'parfums')) {
      console.log('\nExamen du premier document dans la collection parfums:');
      const parfumsCollection = mongoose.connection.db.collection('parfums');
      const sampleDoc = await parfumsCollection.findOne({});
      
      if (sampleDoc) {
        console.log('Structure du document:');
        console.log(JSON.stringify(sampleDoc, null, 2));
        
        // Vérifier si les champs problématiques existent et sont requis
        console.log('\nChamps spécifiques:');
        console.log(`evocation: ${sampleDoc.evocation ? 'présent' : 'absent'}`);
        console.log(`motParfumeur: ${sampleDoc.motParfumeur ? 'présent' : 'absent'}`);
      } else {
        console.log('Aucun document trouvé dans la collection parfums');
      }
    }

    console.log('\nExamen terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'examen du schéma:', error);
  } finally {
    // Fermer la connexion à MongoDB
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

// Exécuter la fonction principale
examineSchema();
