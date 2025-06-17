import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Chargement des variables d'environnement
dotenv.config();

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || '';

// Chemin vers le fichier CSV
const CSV_PATH = path.resolve(__dirname, '../../../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');
const ALT_CSV_PATH = path.resolve(__dirname, '../../../../Dossier perso - assist/Last Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie2 (1).csv');

// Fonction pour créer un slug à partir du nom
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Fonction principale d'importation
async function importParfumsMinimal(): Promise<void> {
  try {
    console.log('Démarrage de l\'importation minimale des parfums...');
    
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB avec succès');
    
    // Vérification et lecture du fichier CSV
    let fileContent: string;
    let usedPath: string;
    
    if (fs.existsSync(CSV_PATH)) {
      console.log(`Utilisation du fichier: ${CSV_PATH}`);
      fileContent = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });
      usedPath = CSV_PATH;
    } else if (fs.existsSync(ALT_CSV_PATH)) {
      console.log(`Fichier principal non trouvé, utilisation du fichier alternatif: ${ALT_CSV_PATH}`);
      fileContent = fs.readFileSync(ALT_CSV_PATH, { encoding: 'utf-8' });
      usedPath = ALT_CSV_PATH;
    } else {
      console.error(`Aucun fichier CSV trouvé aux emplacements:\n- ${CSV_PATH}\n- ${ALT_CSV_PATH}`);
      process.exit(1);
      return;
    }
    
    // Parsing du CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    console.log(`Nombre de parfums trouvés dans le CSV: ${records.length}`);

    const db = mongoose.connection.db;
    
    // Créer des familles olfactives uniques
    const famillesSet = new Set<string>();
    records.forEach((record: any) => {
      const famille = record['Famille olfactive - Pour utilisateur et Database'];
      if (famille) {
        famillesSet.add(famille);
      }
    });
    
    const famillesArray = Array.from(famillesSet);
    console.log(`Nombre de familles olfactives uniques: ${famillesArray.length}`);
    
    // Insérer les familles olfactives
    const famillesCollection = db.collection('familles-olfactives');
    
    // Créer un index sur le nom de la famille pour éviter les doublons
    await famillesCollection.createIndex({ nom: 1 }, { unique: true });
    
    const famillesMap = new Map<string, mongoose.Types.ObjectId>();
    
    for (const famille of famillesArray) {
      try {
        // Vérifier si la famille existe déjà
        const existingFamille = await famillesCollection.findOne({ nom: famille });
        
        if (existingFamille) {
          famillesMap.set(famille, existingFamille._id);
          console.log(`Famille existante: ${famille}`);
        } else {
          // Créer une nouvelle famille
          const result = await famillesCollection.insertOne({
            nom: famille,
            description: `Famille olfactive ${famille}`,
            slug: createSlug(famille),
            evocation: `Les parfums ${famille.toLowerCase()} évoquent une sensation unique et raffinée.`,
            motParfumeur: `Un accord harmonieux de notes sélectionnées avec soin.`,
            imagePlaceholder: 'florale',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          famillesMap.set(famille, result.insertedId);
          console.log(`Famille créée: ${famille}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la création de la famille ${famille}:`, error);
      }
    }
    
    // Insérer les parfums
    const parfumsCollection = db.collection('parfums');
    
    // Créer un index sur la référence pour éviter les doublons
    await parfumsCollection.createIndex({ reference: 1 }, { unique: true });
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const record of records) {
      try {
        const reference = record['Numero parfum - Pour utilisateur et Database'];
        const nom = record['Inspiration (ne pas utiliser publiquement) - Pour Database'].trim();
        const famille = record['Famille olfactive - Pour utilisateur et Database'];
        
        // Vérifier si le parfum existe déjà
        const existingParfum = await parfumsCollection.findOne({ reference });
        
        if (existingParfum) {
          console.log(`Parfum ${reference} - ${nom} existe déjà, ignoré.`);
          skippedCount++;
          continue;
        }
        
        let genre = 'U';
        const genreRaw = record['Genre - Pour utilisateur et Database'];
        if (genreRaw.startsWith('F')) genre = 'F';
        else if (genreRaw.startsWith('H')) genre = 'H';
        
        const imagePlaceholder = genre === 'F' ? 'feminin' : (genre === 'H' ? 'masculin' : 'unisexe');
        const familleId = famillesMap.get(famille);
        
        if (!familleId) {
          console.error(`Famille ${famille} non trouvée pour parfum ${reference}!`);
          continue;
        }
        
        // Créer le parfum avec les champs minimaux nécessaires
        const parfumData = {
          reference,
          nom,
          slug: `${createSlug(nom)}-${reference}`,
          description: record['Description 1  - Pour utilisateur et Database'] || `Parfum ${nom}`,
          genre,
          prix: Math.floor(Math.random() * 30) + 30,
          volume: record['Contenance - Pour utilisateur et Database'] || '100ml',
          intensite: record['Intensité - Pour utilisateur et Database'] || 'Moyenne',
          occasion: record['Occasion - Pour utilisateur et Database'] || 'Toutes occasions',
          imagePlaceholder,
          familleOlfactive: familleId,
          evocation: record['Description 1  - Pour utilisateur et Database'] || `Une fragrance subtile et élégante qui évoque des sensations uniques.`,
          motParfumeur: `Une création qui allie avec harmonie des notes soigneusement sélectionnées pour une signature olfactive distinctive.`,
          stock: Math.floor(Math.random() * 100) + 10,
          popularite: Math.floor(Math.random() * 5) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await parfumsCollection.insertOne(parfumData);
        console.log(`Parfum importé: ${reference} - ${nom}`);
        importedCount++;
      } catch (error) {
        console.error(`Erreur lors de l'importation du parfum:`, error);
      }
    }
    
    console.log(`\nImportation terminée!`);
    console.log(`- Parfums importés: ${importedCount}`);
    console.log(`- Parfums ignorés: ${skippedCount}`);
    console.log(`- Familles olfactives: ${famillesMap.size}`);
    
  } catch (error) {
    console.error('Erreur globale:', error);
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.disconnect();
    console.log('\nDéconnecté de MongoDB');
    process.exit(0);
  }
}

// Exécuter la fonction d'importation
importParfumsMinimal();
