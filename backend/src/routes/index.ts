import express from 'express';
import { getParfums } from './api/parfums';
import { generateConseil } from './api/openai';
import { getRecommandations, testScoring, debugData } from './api/conseiller';
import { Request, Response } from 'express';
import { defaultLimiter, dataLimiter, sensitiveLimiter } from '../middleware/rateLimiter';
import { validate, validatePagination, validateSearch } from '../middleware/inputValidation';
import { protectAgainstCsrf, generateCsrfToken } from '../middleware/csrfProtection';
import cookieParser from 'cookie-parser';
import healthRouter from './api/health';
import choganRouter from './api/chogan';

export const initRoutes = (app: express.Express): void => {
  // Route pour obtenir un token CSRF (sans protection CSRF car c'est pour obtenir le token)
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    return generateCsrfToken(req, res);
  });
  // Route API pour les parfums avec rate limiter et validation des entrées
  app.get('/api/parfums', dataLimiter, validate(validateSearch()), (req: Request, res: Response, next) => {
    return getParfums(req as any, res, next);
  });
  
  // Route proxy pour l'API OpenAI avec rate limiter et validation des entrées
  // D'abord on applique les parseurs de corps JSON et URL-encoded
  app.use('/api/generate-conseil', express.json(), express.urlencoded({ extended: true }));
  // Puis on applique le rate limiter, la protection CSRF et la validation
  app.post('/api/generate-conseil', sensitiveLimiter, protectAgainstCsrf(), validate([]), (req: Request, res: Response, next) => {
    return generateConseil(req as any, res, next);
  });
  
  // Routes pour le conseiller virtuel avec système de scoring
  app.use('/api/conseiller', express.json(), express.urlencoded({ extended: true }));
  app.post('/api/conseiller/recommandations', sensitiveLimiter, protectAgainstCsrf(), validate([]), (req: Request, res: Response, next) => {
    return getRecommandations(req as any, res);
  });
  
  // Route de test du système de scoring
  app.get('/api/conseiller/test-scoring', dataLimiter, (req: Request, res: Response) => {
    return testScoring(req as any, res);
  });
  
  // Route de debug pour analyser les données
  app.get('/api/conseiller/debug-data', dataLimiter, (req: Request, res: Response) => {
    return debugData(req as any, res);
  });
  
  // Route de santé pour les health checks de Render
  app.use('/api/health', defaultLimiter, healthRouter);
  
  // Routes pour l'automatisation Chogan Smart Order
  app.use('/api/chogan', express.json(), express.urlencoded({ extended: true }));
  app.use('/api/chogan', sensitiveLimiter, choganRouter);
  
  // Route de test de sécurité - pour vérifier que les logs de sécurité fonctionnent
  app.get('/api/security-check', (req, res) => {
    if (!req.query.token || req.query.token !== 'valid-check') {
      return res.status(401).json({ status: 'error', message: 'Accès non autorisé' });
    }
    return res.status(200).json({ status: 'ok', message: 'Vérification de sécurité réussie' });
  });
};
