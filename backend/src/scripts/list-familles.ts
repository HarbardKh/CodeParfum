import payload from 'payload';
import { config as dotenv } from 'dotenv';
import path from 'path';
import { FamillesOlfactive } from '../payload-types';
import express from 'express';

dotenv({ path: path.resolve(__dirname, '../../.env') });

const app = express();

const listFamilles = async (): Promise<void> => {
  console.log('--- Début du script listFamilles ---');
  /*
  // NOTE: Ce script est temporairement désactivé pour ne pas bloquer le build.
  // La configuration de payload.init semble obsolète.
  try {
    // Initialiser Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'super-secret-dev-key',
      mongoURI: process.env.MONGODB_URI,
      express: app,
    });

    console.log('Récupération des familles olfactives...');

    const familles: FamillesOlfactive[] = await payload.find({
      collection: 'familles-olfactives',
      limit: 200,
    });

    console.log(`\n--- ${familles.length} Familles Olfactives trouvées ---`);
    familles.forEach((famille, index) => {
      console.log(`${index + 1}. ${famille.nom} (ID: ${famille.id})`);
    });
    console.log('-------------------------------------\n');

  } catch (error) {
    console.error('Erreur lors de la récupération des familles olfactives:', error);
  }
  */
  console.log('--- Fin du script listFamilles (actuellement désactivé) ---');
  process.exit(0);
};

listFamilles(); 