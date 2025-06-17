/**
 * Route de santé pour vérifier l'état du serveur
 * Utilisée par Render pour les health checks
 */
import express from 'express';

export const healthRouter = express.Router();

healthRouter.get('/', (req, res) => {
  // Vérifie l'état de l'application
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  return res.json(status);
});

export default healthRouter;
