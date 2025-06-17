const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// URL de l'API
const API_URL = 'http://localhost:3002/api';
const CSV_PATH = path.resolve(__dirname, '../../..',
  'Dossier perso - assist', 
  'Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv'
);

// Fonction pour normaliser un nom pour créer un slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Fonction pour se connecter à l'API
async function login() {
  try {
    console.log('Tentative de connexion à l\'API avec l\'utilisateur par défaut...');
    
    // Utiliser les identifiants par défaut de PayloadCMS
    const res = await axios.post(`${API_URL}/users/login`, {
      email: 'dev@payloadcms.com',
      password: 'test',
    });
    
    console.log('Connexion réussie!');
    // Renvoyer le token pour l'utiliser dans les requêtes suivantes
    return res.data.user.token;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    
    if (error.response) {
      console.error('Détails de l\'erreur:', error.response.data);
    }
    
    throw error;
  }
}

// Fonction pour lire le CSV et importer les données
async function importParfums(token) {
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`CSV lu avec succès! ${results.length} parfums à importer.`);
        
        try {
          // Pour chaque ligne du CSV
          for (const row of results) {
            try {
              // Préparer les données pour l'API
              const parfumData = {
                numeroParf: row['Numero parfum - Pour utilisateur et Database'] || '',
                inspiration: row['Inspiration (ne pas utiliser publiquement) - Pour Database'] || '',
                genre: row['Genre - Pour utilisateur et Database'] || 'F',
                contenance: row['Contenance - Pour utilisateur et Database'] || '',
                // Relation à trouver ou créer
                // familleOlfactive: sera ajouté plus tard après création/recherche
                famillePrincipale: row['Famille principale - Database'] || '',
                familleSecondaire: row['Famille secondaire - Famille principale - Pour Database'] || '',
                intensite: row['Intensité - Pour utilisateur et Database'] || 'Moyenne',
                occasion: row['Occasion - Pour utilisateur et Database'] || '',
                noteTete: row['Note de tete - Pour utilisateur et Database'] || '',
                noteCoeur: row['Note de coeur - Pour utilisateur et Database'] || '',
                noteFond: row['Note de fond - Pour utilisateur et Database'] || '',
                description1: row['Description 1  - Pour utilisateur et Database'] || '',
                aPropos: row['A propos de ce parfum  - Pour utilisateur et Database'] || '',
                ConseilExpertise: row['Conseil & Expertise - Pour utilisateur et Database'] || '',
                // Autres champs nécessaires
                prix: 25, // Prix par défaut
                stock: 10, // Stock par défaut
                slug: slugify(row['Numero parfum - Pour utilisateur et Database'] || 'parfum')
              };

              // Rechercher ou créer la famille olfactive
              const familleName = row['Famille olfactive - Pour utilisateur et Database'] || 'Autre';
              let familleId;
              
              try {
                // Vérifier si la famille existe déjà
                const familleRes = await axios.get(`${API_URL}/familles-olfactives?where[nom][equals]=${encodeURIComponent(familleName)}`, {
                  headers: { Authorization: `JWT ${token}` }
                });
                
                if (familleRes.data.docs && familleRes.data.docs.length > 0) {
                  familleId = familleRes.data.docs[0].id;
                } else {
                  // Créer la famille si elle n'existe pas
                  const newFamille = await axios.post(`${API_URL}/familles-olfactives`, {
                    nom: familleName,
                    description: `<p>Famille olfactive: ${familleName}</p>`,
                    notesTypiques: row['Note de tete - Pour utilisateur et Database'] || '',
                    slug: slugify(familleName)
                  }, {
                    headers: { Authorization: `JWT ${token}` }
                  });
                  
                  familleId = newFamille.data.id;
                }
              } catch (error) {
                console.error(`Erreur lors de la recherche/création de la famille ${familleName}:`, error.message);
                // Continuer même si erreur avec la famille
              }

              // Ajouter l'ID de la famille olfactive au parfum si trouvée
              if (familleId) {
                parfumData.familleOlfactive = familleId;
              }

              // Créer ou mettre à jour le parfum
              try {
                // Vérifier si le parfum existe déjà
                const existingParfum = await axios.get(`${API_URL}/parfums?where[numeroParf][equals]=${encodeURIComponent(parfumData.numeroParf)}`, {
                  headers: { Authorization: `JWT ${token}` }
                });
                
                if (existingParfum.data.docs && existingParfum.data.docs.length > 0) {
                  // Mettre à jour le parfum existant
                  const updateRes = await axios.patch(
                    `${API_URL}/parfums/${existingParfum.data.docs[0].id}`,
                    parfumData,
                    { headers: { Authorization: `JWT ${token}` } }
                  );
                  console.log(`Parfum ${parfumData.numeroParf} mis à jour.`);
                } else {
                  // Créer un nouveau parfum
                  const createRes = await axios.post(
                    `${API_URL}/parfums`,
                    parfumData,
                    { headers: { Authorization: `JWT ${token}` } }
                  );
                  console.log(`Parfum ${parfumData.numeroParf} créé.`);
                }
              } catch (error) {
                console.error(`Erreur lors de la création/mise à jour du parfum ${parfumData.numeroParf}:`, error.message);
              }
            } catch (error) {
              console.error(`Erreur lors du traitement de la ligne:`, error.message);
            }
          }
          
          console.log('Importation terminée!');
          resolve();
        } catch (error) {
          console.error('Erreur lors de l\'importation:', error.message);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Erreur lors de la lecture du CSV:', error.message);
        reject(error);
      });
  });
}

// Fonction principale
async function main() {
  try {
    console.log('Démarrage de l\'importation des parfums...');
    const token = await login();
    console.log('Connexion réussie. Importation des parfums...');
    await importParfums(token);
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error.message);
  }
}

// Exécuter le script
main();
