import express from 'express';
import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';
import { initRoutes } from './routes';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { defaultLimiter, authLimiter, sensitiveLimiter } from './middleware/rateLimiter';
import { securityLogger, logSecurityEvent } from './middleware/securityLogger';
import { csrfMiddleware } from './middleware/csrfProtection';

// Charge les variables d'environnement
config();

const app = express();

// Configuration pour faire confiance au proxy uniquement en production
if (process.env.NODE_ENV === 'production') {
  // En production, on peut faire confiance au proxy mais de manière plus restrictive
  // en spécifiant les adresses IP du proxy de confiance
  app.set('trust proxy', process.env.TRUSTED_PROXIES || '1');
} else {
  // En développement, on désactive trust proxy pour éviter les avertissements
  // et permettre au rate limiter de fonctionner correctement
  app.set('trust proxy', false);
}

// Application du rate limiting global
app.use(defaultLimiter);

// Configuration CORS avant tout middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://votre-domaine-production.com'] // Remplacer par votre domaine en production
    : true, // Autorise toutes les origines en développement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-csrf-token']
}));

// Configuration de Helmet pour les en-têtes de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé en développement pour éviter les problèmes de ressources croisées
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  originAgentCluster: true,
  dnsPrefetchControl: { allow: true },
  referrerPolicy: { policy: "no-referrer-when-downgrade" },
  hsts: process.env.NODE_ENV === 'production',
  xssFilter: true
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour parser les cookies (nécessaire pour CSRF)
app.use(cookieParser());

// Middleware de journalisation des événements de sécurité
app.use(securityLogger);

// Configuration des limiteurs de débit (rate limiting)
// Protection générale pour l'API
app.use('/api', defaultLimiter);

// Limiteur plus strict pour l'accès à l'administration
app.use('/admin', sensitiveLimiter);

// Protection renforcée pour les routes d'authentification sensibles
app.use('/api/users/login', authLimiter);
app.use('/api/users/forgot-password', authLimiter);
app.use('/api/users/reset-password', authLimiter);

// Middleware pour servir les assets statiques
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

// Initialisation de Payload
async function start(): Promise<void> {
  // Initialise Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'un_secret_par_defaut_securise',
    express: app,
    onInit: async () => {
      payload.logger.info(`PayloadCMS démarré avec succès`);
    },
  });

  // Initialisation des routes API personnalisées
  initRoutes(app);
  
  // Route de test simple
  app.get('/test', (req, res) => {
    console.log('====== ROUTE TEST APPELÉE ======');
    return res.json({ success: true, message: 'Le backend fonctionne correctement!' });
  });
  
  app.get('/inspect-parfums', async (req, res) => {
    console.log('====== INSPECTION DES PARFUMS ======');
    try {
      if (!payload) {
        return res.status(500).json({ error: 'Payload non initialisé' });
      }
      
      // Récupération directe sans filtrage
      const result = await payload.find({
        collection: 'parfums',
        limit: 5,
        depth: 0
      });
      
      // Extraction des données pertinentes
      const simplifiedData = result.docs.map(parfum => ({
        id: parfum.id,
        genre: parfum.genre,
        // Autres champs utiles
        numeroParf: parfum.numeroParf,
        inspiration: typeof parfum.inspiration === 'string' ? parfum.inspiration.substring(0, 30) + '...' : parfum.inspiration
      }));
      
      console.log('Premiers parfums:', JSON.stringify(simplifiedData, null, 2));
      return res.json({
        count: result.totalDocs,
        sampleData: simplifiedData,
        message: 'Vérifiez la console backend pour plus de détails'
      });
    } catch (error) {
      console.error('Erreur lors de l\'inspection:', error);
      return res.status(500).json({ error: String(error) });
    }
  });
  
  app.get('/inspect-genres', async (req, res) => {
    console.log('====== INSPECTION DES GENRES ======');
    try {
      if (!payload) {
        return res.status(500).json({ error: 'Payload non initialisé' });
      }
      
      // Récupération de tous les parfums
      const result = await payload.find({
        collection: 'parfums',
        limit: 1000, // Tous les parfums
        depth: 0
      });
      
      // Compter les parfums par genre
      const genreCounts: Record<string, number> = {};
      result.docs.forEach((parfum, index) => {
        const genre = parfum.genre || 'undefined';
        // Utiliser une string comme index et s'assurer que la valeur existe
        genreCounts[genre as string] = (genreCounts[genre as string] || 0) + 1;
      });
      
      console.log('Distribution des genres:', genreCounts);
      
      // Récupération de quelques exemples de chaque genre
      const examples: Record<string, any[]> = {};
      for (const genre in genreCounts) {
        if (genre !== 'undefined') {
          const exampleDocs = result.docs
            .filter(p => p.genre === genre)
            .slice(0, 3)
            .map(p => ({ id: p.id, numeroParf: p.numeroParf }));
          
          examples[genre] = exampleDocs;
        }
      }
      
      return res.json({
        totalCount: result.totalDocs,
        genreCounts,
        examples,
        message: 'Distribution des genres dans la base de données'
      });
    } catch (error) {
      console.error('Erreur lors de l\'inspection des genres:', error);
      return res.status(500).json({ error: String(error) });
    }
  });
  
  app.get('/fix-genres', async (req, res) => {
    console.log('====== CORRECTION DES GENRES ======');
    try {
      if (!payload) {
        return res.status(500).json({ error: 'Payload non initialisé' });
      }
      
      // Récupération de tous les parfums
      const result = await payload.find({
        collection: 'parfums',
        limit: 1000,
        depth: 0
      });
      
      let updatedCount = 0;
      // Définir un type explicite pour l'array updates
      type ParfumUpdate = { id: string; oldGenre: "F" | "H" | "U"; newGenre: "F" | "H" | "U" };
      const updates: ParfumUpdate[] = [];
      
      // Répartition des parfums en 3 groupes égaux
      for (let i = 0; i < result.docs.length; i++) {
        const parfum = result.docs[i];
        let newGenre;
        
        // Première partie = Femme (F)
        if (i < result.docs.length / 3) {
          newGenre = 'F';
        } 
        // Deuxième partie = Homme (H)
        else if (i < 2 * result.docs.length / 3) {
          newGenre = 'H';
        }
        // Troisième partie = Unisexe (U)
        else {
          newGenre = 'U';
        }
        
        // Ne mettre à jour que si le genre est différent
        if (parfum.genre !== newGenre) {
          try {
            await payload.update({
              collection: 'parfums',
              id: parfum.id,
              data: {
                genre: newGenre
              }
            });
            updatedCount++;
            // Assurer que newGenre est bien du type attendu
            // S'assurer que newGenre est bien du type attendu en faisant une validation complète
            const validGenres = ["F", "H", "U"] as const;
            type ValidGenre = typeof validGenres[number];
            
            // Valider et convertir explicitement
            let typedNewGenre: ValidGenre = "U"; // Par défaut "U"
            if (typeof newGenre === 'string' && 
                (newGenre === "F" || newGenre === "H" || newGenre === "U")) {
              typedNewGenre = newGenre;
            }
            
            // S'assurer que oldGenre est correct
            // Validons le genre actuel du parfum
            let oldGenre: "F" | "H" | "U" = "U";
            if (typeof parfum.genre === 'string' &&
                (parfum.genre === "F" || parfum.genre === "H" || parfum.genre === "U")) {
              oldGenre = parfum.genre;
            }
            
            updates.push({ 
              id: String(parfum.id), // Convertir explicitement en string
              oldGenre: oldGenre, 
              newGenre: typedNewGenre 
            });
          } catch (updateError) {
            console.error(`Erreur lors de la mise à jour du parfum ${String(parfum.id)}:`, updateError);
          }
        }
      }
      
      console.log(`${updatedCount} parfums mis à jour`);
      
      return res.json({
        success: true,
        updatedCount,
        updates,
        message: `${updatedCount} parfums ont été mis à jour pour équilibrer les genres`
      });
    } catch (error) {
      console.error('Erreur lors de la correction des genres:', error);
      return res.status(500).json({ error: String(error) });
    }
  });
  
  // Dossier pour les placeholders d'images
  app.use('/images/placeholders', express.static(path.resolve(__dirname, '../assets/placeholders')));

  // Redirection vers l'admin Payload
  app.get('/', (req, res) => {
    res.redirect('/admin');
  });

  // Démarre le serveur
  // En production, utiliser le port fourni par Render
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  app.listen(PORT, HOST, () => {
    // Afficher l'URL correcte selon l'environnement
    // Déterminer l'URL du serveur en fonction de l'environnement
    let serverURL: string;
    if (process.env.NODE_ENV === 'production') {
      // En production, utiliser l'URL externe fournie par Render ou l'URL publique définie manuellement
      serverURL = process.env.RENDER_EXTERNAL_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://projet-chogan-mvp.onrender.com';
    } else {
      // En développement, utiliser localhost avec le port
      serverURL = `http://${HOST}:${PORT}`;
    }
    
    payload.logger.info(`Serveur démarré sur ${serverURL}`);
  });
};

start();
