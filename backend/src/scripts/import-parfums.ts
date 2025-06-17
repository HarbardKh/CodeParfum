import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import payload from 'payload';

// Chargement des variables d'environnement
dotenv.config();

// Chemin vers le fichier CSV
const CSV_PATH = path.resolve(__dirname, '../../../../Dossier perso - assist/Feuille Parfum 90 premiers produits enrichie - Feuille Parfum 90 premiers produits enrichie (1).csv');

// Chemin alternatif au cas où
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

// Fonction principale d'importation
const importParfums = async (): Promise<void> => {
  try {
    console.log('Démarrage de l\'importation des parfums...');
    console.log(`Utilisation du fichier CSV: ${CSV_PATH}`);
    
    // Initialisation de PayloadCMS (utilise les variables d'env du fichier .env)
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'default-secret-for-development',
      local: true, // Mode local pour les scripts
    });

    console.log('PayloadCMS initialisé avec succès');

    // Vérification si le fichier existe et lecture
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
      console.error(`Aucun fichier CSV trouvé aux emplacements:
- ${CSV_PATH}
- ${ALT_CSV_PATH}`);
      process.exit(1);
    }
    
    // Parsing du CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    }) as ParfumCSV[];

    console.log(`Nombre de parfums trouvés dans le CSV: ${records.length}`);

    // Récupérer ou créer les familles olfactives
    const famillesMap = new Map<string, string>();
    
    for (const record of records) {
      const familleNom = record['Famille olfactive - Pour utilisateur et Database'];
      
      if (familleNom && !famillesMap.has(familleNom)) {
        // Vérifier si la famille existe déjà
        const existingFamilles = await payload.find({
          collection: 'familles-olfactives',
          where: {
            nom: {
              equals: familleNom,
            },
          },
        });

        if (existingFamilles.docs.length > 0) {
          famillesMap.set(familleNom, String(existingFamilles.docs[0].id));
        } else {
          // Créer une nouvelle famille olfactive
          const newFamille = await payload.create({
            collection: 'familles-olfactives',
            data: {
              nom: familleNom,
              description: [{ type: 'p', children: [{ text: `Famille olfactive ${familleNom}` }] }] as { [k: string]: unknown }[],
              notesTypiques: record['Note de tete - Pour utilisateur et Database'] || '',
              pourQui: 'Pour tous ceux qui apprécient les parfums ' + familleNom.toLowerCase(),
              quandPorter: record['Occasion - Pour utilisateur et Database'] || 'Toutes occasions',
              imagePlaceholder: determinePlaceholder(familleNom.toLowerCase()) as 'florale' | 'boisee' | 'orientale' | 'fruitee' | 'aromatique' | 'hesperidee' | 'chypree' | 'fougere',
              // Propriétés obligatoires manquantes
              evocation: `Cette famille olfactive ${familleNom.toLowerCase()} évoque des sensations uniques.`,
              motParfumeur: `La famille ${familleNom.toLowerCase()} est caractérisée par ses notes distinctives.`,
              genre: 'mixte', // Par défaut
              saison: 'toutes', // Par défaut
              intensite: 'moderee', // Par défaut
              slug: createSlug(familleNom),
            },
          });

          famillesMap.set(familleNom, String(newFamille.id));
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
      const existingParfums = await payload.find({
        collection: 'parfums',
        where: {
          reference: {
            equals: numero,
          },
        },
      });

      if (existingParfums.docs.length > 0) {
        console.log(`Parfum ${numero} - ${nom} existe déjà, ignoré.`);
        skippedCount++;
        continue;
      }

      // Vérifier si la famille olfactive existe, sinon en créer une par défaut
      const familleOlfactiveNom = record['Famille olfactive - Pour utilisateur et Database'];
      let familleOlfactiveId = famillesMap.get(familleOlfactiveNom);
      
      if (!familleOlfactiveId) {
        console.warn(`L'ID de la famille olfactive "${familleOlfactiveNom}" n'a pas été trouvé. Création d'une famille par défaut.`);
        
        // Créer une famille olfactive par défaut
        try {
          const defaultFamille = await payload.create({
            collection: 'familles-olfactives',
            data: {
              nom: familleOlfactiveNom || 'Autre',
              description: [{ type: 'p', children: [{ text: `Famille olfactive: ${familleOlfactiveNom || 'Autre'}` }] }],
              notesTypiques: '',
              pourQui: '',
              quandPorter: '',
              evocation: '',
              motParfumeur: '',
              genre: 'mixte', // Par défaut
              saison: 'toutes', // Par défaut
              intensite: 'moderee', // Par défaut
              slug: createSlug(familleOlfactiveNom || 'autre'),
            },
          });
          
          familleOlfactiveId = String(defaultFamille.id);
          famillesMap.set(familleOlfactiveNom, familleOlfactiveId);
          console.log(`Famille olfactive par défaut créée: ${familleOlfactiveNom}`);
        } catch (err) {
          console.error(`Impossible de créer une famille olfactive par défaut:`, err);
          // Si on ne peut pas créer de famille, on saute ce parfum
          console.log(`Parfum ${numero} ignoré car pas de famille olfactive valide.`);
          skippedCount++;
          continue;
        }
      }

      // Préparation des données pour insertion
      const parfumData = {
        numeroParf: numero, // Utiliser numeroParf au lieu de reference
        inspiration: record['Inspiration (ne pas utiliser publiquement) - Pour Database'] || '', // Utiliser inspiration au lieu de nom
        genre: convertGenre(record['Genre - Pour utilisateur et Database']),
        formatParDefaut: (record['Contenance - Pour utilisateur et Database'] as '70ml' | '30ml' | '15ml' | '5x15ml') || '70ml', // Champ requis
        familleOlfactive: familleOlfactiveId, // Maintenant on est sûr que ce n'est pas undefined
        famillePrincipale: record['Famille principale - Database'] || '', // Champ requis
        familleSecondaire: record['Famille secondaire - Famille principale - Pour Database'] || '', // Champ requis
        intensite: (record['Intensité - Pour utilisateur et Database'] === 'Forte' || 
                  record['Intensité - Pour utilisateur et Database'] === 'Moyenne' || 
                  record['Intensité - Pour utilisateur et Database'] === 'Légère') ? 
                  record['Intensité - Pour utilisateur et Database'] as 'Légère' | 'Moyenne' | 'Forte' : 'Moyenne',
        occasion: record['Occasion - Pour utilisateur et Database'] || undefined, // Optionnel
        noteTete: record['Note de tete - Pour utilisateur et Database'] || undefined, // Optionnel, format simple
        noteCoeur: record['Note de coeur - Pour utilisateur et Database'] || undefined, // Optionnel, format simple
        noteFond: record['Note de fond - Pour utilisateur et Database'] || undefined, // Optionnel, format simple
        description1: record['Description 1  - Pour utilisateur et Database'] || '', // Champ string requis
        description: (record['Description 1  - Pour utilisateur et Database'] && record['Description 1  - Pour utilisateur et Database'].trim() !== '') ? 
                   [{ type: 'p', children: [{ text: record['Description 1  - Pour utilisateur et Database'].trim() }] }] as { [k: string]: unknown }[] : 
                   [] as { [k: string]: unknown }[], // Format richText requis avec typage explicite
        aPropos: record['A propos de ce parfum  - Pour utilisateur et Database'] || undefined, // Optionnel
        ConseilExpertise: record['Conseil & Expertise - Pour utilisateur et Database'] || undefined, // Optionnel, attention à la casse
        prix: Math.floor(Math.random() * 30) + 30, // Prix par défaut
        variantes: [ // Au moins une variante est nécessaire
          {
            volume: (record['Contenance - Pour utilisateur et Database'] as '70ml' | '30ml' | '15ml' | '5x15ml') || '70ml',
            prix: Math.floor(Math.random() * 30) + 30,
            ref: `${numero}-${(record['Contenance - Pour utilisateur et Database'] as string || '70ml').replace('ml','')}`
          }
        ],
        slug: createSlug(record['Inspiration (ne pas utiliser publiquement) - Pour Database'] || numero), // Slug basé sur l'inspiration
      };

      // Insertion du parfum dans PayloadCMS
      await payload.create({
        collection: 'parfums',
        data: parfumData,
      });

      console.log(`Parfum ${numero} - ${nom} importé avec succès.`);
      importedCount++;
    }

    console.log(`Importation terminée. ${importedCount} parfums importés, ${skippedCount} parfums ignorés (déjà existants).`);
  } catch (error) {
    console.error('Erreur lors de l\'importation des parfums:', error);
  } finally {
    // Déconnexion propre
    process.exit(0);
  }
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

// Exécution de la fonction d'importation
importParfums();
