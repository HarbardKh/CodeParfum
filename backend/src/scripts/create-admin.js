// create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env' });

async function createAdmin() {
  try {
    console.log('Tentative de connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion établie avec MongoDB Atlas');

    // Vérifier si la collection users existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCollectionExists = collections.some(col => col.name === 'users');
    
    if (!userCollectionExists) {
      console.log('La collection users n\'existe pas encore');
      return;
    }

    // Vérifier si un utilisateur admin existe déjà
    const existingAdmin = await mongoose.connection.db.collection('users')
      .findOne({ email: 'admin@atelier-olfactif.fr' });
    
    if (existingAdmin) {
      console.log('Un utilisateur admin existe déjà avec cette adresse email');
      return;
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);

    // Créer l'utilisateur admin
    const result = await mongoose.connection.db.collection('users').insertOne({
      email: 'admin@atelier-olfactif.fr',
      password: hashedPassword,
      name: 'Administrator',
      roles: ['admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Utilisateur admin créé avec succès');
    console.log('Email: admin@atelier-olfactif.fr');
    console.log('Mot de passe: AdminPassword123!');

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
}

createAdmin();
