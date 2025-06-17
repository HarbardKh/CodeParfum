import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Définir les interfaces
interface Variante {
  volume: string;
  prix: number;
  ref: string;
}

interface Parfum {
  _id: any;
  numeroParf: string;
  inspiration: string;
  genre: string;
  formatParDefaut: string;
  contenance: string;
  prix: number;
  description1?: string;
  description?: any; // RichText
  variantes?: Variante[];
  [key: string]: any;
}

// Fonction principale
async function verifyImport() {
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
    
    // Récupérer tous les parfums
    console.log('🔄 Récupération des parfums...');
    const parfumsCollection = db.collection('parfums');
    const parfums = await parfumsCollection.find({}).toArray() as Parfum[];
    console.log(`📊 Nombre total de parfums: ${parfums.length}`);
    
    // Compteurs pour les statistiques
    let parfumsAvecVariantes = 0;
    let parfumsSansVariantes = 0;
    let totalVariantes = 0;
    let parfumsAvecDescription = 0;
    let parfumsAvecFormat = 0;
    
    // Formats par défaut
    const formatsParDefaut: { [key: string]: number } = {
      '70ml': 0,
      '30ml': 0,
      '15ml': 0,
      '5x15ml': 0
    };
    
    // Exemples de parfums
    console.log('\n=== EXEMPLES DE PARFUMS ===');
    for (let i = 0; i < Math.min(5, parfums.length); i++) {
      const parfum = parfums[i];
      console.log(`\nParfum #${i + 1}: ${parfum.numeroParf} - ${parfum.inspiration}`);
      console.log(`Genre: ${parfum.genre}`);
      console.log(`Format par défaut: ${parfum.formatParDefaut || 'Non spécifié'}`);
      console.log(`Prix de base: ${parfum.prix}€`);
      
      if (parfum.description) {
        console.log('Description: Présente');
      } else {
        console.log('Description: Non définie');
      }
      
      if (parfum.variantes && parfum.variantes.length > 0) {
        console.log('Variantes:');
        parfum.variantes.forEach((v: Variante) => {
          console.log(`  - ${v.volume}: ${v.prix}€ (Réf: ${v.ref})`);
        });
      } else {
        console.log('Variantes: Aucune');
      }
    }
    
    // Analyser tous les parfums
    for (const parfum of parfums) {
      // Vérifier les variantes
      if (parfum.variantes && parfum.variantes.length > 0) {
        parfumsAvecVariantes++;
        totalVariantes += parfum.variantes.length;
      } else {
        parfumsSansVariantes++;
      }
      
      // Vérifier la description
      if (parfum.description) {
        parfumsAvecDescription++;
      }
      
      // Vérifier le format par défaut
      if (parfum.formatParDefaut) {
        parfumsAvecFormat++;
        if (formatsParDefaut[parfum.formatParDefaut] !== undefined) {
          formatsParDefaut[parfum.formatParDefaut]++;
        }
      }
    }
    
    // Afficher les statistiques
    console.log('\n=== STATISTIQUES ===');
    console.log(`Nombre total de parfums: ${parfums.length}`);
    console.log(`Parfums avec variantes: ${parfumsAvecVariantes} (${((parfumsAvecVariantes / parfums.length) * 100).toFixed(2)}%)`);
    console.log(`Parfums sans variantes: ${parfumsSansVariantes} (${((parfumsSansVariantes / parfums.length) * 100).toFixed(2)}%)`);
    console.log(`Nombre total de variantes: ${totalVariantes}`);
    console.log(`Moyenne de variantes par parfum: ${(totalVariantes / parfumsAvecVariantes).toFixed(2)}`);
    
    console.log(`\nParfums avec description richText: ${parfumsAvecDescription} (${((parfumsAvecDescription / parfums.length) * 100).toFixed(2)}%)`);
    console.log(`Parfums avec format par défaut défini: ${parfumsAvecFormat} (${((parfumsAvecFormat / parfums.length) * 100).toFixed(2)}%)`);
    
    console.log('\nDistribution des formats par défaut:');
    for (const format in formatsParDefaut) {
      const count = formatsParDefaut[format];
      console.log(`  - ${format}: ${count} (${((count / parfumsAvecFormat) * 100).toFixed(2)}%)`);
    }
    
    console.log('\n✅ Vérification terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Connexion MongoDB fermée');
    }
  }
}

// Exécuter la fonction principale
verifyImport().catch(console.error); 