import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Chargement des variables d'environnement
dotenv.config();

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atelier-olfactif';

// Chemin vers le fichier CSV
const CSV_PATH = path.resolve(__dirname, '../../../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');
const ALT_CSV_PATH = path.resolve(__dirname, '../../../../Dossier perso - assist/Last Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie2 (1).csv');

// Interface pour les données des parfums
interface ParfumCSV {
  'Numero parfum - Pour utilisateur et Database': string;
  'Inspiration (ne pas utiliser publiquement) - Pour Database': string;
  'Genre - Pour utilisateur et Database': string;
  'Contenance - Pour utilisateur et Database': string;
  'Famille olfactive - Pour utilisateur et Database': string;
  'Famille principale - Database': string;
  'Famille secondaire - Famille principale - Pour Database': string;
  'Intensité - Pour utilisateur et Database': string;
  'Occasion - Pour utilisateur et Database': string;
  'Description d\'origine (ne pas utiliser) - Pour moi, base du developpement': string;
  'Note de tete - Pour utilisateur et Database': string;
  'Note de coeur - Pour utilisateur et Database': string;
  'Note de fond - Pour utilisateur et Database': string;
  'Description 1  - Pour utilisateur et Database': string;
  'A propos de ce parfum  - Pour utilisateur et Database': string;
  'Conseil & Expertise - Pour utilisateur et Database': string;
}

// Fonction pour créer un slug à partir du nom
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/--+/g, '-') // Remplace les tirets multiples par un seul
    .trim(); // Supprime les espaces au début et à la fin
};

// Fonction pour extraire le nom à partir de l'inspiration
const extractName = (inspiration: string): string => {
  return inspiration.trim();
};

// Fonction pour convertir le genre en code
const convertGenre = (genre: string): 'F' | 'H' | 'U' => {
  if (genre.startsWith('F')) return 'F';
  if (genre.startsWith('H')) return 'H';
  return 'U';
};

// Fonction pour parser les notes (tête, cœur, fond)
const parseNotes = (notesString: string): Array<{ note: string }> => {
  if (!notesString) return [];
  
  // Divise la chaîne par tirets ou virgules et nettoie chaque note
  const notes = notesString.split(/[–,-]/).map(note => note.trim()).filter(Boolean);
  
  // Convertit en format attendu par PayloadCMS
  return notes.map(note => ({ note }));
};

// Fonction pour déterminer le placeholder en fonction de la famille olfactive
function determinePlaceholder(famille: string): string {
  if (famille.includes('floral')) return 'florale';
  if (famille.includes('bois')) return 'boisee';
  if (famille.includes('orient')) return 'orientale';
  if (famille.includes('fruit')) return 'fruitee';
  if (famille.includes('aroma')) return 'aromatique';
  if (famille.includes('hespérid') || famille.includes('hesperid')) return 'hesperidee';
  if (famille.includes('chypr')) return 'chypree';
  if (famille.includes('foug')) return 'fougere';
  return 'florale'; // Par défaut
}

// Fonction principale d'importation
async function importParfumsDirect(): Promise<void> {
  try {
    console.log('Démarrage de l\'importation directe des parfums dans MongoDB...');
    
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
    }) as ParfumCSV[];

    console.log(`Nombre de parfums trouvés dans le CSV: ${records.length}`);

    // Obtenons les collections directement de MongoDB
    const db = mongoose.connection.db;
    const famillesCollection = db.collection('familles-olfactives');
    const parfumsCollection = db.collection('parfums');

    // Récupérer ou créer les familles olfactives
    const famillesMap = new Map<string, mongoose.Types.ObjectId>();
    
    for (const record of records) {
      const familleNom = record['Famille olfactive - Pour utilisateur et Database'];
      
      if (familleNom && !famillesMap.has(familleNom)) {
        // Vérifier si la famille existe déjà
        const existingFamille = await famillesCollection.findOne({ nom: familleNom });

        if (existingFamille) {
          famillesMap.set(familleNom, existingFamille._id);
          console.log(`Famille olfactive existante trouvée: ${familleNom}`);
        } else {
          // Créer une nouvelle famille olfactive
          const result = await famillesCollection.insertOne({
            nom: familleNom,
            description: `Famille olfactive ${familleNom}`,
            notesTypiques: record['Note de tete - Pour utilisateur et Database'],
            pourQui: 'Pour tous ceux qui apprécient les parfums ' + familleNom.toLowerCase(),
            quandPorter: record['Occasion - Pour utilisateur et Database'] || 'Toutes occasions',
            imagePlaceholder: determinePlaceholder(familleNom.toLowerCase()),
            slug: createSlug(familleNom),
            evocation: `Les parfums ${familleNom.toLowerCase()} évoquent une sensation unique et raffinée.`,
            motParfumeur: `Un accord harmonieux de notes sélectionnées avec soin.`,
            updatedAt: new Date(),
            createdAt: new Date()
          });

          famillesMap.set(familleNom, result.insertedId);
          console.log(`Famille olfactive créée: ${familleNom}`);
        }
      }
    }

    // Traitement de chaque parfum
    let importedCount = 0;
    let skippedCount = 0;

    for (const record of records) {
      const numero = record['Numero parfum - Pour utilisateur et Database'];
      const nom = extractName(record['Inspiration (ne pas utiliser publiquement) - Pour Database']);
      
      // Vérifier si le parfum existe déjà
      const existingParfum = await parfumsCollection.findOne({ reference: numero });

      if (existingParfum) {
        console.log(`Parfum ${numero} - ${nom} existe déjà, ignoré.`);
        skippedCount++;
        continue;
      }

      const familleId = famillesMap.get(record['Famille olfactive - Pour utilisateur et Database']);
      
      if (!familleId) {
        console.log(`Famille olfactive non trouvée pour le parfum ${numero} - ${nom}, ignoré.`);
        skippedCount++;
        continue;
      }

      // Préparation des données pour insertion
      const parfumData = {
        reference: numero,
        nom: nom,
        description: record['Description 1  - Pour utilisateur et Database'] || `Parfum ${nom} de la famille ${record['Famille olfactive - Pour utilisateur et Database']}`,
        genre: convertGenre(record['Genre - Pour utilisateur et Database']),
        prix: Math.floor(Math.random() * 30) + 30, // Prix aléatoire entre 30 et 59 €
        volume: record['Contenance - Pour utilisateur et Database'] || '100ml',
        intensite: record['Intensité - Pour utilisateur et Database'] || 'Moyenne',
        occasion: record['Occasion - Pour utilisateur et Database'] || 'Toutes occasions',
        imagePlaceholder: convertGenre(record['Genre - Pour utilisateur et Database']) === 'F' ? 'feminin' : 
                         convertGenre(record['Genre - Pour utilisateur et Database']) === 'H' ? 'masculin' : 'unisexe',
        familleOlfactive: familleId,
        notesDepart: parseNotes(record['Note de tete - Pour utilisateur et Database']),
        notesCoeur: parseNotes(record['Note de coeur - Pour utilisateur et Database']),
        notesFond: parseNotes(record['Note de fond - Pour utilisateur et Database']),
        aPropos: record['A propos de ce parfum  - Pour utilisateur et Database'] || `Un parfum raffiné aux notes délicates.`,
        conseil: record['Conseil & Expertise - Pour utilisateur et Database'] || `Idéal pour une utilisation quotidienne.`,
        // Champs problématiques avec valeurs par défaut explicites
        evocation: record['Description 1  - Pour utilisateur et Database'] || 
                   `Ce parfum ${convertGenre(record['Genre - Pour utilisateur et Database']) === 'F' ? 'féminin' : 
                   convertGenre(record['Genre - Pour utilisateur et Database']) === 'H' ? 'masculin' : 'unisexe'} 
                   évoque la famille ${record['Famille olfactive - Pour utilisateur et Database'].toLowerCase()}.`,
        motParfumeur: `Ce parfum de la famille ${record['Famille olfactive - Pour utilisateur et Database'].toLowerCase()} 
                      aux notes de ${record['Note de tete - Pour utilisateur et Database'] || 'tête raffinées'}, 
                      ${record['Note de coeur - Pour utilisateur et Database'] || 'cœur élégant'} et 
                      ${record['Note de fond - Pour utilisateur et Database'] || 'fond envoûtant'} est idéal pour 
                      ${record['Occasion - Pour utilisateur et Database'] || 'toutes occasions'}.`,
        popularite: Math.floor(Math.random() * 5) + 1, // Popularité aléatoire entre 1 et 5
        stock: Math.floor(Math.random() * 100) + 5, // Stock aléatoire entre 5 et 104
        nouveaute: Math.random() > 0.8, // 20% de chance d'être une nouveauté
        slug: `${createSlug(nom)}-${numero}`,
        enPromotion: false,
        updatedAt: new Date(),
        createdAt: new Date()
      };

      try {
        // Insertion du parfum directement dans MongoDB
        await parfumsCollection.insertOne(parfumData);

        console.log(`Parfum ${numero} - ${nom} importé avec succès.`);
        importedCount++;
      } catch (error: any) {
        console.error(`Erreur lors de l'importation du parfum ${numero} - ${nom}:`, error.message);
      }
    }

    console.log(`Importation terminée. ${importedCount} parfums importés, ${skippedCount} parfums ignorés (déjà existants).`);
  } catch (error: any) {
    console.error('Erreur lors de l\'importation des parfums:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

// Exécuter la fonction d'importation
importParfumsDirect();
