/**
 * Script d'importation des parfums directement dans MongoDB
 * Ne dépend pas de PayloadCMS pour fonctionner
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const CSV_FILE_PATH = path.resolve(__dirname, '../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chogan';
const DB_NAME = 'chogan';
const COLLECTION_NAME = 'parfums';

async function importParfums() {
  let client;
  
  try {
    console.log('Démarrage de l\'importation des parfums...');
    console.log(`Lecture du fichier: ${CSV_FILE_PATH}`);
    
    // Lire le fichier CSV
    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    
    // Parser le CSV en objets
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });
    
    console.log(`CSV parsé avec succès: ${records.length} parfums trouvés`);
    
    // Préparer les données pour MongoDB
    const parfums = records.map((record, index) => ({
      reference: record['Numero parfum - Pour utilisateur et Database'],
      nom: record['Inspiration (ne pas utiliser publiquement) - Pour Database'],
      slug: record['Inspiration (ne pas utiliser publiquement) - Pour Database']
        .toLowerCase()
        .replace(/\\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      prix: 35.90,
      genre: record['Genre - Pour utilisateur et Database'],
      volume: record['Contenance - Pour utilisateur et Database'],
      famille_principale: record['Famille principale - Database'],
      famille_secondaire: record['Famille secondaire - Famille principale - Pour Database'],
      intensite: record['Intensité - Pour utilisateur et Database'],
      occasion: record['Occasion - Pour utilisateur et Database'],
      description: record['Description 1  - Pour utilisateur et Database'],
      note_tete: record['Note de tete - Pour utilisateur et Database'],
      note_coeur: record['Note de coeur - Pour utilisateur et Database'],
      note_fond: record['Note de fond - Pour utilisateur et Database'],
      a_propos: record['A propos de ce parfum  - Pour utilisateur et Database'],
      conseil: record['Conseil & Expertise - Pour utilisateur et Database'],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Connexion à MongoDB
    console.log(`Connexion à MongoDB: ${MONGODB_URI}`);
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connexion à MongoDB établie avec succès');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Supprimer d'abord tous les parfums existants pour éviter les doublons
    console.log('Suppression des parfums existants...');
    await collection.deleteMany({});
    console.log('Parfums existants supprimés avec succès');
    
    // Importer les parfums dans MongoDB
    console.log('Importation des parfums dans MongoDB...');
    const result = await collection.insertMany(parfums);
    
    console.log('\n');
    console.log('=== RÉSUMÉ DE L\'IMPORTATION ===');
    console.log(`Total des parfums: ${parfums.length}`);
    console.log(`Parfums importés avec succès: ${result.insertedCount}`);
    
    if (result.insertedCount === parfums.length) {
      console.log('✅ Importation réussie!');
    } else {
      console.log('⚠️ Importation terminée avec des erreurs.');
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  } finally {
    if (client) {
      console.log('Fermeture de la connexion MongoDB');
      await client.close();
    }
  }
}

// Exécuter la fonction d'importation
importParfums().then(() => {
  console.log('Script terminé');
  process.exit(0);
}).catch(err => {
  console.error('Erreur non gérée:', err);
  process.exit(1);
});
