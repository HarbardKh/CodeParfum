import { config } from 'dotenv';
import path from 'path';
import payload from 'payload';
import { buildConfig } from 'payload/config';

// Charger les variables d'environnement
config({
  path: path.resolve(__dirname, '../../.env'),
});

// Fonction pour créer un utilisateur admin
async function createAdminUser() {
  try {
    // Utiliser directement le chemin de configuration
    process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, '../../payload.config.ts');
    
    // Initialiser Payload avec la configuration minimale
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'votre-secret',
      local: true, // Exécution en mode local (sans serveur HTTP)
    });

    console.log('Connexion à MongoDB établie');

    // Vérifier si un utilisateur admin existe déjà
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@atelier-olfactif.fr',
        },
      },
    });

    if (existingUsers.docs.length > 0) {
      console.log('Un utilisateur admin existe déjà');
      return;
    }

    // Créer un nouvel utilisateur admin
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@atelier-olfactif.fr',
        password: 'AdminPassword123!',
        name: 'Administrator',
        roles: ['admin'],
      },
    });

    console.log('Utilisateur admin créé avec succès:');
    console.log('Email: admin@atelier-olfactif.fr');
    console.log('Mot de passe: AdminPassword123!');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error);
  }

  // Fermer la connexion
  process.exit(0);
}

// Exécuter la fonction
createAdminUser();
