import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Interface pour les variantes de parfum
interface Variante {
  volume: string;
  prix: number;
  ref: string;
}

// Interface pour les parfums
interface Parfum {
  _id: ObjectId;
  numeroParf: string;
  variantes?: Variante[];
  formatParDefaut?: string;
  contenance?: string;
  prix: number;
  [key: string]: any;
}

// Fonction pour normaliser la référence
function normalizeRef(ref: string): string {
  // Supprimer tout préfixe potentiel
  const numericPart = ref.replace(/[^0-9]/g, '');
  // Ajouter des zéros en tête pour avoir 3 chiffres
  return numericPart.padStart(3, '0');
}

// Fonction pour parser le CSV
function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Fonction principale
async function updateParfumsVariantes(): Promise<void> {
  // URL de connexion MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payload-template-blank';
  
  let client;
  
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connexion à MongoDB établie');
    
    // Accès à la base de données
    const db = client.db();
    
    // Collection des parfums
    const parfumsCollection = db.collection('parfums');
    
    // Lire le fichier CSV contenant les variations
    console.log('🔄 Lecture du fichier CSV avec les variantes...');
    const csvPath = path.resolve(__dirname, '../../../../Dossier perso - assist/Fiche produits tout contenant tout prix.csv');
    const variantesData = await parseCSV(csvPath);
    console.log(`📊 Fichier CSV lu avec succès: ${variantesData.length} entrées trouvées`);
    
    // Récupérer tous les parfums existants
    console.log('🔄 Récupération des parfums depuis la base de données...');
    const parfums = await parfumsCollection.find({}).toArray() as Parfum[];
    console.log(`📊 Nombre total de parfums dans la base de données: ${parfums.length}`);
    
    // Compteurs pour les statistiques
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    const notFoundRefs: string[] = [];
    const updatedRefs: string[] = [];
    const issuesRefs: string[] = [];
    
    // Pour chaque entrée dans le CSV
    for (const varianteCSV of variantesData) {
      try {
        // Récupérer le numéro de parfum et le normaliser
        const numeroParf = varianteCSV['Numero parfum - Pour utilisateur et Database'].replace('Numéro ', '');
        const numeroParfNormalized = normalizeRef(numeroParf);
        
        // Chercher le parfum correspondant dans la base de données
        const parfum = parfums.find(p => normalizeRef(p.numeroParf) === numeroParfNormalized);
        
        if (!parfum) {
          console.log(`❗ Parfum ${numeroParf} non trouvé dans la base de données`);
          notFoundCount++;
          notFoundRefs.push(numeroParf);
          continue;
        }
        
        // Créer le tableau de variantes
        const variantes: Variante[] = [];
        
        // Récupérer les informations des variantes
        // Variante 70ml
        const prix70ml = parseFloat(varianteCSV['Prix 70ml'] || '0');
        const ref70ml = normalizeRef(numeroParf);
        if (prix70ml > 0) {
          variantes.push({
            volume: '70ml',
            prix: prix70ml,
            ref: ref70ml,
          });
        }
        
        // Variante 30ml
        const code30ml = varianteCSV['Code 30ml'];
        const prix30ml = parseFloat(varianteCSV['Prix 30ml'] || '0');
        if (code30ml && prix30ml > 0) {
          variantes.push({
            volume: '30ml',
            prix: prix30ml,
            ref: code30ml,
          });
        }
        
        // Variante 15ml
        const code15ml = varianteCSV['Code 15ml'];
        const prix15ml = parseFloat(varianteCSV['Prix 15ml'] || '0');
        if (code15ml && prix15ml > 0) {
          variantes.push({
            volume: '15ml',
            prix: prix15ml,
            ref: code15ml, // T-code pour les recharges
          });
        }
        
        // Variante 5x15ml
        const code5x15ml = varianteCSV['Code 5x15ml'];
        const prix5x15ml = parseFloat(varianteCSV['Prix 5x15ml'] || '0');
        if (code5x15ml && prix5x15ml > 0) {
          variantes.push({
            volume: '5x15ml',
            prix: prix5x15ml,
            ref: code5x15ml, // Pack promo
          });
        }
        
        // Vérifier qu'on a au moins une variante
        if (variantes.length === 0) {
          console.log(`⚠️ Aucune variante trouvée pour le parfum ${numeroParf}`);
          skippedCount++;
          issuesRefs.push(numeroParf);
          continue;
        }
        
        // Déterminer le format par défaut (70ml si disponible, sinon le premier format disponible)
        let formatParDefaut = '70ml';
        if (!variantes.some(v => v.volume === '70ml') && variantes.length > 0) {
          formatParDefaut = variantes[0].volume;
        }
        
        // Mettre à jour le parfum
        const result = await parfumsCollection.updateOne(
          { _id: parfum._id },
          { 
            $set: { 
              variantes: variantes,
              formatParDefaut: formatParDefaut,
              // Mettre à jour le prix principal avec le prix de la variante par défaut
              prix: variantes.find(v => v.volume === formatParDefaut)?.prix || parfum.prix
            } 
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Parfum ${numeroParf} mis à jour avec ${variantes.length} variantes`);
          updatedCount++;
          updatedRefs.push(numeroParf);
        } else {
          console.log(`⚠️ Parfum ${numeroParf} non modifié (aucun changement nécessaire)`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour du parfum ${varianteCSV['Numero parfum - Pour utilisateur et Database']}:`, error);
        issuesRefs.push(varianteCSV['Numero parfum - Pour utilisateur et Database']);
      }
    }
    
    // Afficher le résumé
    console.log('\n=== RÉSUMÉ DES MISES À JOUR ===');
    console.log(`Total des entrées dans le CSV: ${variantesData.length}`);
    console.log(`Parfums mis à jour: ${updatedCount}`);
    console.log(`Parfums ignorés (aucun changement): ${skippedCount}`);
    console.log(`Parfums non trouvés: ${notFoundCount}`);
    
    if (notFoundRefs.length > 0) {
      console.log('\nParfums non trouvés dans la base de données:');
      notFoundRefs.forEach(ref => console.log(`- ${ref}`));
    }
    
    if (issuesRefs.length > 0) {
      console.log('\nParfums avec des problèmes lors de la mise à jour:');
      issuesRefs.forEach(ref => console.log(`- ${ref}`));
    }
    
    // Vérifier les mises à jour
    console.log('\n🔄 Vérification des mises à jour...');
    
    // Récupérer les parfums mis à jour
    const updatedParfums = await parfumsCollection.find({ 
      numeroParf: { $in: updatedRefs }
    }).toArray() as Parfum[];
    
    let parfumsAvecVariantes = 0;
    let totalVariantes = 0;
    
    // Vérifier les parfums mis à jour
    for (const parfum of updatedParfums) {
      if (parfum.variantes && parfum.variantes.length > 0) {
        parfumsAvecVariantes++;
        totalVariantes += parfum.variantes.length;
        
        console.log(`\nParfum: ${parfum.numeroParf}`);
        console.log(`Format par défaut: ${parfum.formatParDefaut}`);
        console.log(`Prix principal: ${parfum.prix}€`);
        console.log('Variantes:');
        parfum.variantes.forEach(v => {
          console.log(`  - ${v.volume}: ${v.prix}€ (Réf: ${v.ref})`);
        });
      }
    }
    
    console.log('\n=== RÉSUMÉ DE VÉRIFICATION ===');
    console.log(`Parfums avec variantes: ${parfumsAvecVariantes}/${updatedRefs.length}`);
    console.log(`Nombre total de variantes: ${totalVariantes}`);
    console.log(`Moyenne de variantes par parfum: ${(totalVariantes / parfumsAvecVariantes).toFixed(2)}`);
    
    console.log('\n✅ Mise à jour terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Connexion MongoDB fermée');
    }
  }
}

// Exécuter la fonction principale
updateParfumsVariantes().catch(console.error); 