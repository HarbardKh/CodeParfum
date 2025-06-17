import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Définir l'interface pour les données CSV
interface ParfumCSVData {
  'Numero parfum - Pour utilisateur et Database': string;
  'Inspiration (ne pas utiliser publiquement) - Pour Database': string;
  'Genre - Pour utilisateur et Database': string;
  'Famille olfactive - Pour utilisateur et Database': string;
  'Famille principale - Database': string;
  'Famille secondaire - Famille principale - Pour Database': string;
  'Intensité - Pour utilisateur et Database'?: string;
  'IntensitÃ© - Pour utilisateur et Database'?: string; // Support pour l'encodage problématique
  'Occasion - Pour utilisateur et Database': string;
  'Note de tete - Pour utilisateur et Database': string;
  'Note de coeur - Pour utilisateur et Database': string;
  'Note de fond - Pour utilisateur et Database': string;
  'Description 1  - Pour utilisateur et Database': string;
  'A propos de ce parfum  - Pour utilisateur et Database': string;
  'Conseil & Expertise - Pour utilisateur et Database': string;
  'Référence 70ml'?: string;
  'RÃ©fÃ©rence 70ml'?: string; // Support pour l'encodage problématique
  'Prix 70ml': string;
  'Code 30ml': string;
  'Prix 30ml': string;
  'Code 15ml': string;
  'Prix 15ml': string;
  'Code 5x15ml': string;
  'Prix 5x15ml': string;
  [key: string]: string | undefined;
}

// Interface pour les variantes de parfum
interface Variante {
  volume: string;
  prix: number;
  ref: string;
}

// Interface pour les parfums
interface Parfum {
  numeroParf: string;
  inspiration: string;
  genre: string;
  formatParDefaut: string; // Format affiché par défaut
  familleOlfactive?: ObjectId | null;
  famillePrincipale: string;
  familleSecondaire: string;
  intensite: string;
  occasion: string;
  noteTete: string;
  noteCoeur: string;
  noteFond: string;
  description1: string;
  description: any; // Format richText pour PayloadCMS
  aPropos: string;
  ConseilExpertise: string;
  prix: number;
  slug: string;
  variantes: Variante[];
  createdAt: Date;
  updatedAt: Date;
}

// Fonction pour normaliser les références (assurer 3 chiffres avec zéros en tête)
function normalizeRef(ref: string): string {
  // Pour les références numériques (par exemple "1" => "001")
  if (/^\d+$/.test(ref)) {
    return ref.padStart(3, '0');
  }
  return ref;
}

// Fonction pour lire et parser le fichier CSV
function parseCSV(filePath: string): ParfumCSVData[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ',',
  });
  return records as ParfumCSVData[];
}

// Fonction pour obtenir la valeur correcte avec gestion des problèmes d'encodage
function getValueWithEncodingFallback(parfumCSV: ParfumCSVData, normalKey: string, encodedKey: string): string {
  return (parfumCSV[normalKey] !== undefined ? parfumCSV[normalKey] : parfumCSV[encodedKey]) || '';
}

// Transformation du genre en valeur pour le modèle
function transformGenre(genre: string): string {
  if (genre.toLowerCase().includes('femme')) return 'F';
  if (genre.toLowerCase().includes('homme')) return 'H';
  return 'U'; // Unisexe par défaut
}

// Fonction pour créer un slug à partir d'un texte
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Enlever les accents
    .replace(/[^\w\s-]/g, '')         // Enlever les caractères spéciaux
    .replace(/\s+/g, '-')             // Remplacer les espaces par des tirets
    .replace(/--+/g, '-')             // Éviter les tirets doubles
    .trim();                          // Enlever les espaces au début et à la fin
}

// Fonction principale d'importation
async function resetAndImportFromCSV() {
  // URL de connexion MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payload-template-blank';
  
  let client;
  
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connexion à MongoDB établie');
    
    // Accès à la base de données et aux collections
    const db = client.db();
    const parfumsCollection = db.collection('parfums');
    const famillesCollection = db.collection('familles-olfactives');
    
    // Récupérer les familles olfactives pour les correspondances
    console.log('🔄 Récupération des familles olfactives...');
    const famillesOlfactives = await famillesCollection.find({}).toArray();
    console.log(`📊 ${famillesOlfactives.length} familles olfactives trouvées`);
    
    // Fonction pour trouver l'ID de la famille olfactive
    async function findFamilleOlfactiveId(nomFamille: string): Promise<ObjectId | null> {
      // Recherche exacte
      const exactMatch = famillesOlfactives.find(f => f.nom === nomFamille);
      if (exactMatch) return exactMatch._id;
      
      // Recherche partielle
      const partialMatch = famillesOlfactives.find(f => 
        nomFamille.includes(f.nom) || f.nom.includes(nomFamille)
      );
      if (partialMatch) return partialMatch._id;
      
      console.log(`⚠️ Famille olfactive non trouvée: ${nomFamille}`);
      return null;
    }

    // Supprimer tous les parfums existants
    console.log('🔄 Suppression de tous les parfums existants...');
    const deleteResult = await parfumsCollection.deleteMany({});
    console.log(`🗑️ ${deleteResult.deletedCount} parfums supprimés`);

    // Lire le CSV
    console.log('🔄 Lecture du fichier CSV...');
    const csvPath = path.resolve(__dirname, '../../../../Dossier perso - assist/Fiche produits tout contenant tout prix.csv');
    const parfumsData = parseCSV(csvPath);
    console.log(`📊 Fichier CSV lu avec succès: ${parfumsData.length} parfums trouvés`);

    // Statistiques pour le suivi
    let insertedCount = 0;
    let errorCount = 0;
    const insertionErrors: string[] = [];

    // Préparer tous les parfums pour insertion
    const parfumsToInsert: Parfum[] = [];

    for (const parfumCSV of parfumsData) {
      try {
        // Récupérer le numéro de parfum et le normaliser
        const numeroParf = parfumCSV['Numero parfum - Pour utilisateur et Database'].replace('Numéro ', '');
        
        // Récupérer l'ID de la famille olfactive
        const familleOlfactiveId = await findFamilleOlfactiveId(parfumCSV['Famille olfactive - Pour utilisateur et Database']);

        // Créer le tableau de variantes
        const variantes: Variante[] = [];
        
        // Récupérer les informations des variantes
        // Variante 70ml
        const prix70ml = parseFloat(parfumCSV['Prix 70ml'] || '0');
        const ref70ml = normalizeRef(numeroParf);
        if (prix70ml > 0) {
          variantes.push({
            volume: '70ml',
            prix: prix70ml,
            ref: ref70ml,
          });
        }
        
        // Variante 30ml
        const code30ml = parfumCSV['Code 30ml'];
        const prix30ml = parseFloat(parfumCSV['Prix 30ml'] || '0');
        if (code30ml && prix30ml > 0) {
          variantes.push({
            volume: '30ml',
            prix: prix30ml,
            ref: code30ml,
          });
        }
        
        // Variante 15ml
        const code15ml = parfumCSV['Code 15ml'];
        const prix15ml = parseFloat(parfumCSV['Prix 15ml'] || '0');
        if (code15ml && prix15ml > 0) {
          variantes.push({
            volume: '15ml',
            prix: prix15ml,
            ref: code15ml, // T-code pour les recharges
          });
        }
        
        // Variante 5x15ml
        const code5x15ml = parfumCSV['Code 5x15ml'];
        const prix5x15ml = parseFloat(parfumCSV['Prix 5x15ml'] || '0');
        if (code5x15ml && prix5x15ml > 0) {
          variantes.push({
            volume: '5x15ml',
            prix: prix5x15ml,
            ref: code5x15ml, // Pack promo
          });
        }

        // Déterminer le format par défaut (70ml si disponible, sinon le premier format disponible)
        let formatParDefaut = '70ml';
        if (!variantes.some(v => v.volume === '70ml') && variantes.length > 0) {
          formatParDefaut = variantes[0].volume;
        }

        // Récupérer l'intensité en tenant compte des problèmes d'encodage
        const intensite = getValueWithEncodingFallback(parfumCSV, 'Intensité - Pour utilisateur et Database', 'IntensitÃ© - Pour utilisateur et Database');
        
        // Nom humanisé du parfum
        const parfumName = `Parfum ${numeroParf} - ${parfumCSV['Inspiration (ne pas utiliser publiquement) - Pour Database']}`;
        
        // Créer une description richText à partir du texte de description1
        const description1 = parfumCSV['Description 1  - Pour utilisateur et Database'];
        const descriptionRichText = [{
          children: [{ text: description1 }]
        }];
        
        // Construire le nouvel objet de données
        const newParfum: Parfum = {
          numeroParf,
          inspiration: parfumCSV['Inspiration (ne pas utiliser publiquement) - Pour Database'],
          genre: transformGenre(parfumCSV['Genre - Pour utilisateur et Database']),
          formatParDefaut,
          familleOlfactive: familleOlfactiveId,
          famillePrincipale: parfumCSV['Famille principale - Database'],
          familleSecondaire: parfumCSV['Famille secondaire - Famille principale - Pour Database'],
          intensite: intensite,
          occasion: parfumCSV['Occasion - Pour utilisateur et Database'],
          noteTete: parfumCSV['Note de tete - Pour utilisateur et Database'],
          noteCoeur: parfumCSV['Note de coeur - Pour utilisateur et Database'],
          noteFond: parfumCSV['Note de fond - Pour utilisateur et Database'],
          description1: description1,
          description: descriptionRichText,
          aPropos: parfumCSV['A propos de ce parfum  - Pour utilisateur et Database'] || '',
          ConseilExpertise: parfumCSV['Conseil & Expertise - Pour utilisateur et Database'] || '',
          prix: variantes.length > 0 ? variantes[0].prix : prix70ml, // Prix par défaut: celui de la variante 70ml
          slug: `parfum-${numeroParf}`,
          variantes,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        parfumsToInsert.push(newParfum);
        console.log(`✅ Parfum ${numeroParf} préparé avec ${variantes.length} variantes`);
      } catch (error) {
        console.error(`❌ Erreur lors de la préparation du parfum ${parfumCSV['Numero parfum - Pour utilisateur et Database']}:`, error);
        insertionErrors.push(parfumCSV['Numero parfum - Pour utilisateur et Database']);
        errorCount++;
      }
    }

    // Insérer tous les parfums
    if (parfumsToInsert.length > 0) {
      console.log(`🔄 Insertion de ${parfumsToInsert.length} parfums...`);
      const insertResult = await parfumsCollection.insertMany(parfumsToInsert);
      insertedCount = insertResult.insertedCount;
      console.log(`✅ ${insertedCount} parfums insérés avec succès`);
    }

    // Afficher le résumé
    console.log('\n=== RÉSUMÉ FINAL ===');
    console.log(`Total des parfums dans le CSV: ${parfumsData.length}`);
    console.log(`Parfums insérés: ${insertedCount}`);
    console.log(`Erreurs rencontrées: ${errorCount}`);

    if (insertionErrors.length > 0) {
      console.log('\nListe des parfums avec erreurs:');
      insertionErrors.forEach(ref => console.log(`- ${ref}`));
    }

    // Résumé des variantes
    let parfumsAvecVariantes = 0;
    let parfumsSansVariantes = 0;
    let totalVariantes = 0;
    
    for (const parfum of parfumsToInsert) {
      if (parfum.variantes && parfum.variantes.length > 0) {
        parfumsAvecVariantes++;
        totalVariantes += parfum.variantes.length;
      } else {
        parfumsSansVariantes++;
      }
    }
    
    console.log('\n=== RÉSUMÉ DES VARIANTES ===');
    console.log(`Parfums avec variantes: ${parfumsAvecVariantes}`);
    console.log(`Parfums sans variantes: ${parfumsSansVariantes}`);
    console.log(`Nombre total de variantes: ${totalVariantes}`);
    console.log(`Moyenne de variantes par parfum: ${(totalVariantes / parfumsAvecVariantes).toFixed(2)}`);

    console.log('\n✅ Réinitialisation et importation terminées');
  } catch (error) {
    console.error('❌ Erreur critique lors de l\'importation:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Connexion MongoDB fermée');
    }
  }
}

// Exécuter la fonction principale
resetAndImportFromCSV().catch(console.error); 