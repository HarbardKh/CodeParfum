/**
 * Script de seed pour initialiser la base de données sur Render
 */
import path from 'path';
import payload from 'payload';

// Définition des collections disponibles dans PayloadCMS
enum CollectionSlug {
  Parfums = 'parfums',
  Users = 'users',
  FamillesOlfactives = 'familles-olfactives',
  Media = 'media',
  Articles = 'articles',
}

// Script à utiliser uniquement en production ou staging après le déploiement
async function seed() {
  // Initialise Payload - utilise la configuration standard
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'SECRET_DEFAULT_A_CHANGER',
    express: undefined, // Utiliser undefined au lieu de null
    onInit: async () => {
      console.log('🌱 Seed script started');
      
      // Vérifie si la base de données contient déjà des données
      const existingParfums = await payload.find({
        collection: CollectionSlug.Parfums,
        limit: 1,
      });
      
      if (existingParfums.totalDocs > 0) {
        console.log('✅ Base de données déjà initialisée, aucune action nécessaire');
        process.exit(0);
        return;
      }
      
      // Création des utilisateurs par défaut si nécessaire
      try {
        const adminExists = await payload.find({
          collection: CollectionSlug.Users,
          where: {
            email: {
              equals: 'admin@chogan-mvp.com',
            },
          },
        });
        
        if (adminExists.totalDocs === 0) {
          await payload.create({
            collection: CollectionSlug.Users,
            data: {
              name: 'Administrateur',  // Ajout du champ name requis
              email: 'admin@chogan-mvp.com',
              password: process.env.ADMIN_INITIAL_PASSWORD || 'defaultChangeMe2024!',
              roles: ['admin'],
            },
          });
          console.log('✅ Utilisateur admin créé');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error);
      }
      
      console.log('✅ Seed script completed successfully');
      process.exit(0);
    },
  });
}

seed().catch((err: Error) => {
  console.error('❌ Erreur lors du seed:', err);
  process.exit(1);
});
