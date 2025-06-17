/**
 * Script pour importer les parfums depuis le fichier CSV vers MongoDB
 */

const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelier-olfactif';
const COLLECTION_NAME = 'parfums';
const CSV_PATH = path.resolve(__dirname, '../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');

// Vérifier si le fichier CSV existe
if (!fs.existsSync(CSV_PATH)) {
  console.error(`Erreur: Le fichier CSV n'existe pas à l'emplacement spécifié: ${CSV_PATH}`);
  process.exit(1);
}

// Fonction pour convertir une chaîne en slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/\s+/g, '-')            // Remplacer les espaces par -
    .replace(/[^\w\-]+/g, '')        // Enlever les caractères non-alphanumériques
    .replace(/\-\-+/g, '-')          // Remplacer les multiples - par un seul -
    .replace(/^-+/, '')              // Enlever les - au début
    .replace(/-+$/, '');             // Enlever les - à la fin
}

// Fonction pour traiter et nettoyer les données du CSV
function processParfumData(rawData) {
  // Mappage des colonnes du CSV aux champs de la base de données
  const processedData = {};
  
  // Inspecter toutes les clés disponibles dans le CSV (pour débogage)
  // console.log("Colonnes disponibles:", Object.keys(rawData));
  
  // Champs obligatoires
  processedData.id = rawData["Numero parfum - Pour utilisateur et Database"] || '';
  processedData.nom = `Parfum ${processedData.id}`; // Nom par défaut basé sur l'ID
  processedData.slug = slugify(processedData.nom);
  processedData.prix = 29.90; // Prix standard pour les parfums Chogan
  
  // Inspiration (parfum de luxe équivalent)
  processedData.inspiration = rawData["Inspiration (ne pas utiliser publiquement) - Pour Database"] || '';
  
  // Genre et caractéristiques
  processedData.genre = rawData["Genre - Pour utilisateur et Database"] || '';
  processedData.contenance = rawData["Contenance - Pour utilisateur et Database"] || '';
  
  // Famille olfactive et classifications
  processedData.famille_olfactive = rawData["Famille olfactive - Pour utilisateur et Database"] || 'Non classé';
  processedData.famille_principale = rawData["Famille principale - Database"] || '';
  processedData.famille_secondaire = rawData["Famille secondaire - Famille principale - Pour Database"] || '';
  processedData.famille_olfactive_slug = slugify(processedData.famille_olfactive);
  
  // Attributs d'utilisation
  processedData.intensite = rawData["Intensité - Pour utilisateur et Database"] || '';
  processedData.occasion = rawData["Occasion - Pour utilisateur et Database"] || '';
  processedData.conseil = rawData["Conseil & Expertise - Pour utilisateur et Database"] || '';
  
  // Notes olfactives (si disponibles)
  processedData.notes_de_tete = rawData["Notes de tête - Pour utilisateur et Database"] || '';
  processedData.notes_de_coeur = rawData["Notes de coeur - Pour utilisateur et Database"] || '';
  processedData.notes_de_fond = rawData["Notes de fond - Pour utilisateur et Database"] || '';
  processedData.description = rawData["Description - Pour utilisateur et Database"] || 
    `Parfum ${processedData.id} de Chogan avec des notes de ${processedData.notes_de_tete || 'parfum'}.`;
  
  // Images (utilisation d'un placeholder pour tous les parfums)
  processedData.image_url = `/images/parfums/parfum-${processedData.id}.jpg`;
  processedData.image_alt = `Flacon du parfum ${processedData.nom}`;
  
  // Métadonnées
  processedData.en_stock = true; // Par défaut tous les parfums sont en stock
  processedData.createur = 'Chogan';
  processedData.origine = 'Italie';
  
  // Ajouter une date de création/modification
  processedData.date_creation = new Date();
  processedData.date_modification = new Date();
  
  return processedData;
}

// Fonction principale d'importation
async function importParfumsFromCSV() {
  let client;
  let results = [];
  
  // Lire le CSV et traiter les données
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csvParser())
      .on('data', (data) => results.push(processParfumData(data)))
      .on('end', resolve)
      .on('error', reject);
  });
  
  console.log(`✅ ${results.length} parfums extraits du fichier CSV`);
  
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connexion à MongoDB établie avec succès');
    
    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);
    
    // Vérifier si des parfums existent déjà
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} parfums déjà présents dans la base de données`);
      console.log('Suppression des parfums existants...');
      await collection.deleteMany({});
      console.log('Parfums existants supprimés avec succès');
    }
    
    // Importer les nouveaux parfums
    if (results.length > 0) {
      const importResult = await collection.insertMany(results);
      console.log(`✅ ${importResult.insertedCount} parfums importés avec succès dans MongoDB!`);
    } else {
      console.warn('⚠️ Aucun parfum à importer. Vérifiez le format du fichier CSV.');
    }
    
    // Vérifier l'importation
    const importedCount = await collection.countDocuments();
    console.log(`📊 Total des parfums dans la base de données après importation: ${importedCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation des parfums:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Fermeture de la connexion MongoDB');
    }
  }
}

// Installation de csv-parser si nécessaire
async function ensureDependencies() {
  try {
    require.resolve('csv-parser');
    console.log('✅ Module csv-parser déjà installé.');
    return true;
  } catch (e) {
    console.log('⚠️ Module csv-parser non trouvé. Installation en cours...');
    
    // Installer csv-parser localement et sans le sauvegarder dans package.json pour éviter les conflits
    const { execSync } = require('child_process');
    try {
      execSync('npm install --no-save csv-parser', { stdio: 'inherit' });
      console.log('✅ Module csv-parser installé avec succès.');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'installation de csv-parser:', error.message);
      return false;
    }
  }
}

// Exécuter la fonction d'importation
ensureDependencies().then((success) => {
  if (success) {
    importParfumsFromCSV().then(() => {
      console.log('Script terminé avec succès');
      process.exit(0);
    }).catch(error => {
      console.error('Erreur:', error);
      process.exit(1);
    });
  } else {
    console.error('Impossible de continuer sans les dépendances nécessaires.');
    process.exit(1);
  }
});
