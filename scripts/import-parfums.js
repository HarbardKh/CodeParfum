/**
 * Script d'importation des parfums à partir du fichier CSV
 * Utilise l'API PayloadCMS pour créer les documents dans la collection
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const axios = require('axios');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const CSV_FILE_PATH = path.resolve(__dirname, '../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
const COLLECTION_SLUG = 'parfums';

// Fonction pour créer un slug valide
function createSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '')         // Enlever les tirets au début et à la fin
    .replace(/-{2,}/g, '-');         // Remplacer les multiples tirets par un seul
}

// Fonction pour déterminer la popularité (pour le tri)
function getRandomPopularity() {
  return Math.floor(Math.random() * 100);
}

// Fonction pour déterminer si en promotion
function getRandomPromotion() {
  return Math.random() > 0.8; // 20% des parfums en promotion
}

// Fonction pour générer un stock aléatoire
function getRandomStock() {
  return Math.floor(Math.random() * 50) + 5; // Entre 5 et 55 unités
}

async function importParfums() {
  try {
    console.log('Démarrage de l\'importation des parfums...');
    console.log(`Lecture du fichier: ${CSV_FILE_PATH}`);
    
    // Vérifier que l'API PayloadCMS est accessible
    try {
      await axios.get(`${PAYLOAD_API_URL}/api/status`);
      console.log(`✅ PayloadCMS API est accessible à ${PAYLOAD_API_URL}`);
    } catch (error) {
      console.warn(`⚠️ Impossible de se connecter à l'API PayloadCMS: ${error.message}`);
      console.warn('Vérifiez que le serveur PayloadCMS est bien démarré et que l\'URL est correcte.');
      console.warn(`URL actuelle: ${PAYLOAD_API_URL}`);
      console.warn('Tentative de continuer malgré tout...');
    }
    
    // Lire le fichier CSV
    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    
    // Parser le CSV en objets
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });
    
    console.log(`CSV parsé avec succès: ${records.length} parfums trouvés`);
    
    // Préparer les données pour PayloadCMS
    const parfums = records.map((record, index) => {
      // Créer un nom propre pour le parfum (sans les caractères spéciaux)
      const nomPropre = record['Inspiration (ne pas utiliser publiquement) - Pour Database'].trim();
      
      // Générer un slug unique
      const slugBase = createSlug(nomPropre);
      const slug = slugBase;
      
      return {
        reference: record['Numero parfum - Pour utilisateur et Database'].trim(),
        nom: nomPropre,
        description: record['Description 1  - Pour utilisateur et Database'].trim(),
        genre: record['Genre - Pour utilisateur et Database'].trim(),
        prix: 35.90,
        volume: record['Contenance - Pour utilisateur et Database'].trim(),
        intensite: record['Intensité - Pour utilisateur et Database'].trim(),
        occasion: record['Occasion - Pour utilisateur et Database'].trim(),
        
        // Valeurs pour filtrage et catégorisation
        famille_principale: record['Famille principale - Database'].trim(),
        famille_secondaire: record['Famille secondaire - Famille principale - Pour Database'].trim(),
        
        // Notes olfactives
        note_tete: record['Note de tete - Pour utilisateur et Database'].trim(),
        note_coeur: record['Note de coeur - Pour utilisateur et Database'].trim(),
        note_fond: record['Note de fond - Pour utilisateur et Database'].trim(),
        
        // Contenus marketing
        a_propos: record['A propos de ce parfum  - Pour utilisateur et Database'].trim(),
        conseil: record['Conseil & Expertise - Pour utilisateur et Database'].trim(),
        
        // Fonctionnalités e-commerce
        popularite: getRandomPopularity(),
        stock: getRandomStock(),
        en_promotion: getRandomPromotion(),
        
        // Champ SEO et URL
        slug: slug,
        
        // Status de publication (pour PayloadCMS)
        status: 'published',
      };
    });
    
    // Option pour réinitialiser la collection
    let resetCollection = true;
    
    if (resetCollection) {
      try {
        console.log('Tentative de suppression des parfums existants...');
        // Méthode 1: Suppression complète (peut ne pas fonctionner selon la config de l'API)
        try {
          await axios.delete(`${PAYLOAD_API_URL}/api/parfums?limit=1000`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          console.log('✅ Parfums existants supprimés avec succès via API directe');
        } catch (error) {
          console.warn('Échec de la suppression par API directe, tentative de suppression individuelle...');
          
          // Méthode 2: Récupérer tous les parfums puis les supprimer un par un
          try {
            const response = await axios.get(`${PAYLOAD_API_URL}/api/parfums?limit=1000`);
            const existingParfums = response.data.docs || [];
            
            if (existingParfums.length > 0) {
              console.log(`Suppression individuelle de ${existingParfums.length} parfums...`);
              
              for (const parfum of existingParfums) {
                try {
                  await axios.delete(`${PAYLOAD_API_URL}/api/parfums/${parfum.id}`);
                  process.stdout.write(`Suppression en cours: ${existingParfums.indexOf(parfum) + 1}/${existingParfums.length}\r`);
                } catch (deleteError) {
                  console.warn(`Échec de la suppression du parfum ${parfum.id}: ${deleteError.message}`);
                }
              }
              console.log('\n✅ Suppression individuelle terminée');
            } else {
              console.log('Aucun parfum existant à supprimer');
            }
          } catch (listError) {
            console.warn(`Échec de la récupération des parfums existants: ${listError.message}`);
          }
        }
      } catch (error) {
        console.warn('⚠️ Erreur lors de la suppression des parfums existants:', error.message);
        console.warn('Continuation de l\'importation...');
      }
    }
    
    // Importer chaque parfum dans PayloadCMS
    console.log('Importation des parfums dans PayloadCMS...');
    let successCount = 0;
    let errorCount = 0;
    let retryCount = 0;
    const maxRetries = 3;
    const failedParfums = [];
    
    for (const parfum of parfums) {
      let success = false;
      let attempts = 0;
      
      while (!success && attempts < maxRetries) {
        attempts++;
        try {
          // Ajout d'un délai pour éviter de surcharger l'API
          if (attempts > 1) {
            await new Promise(resolve => setTimeout(resolve, 500 * attempts)); // Délai progressif
            retryCount++;
          }
          
          // Créer le parfum via l'API
          await axios.post(`${PAYLOAD_API_URL}/api/parfums`, parfum, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          success = true;
          successCount++;
          process.stdout.write(`Importation en cours: ${successCount}/${parfums.length} (Tentatives: ${retryCount})\r`);
        } catch (error) {
          if (attempts === maxRetries) {
            errorCount++;
            failedParfums.push({
              reference: parfum.reference,
              nom: parfum.nom,
              error: error.response?.data?.errors || error.message
            });
            console.error(`\n❌ Échec après ${attempts} tentatives pour le parfum ${parfum.reference} - ${parfum.nom}`);
          }
        }
      }
    }
    
    console.log('\n');
    console.log('=== RÉSUMÉ DE L\'IMPORTATION ===');
    console.log(`Total des parfums: ${parfums.length}`);
    console.log(`Parfums importés avec succès: ${successCount}`);
    console.log(`Parfums en échec: ${errorCount}`);
    console.log(`Nombre total de tentatives: ${successCount + retryCount}`);
    
    if (errorCount > 0) {
      console.log('\n=== DÉTAILS DES ÉCHECS ===');
      failedParfums.forEach((p, i) => {
        console.log(`${i+1}. ${p.reference} - ${p.nom}`);
        console.log(`   Erreur: ${JSON.stringify(p.error)}`);
      });
    }
    
    if (successCount === parfums.length) {
      console.log('\n✅ IMPORTATION RÉUSSIE!');
    } else {
      console.log('\n⚠️ IMPORTATION TERMINÉE AVEC DES ERREURS.');
      console.log(`   Taux de succès: ${((successCount / parfums.length) * 100).toFixed(2)}%`);
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR FATALE LORS DE L\'IMPORTATION:');
    console.error(error);
    process.exit(1);
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
