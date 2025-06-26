import payload from 'payload';
import { config as dotenv } from 'dotenv';
import path from 'path';
import { FamillesOlfactive } from '../payload-types';

dotenv({ path: path.resolve(__dirname, '../../.env') });

const listFamilles = async (): Promise<void> => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || '',
      mongoURL: process.env.MONGODB_URI || '',
      express: undefined,
      onInit: async () => {
        console.log('Récupération de toutes les familles olfactives...');

        const familles = await payload.find({
          collection: 'familles-olfactives',
          limit: 200,
        });

        console.log('--- Familles Olfactives en Base de Données ---');
        if (familles.docs.length === 0) {
          console.log('Aucune famille olfactive trouvée dans la collection.');
        } else {
          (familles.docs as FamillesOlfactive[]).forEach(famille => {
            console.log(`- ID: ${famille.id}, Nom: ${famille.nom}`);
          });
        }
        console.log('-------------------------------------------');
        console.log(`Total: ${familles.totalDocs} familles trouvées.`);
        
        process.exit(0);
      },
    });
  } catch (error) {
    console.error('Une erreur est survenue lors de l\'initialisation de Payload ou de la récupération des familles:', error);
    process.exit(1);
  }
};

listFamilles(); 