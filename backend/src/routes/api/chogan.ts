import express from 'express';
import { body, validationResult } from 'express-validator';
import { ChoganAutomation, OrderRequest } from '../../services/chogan-automation';
import { ChoganPuppeteerAutomation } from '../../services/chogan-puppeteer';
import { choganLogger, LogLevel } from '../../utils/logger';
import { Request, Response } from 'express';

const router = express.Router();

// Validation middleware pour les données de commande
const validateOrderData = [
  // Validation des credentials revendeur
  body('credentials.email').isEmail().withMessage('Email revendeur invalide'),
  body('credentials.password').notEmpty().withMessage('Mot de passe revendeur requis'),
  
  // Validation des données client
  body('client.prenom').notEmpty().withMessage('Le prénom est requis'),
  body('client.nom').notEmpty().withMessage('Le nom est requis'),
  body('client.email').isEmail().withMessage('Email invalide'),
  body('client.telephone').notEmpty().withMessage('Le téléphone est requis'),
  body('client.adresse').notEmpty().withMessage('L\'adresse est requise'),
  body('client.codePostal').notEmpty().withMessage('Le code postal est requis'),
  body('client.ville').notEmpty().withMessage('La ville est requise'),
  body('client.pays').notEmpty().withMessage('Le pays est requis'),
  
  // Validation des produits
  body('produits').isArray({ min: 1 }).withMessage('Au moins un produit est requis'),
  body('produits.*.ref').notEmpty().withMessage('La référence produit est requise'),
  body('produits.*.quantite').isInt({ min: 1 }).withMessage('La quantité doit être un entier positif')
];

/**
 * POST /api/chogan/submit-order
 * Endpoint principal pour soumettre une commande à Chogan
 */
router.post('/submit-order', validateOrderData, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const orderData: OrderRequest = req.body;
    
    console.log('📨 Nouvelle commande reçue:', {
      client: `${orderData.client.prenom} ${orderData.client.nom}`,
      email: orderData.client.email,
      produits: orderData.produits.length
    });

    // Utiliser Puppeteer par défaut pour contourner Cloudflare
    console.log('🚀 Utilisation du service Puppeteer...');
    const puppeteerAutomation = new ChoganPuppeteerAutomation();

    // Traiter la commande
    const result = await puppeteerAutomation.processOrder(orderData);

    if (result.success) {
      console.log('✅ Commande traitée avec succès');
      res.json({
        success: true,
        message: 'Commande transférée avec succès à Chogan',
        chogan_link: result.chogan_link
      });
    } else {
      console.error('❌ Échec du traitement de la commande:', result.error);
      res.status(500).json({
        success: false,
        error: 'Échec du traitement de la commande',
        details: result.error
      });
    }

  } catch (error) {
    console.error('❌ Erreur serveur lors du traitement de la commande:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur interne',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

/**
 * GET /api/chogan/health
 * Endpoint de health check pour tester la connexion à Chogan avec Puppeteer
 */
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Health check avec Puppeteer...');
    
    // Utiliser Puppeteer au lieu d'Axios pour contourner Cloudflare
    const puppeteerAutomation = new ChoganPuppeteerAutomation();
    const isConnected = await puppeteerAutomation.testConnection();
    
    res.json({
      success: true,
      chogan_available: isConnected,
      timestamp: new Date().toISOString(),
      method: 'puppeteer'
    });
  } catch (error) {
    console.error('❌ Erreur health check:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de tester la connexion',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      method: 'puppeteer'
    });
  }
});

/**
 * POST /api/chogan/test-order
 * Endpoint de test avec des données factices
 */
router.post('/test-order', async (req, res) => {
  try {
    const testOrderData: OrderRequest = {
      credentials: {
        email: "test@revendeur.com",
        password: "password_test"
      },
      client: {
        prenom: "Test",
        nom: "User",
        email: "test@example.com",
        telephone: "0123456789",
        adresse: "123 rue de Test",
        codePostal: "75001",
        departement: "75",
        ville: "Paris",
        pays: "France"
      },
      produits: [
        { ref: "TEST001", quantite: 1 }
      ]
    };

    const choganAutomation = new ChoganAutomation();
    const result = await choganAutomation.processOrder(testOrderData);

    res.json({
      success: true,
      test_result: result,
      message: "Test d'automatisation exécuté"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors du test',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

/**
 * GET /api/chogan/logs
 * Récupérer les logs récents pour monitoring
 */
router.get('/logs', (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 50;
    const level = req.query.level as LogLevel;
    const module = req.query.module as string;

    let logs;
    if (level) {
      logs = choganLogger.getLogsByLevel(level, count);
    } else if (module) {
      logs = choganLogger.getLogsByModule(module, count);
    } else {
      logs = choganLogger.getRecentLogs(count);
    }

    const stats = choganLogger.getStats();

    res.json({
      success: true,
      logs,
      stats,
      filters: {
        count,
        level: level || 'all',
        module: module || 'all'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des logs',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

/**
 * DELETE /api/chogan/logs
 * Nettoyer les logs (pour admin)
 */
router.delete('/logs', (req, res) => {
  try {
    choganLogger.clearLogs();
    res.json({
      success: true,
      message: 'Logs nettoyés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors du nettoyage des logs',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Route pour tester le diagnostic d'authentification
router.post('/test-auth', async (req: Request, res: Response) => {
  const logger = choganLogger;
  logger.info('API', 'Demande de test diagnostic authentification');

  try {
    const { authCookies } = req.body;
    
    // Import dynamique pour éviter les problèmes de dépendances circulaires
    const { AuthDiagnosticTester } = await import('../../scripts/test-auth-diagnosis');
    
    const tester = new AuthDiagnosticTester();
    
    logger.info('API', 'Lancement du diagnostic d\'authentification');
    
    // Lancer le diagnostic
    await tester.runCompleteDiagnosis(authCookies);
    
    // Récupérer les logs récents pour la réponse
    const recentLogs = logger.getRecentLogs(100);
    const authTestLogs = logger.getLogsByModule('AUTH_TEST', 50);
    
    res.json({
      success: true,
      message: 'Diagnostic d\'authentification terminé',
      logs: {
        recent: recentLogs.slice(-20), // 20 derniers logs
        authTest: authTestLogs.slice(-30), // 30 derniers logs AUTH_TEST
        stats: logger.getStats()
      }
    });

  } catch (error: any) {
    logger.error('API', 'Erreur lors du diagnostic auth', {}, error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du diagnostic d\'authentification',
      details: error.message
    });
  }
});

export default router; 