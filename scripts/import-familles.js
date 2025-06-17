/**
 * Script pour importer les familles olfactives dans MongoDB
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelier-olfactif';
const COLLECTION_NAME = 'familles-olfactives';

// Liste des familles olfactives
const famillesOlfactives = [
  {
    nom: 'Ambré',
    description: 'Les parfums ambrés se caractérisent par leur chaleur enveloppante. Ils évoquent l\'orient avec leurs notes douces, poudrées et vanillées.',
    slug: 'ambre',
    image_url: '/images/familles/ambre.jpg'
  },
  {
    nom: 'Boisé',
    description: 'Les parfums boisés se distinguent par leurs notes chaudes et sèches, évoquant des bois précieux comme le cèdre, le santal ou le vétiver.',
    slug: 'boise',
    image_url: '/images/familles/boise.jpg'
  },
  {
    nom: 'Floral',
    description: 'La famille florale est la plus vaste. Ces parfums reproduisent le parfum des fleurs, comme la rose, le jasmin ou le muguet.',
    slug: 'floral',
    image_url: '/images/familles/floral.jpg'
  },
  {
    nom: 'Fruité',
    description: 'Les parfums fruités rappellent la fraîcheur et la douceur des fruits comme la pêche, la pomme ou les baies rouges.',
    slug: 'fruite',
    image_url: '/images/familles/fruite.jpg'
  },
  {
    nom: 'Épicé',
    description: 'Les parfums épicés contiennent des notes de poivre, cannelle, muscade ou clou de girofle, apportant chaleur et caractère.',
    slug: 'epice',
    image_url: '/images/familles/epice.jpg'
  },
  {
    nom: 'Hespéridé',
    description: 'Les hespéridés tirent leur nom des fruits du même nom (citron, orange, pamplemousse). Ils sont frais et toniques.',
    slug: 'hesperide',
    image_url: '/images/familles/hesperide.jpg'
  },
  {
    nom: 'Cuir',
    description: 'Les parfums cuirés évoquent l\'odeur distinctive du cuir tanné, avec des notes parfois fumées ou animales.',
    slug: 'cuir',
    image_url: '/images/familles/cuir.jpg'
  },
  {
    nom: 'Oriental',
    description: 'Les parfums orientaux sont riches et opulents, mélangeant épices, bois précieux et notes vanillées.',
    slug: 'oriental',
    image_url: '/images/familles/oriental.jpg'
  },
  {
    nom: 'Fougère',
    description: 'La famille fougère combine des notes de lavande, mousse de chêne et coumarine pour un effet frais et herbacé.',
    slug: 'fougere',
    image_url: '/images/familles/fougere.jpg'
  },
  {
    nom: 'Aromatique',
    description: 'Les parfums aromatiques mettent en avant des herbes comme la sauge, le romarin ou le thym.',
    slug: 'aromatique',
    image_url: '/images/familles/aromatique.jpg'
  },
  {
    nom: 'Gourmand',
    description: 'Les parfums gourmands évoquent des notes sucrées, chocolatées ou vanillées, comme des pâtisseries et des desserts.',
    slug: 'gourmand',
    image_url: '/images/familles/gourmand.jpg'
  },
  {
    nom: 'Aquatique',
    description: 'Les parfums aquatiques rappellent la fraîcheur de l\'océan, avec des notes marines et iodées.',
    slug: 'aquatique',
    image_url: '/images/familles/aquatique.jpg'
  }
];

async function importFamilles() {
  let client;
  
  try {
    console.log('Démarrage de l\'importation des familles olfactives...');
    
    // Connexion à MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connexion à MongoDB établie avec succès');
    
    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);
    
    // Vérifier si des familles existent déjà
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} familles olfactives déjà présentes dans la base de données.`);
      console.log('Suppression des familles existantes...');
      await collection.deleteMany({});
      console.log('Familles existantes supprimées avec succès');
    }
    
    // Importer les nouvelles familles
    const result = await collection.insertMany(famillesOlfactives);
    console.log(`✅ ${result.insertedCount} familles olfactives importées avec succès!`);
    
  } catch (error) {
    console.error('Erreur lors de l\'importation des familles olfactives:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Fermeture de la connexion MongoDB');
    }
  }
}

// Exécuter la fonction d'importation
importFamilles().then(() => {
  console.log('Script terminé');
  process.exit(0);
}).catch(error => {
  console.error('Erreur:', error);
  process.exit(1);
});
