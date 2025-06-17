import rateLimit from 'express-rate-limit';

// Configuration de base pour tous les endpoints
export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // Augmenté en dev pour faciliter le build
  standardHeaders: true, // Renvoie les headers standard de rate limit (RateLimit-*)
  legacyHeaders: false, // Désactive les headers 'X-RateLimit-*'
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies (200) pour éviter de bloquer les images
  message: {
    status: 'error',
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  }
});

// Limiter plus stricte pour les endpoints sensibles
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 200, // Augmenté en dev pour faciliter le build
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies (200)
  message: {
    status: 'error',
    message: 'Trop de requêtes sur cet endpoint sensible, veuillez réessayer plus tard.'
  }
});

// Limiter très strict pour les endpoints d'authentification
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // Limite à 10 requêtes par heure
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Trop de tentatives, veuillez réessayer plus tard.'
  }
});

// Limiter pour les APIs qui retournent beaucoup de données
export const dataLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.NODE_ENV === 'production' ? 20 : 100, // Augmenté en dev pour faciliter le build
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies (200)
  message: {
    status: 'error',
    message: 'Trop de requêtes de données, veuillez réessayer plus tard.'
  }
}); 