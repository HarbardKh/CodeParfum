import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './securityLogger';

// Version simplifiée pour le développement - génère un token factice
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // En développement, on passe directement sans vérification CSRF
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // En production, on pourrait implémenter une vraie vérification CSRF
    next();
};

// Route pour générer un token factice en développement
export const generateCsrfToken = (req: Request, res: Response) => {
  try {
    // Génère un token factice pour le développement
    const fakeToken = 'dev-csrf-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    console.log('🔒 Génération d\'un token CSRF factice pour le développement:', fakeToken);
    
    res.json({ csrfToken: fakeToken });
  } catch (error) {
    console.error('Erreur dans generateCsrfToken:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erreur serveur lors de la génération du token CSRF' 
    });
  }
};

// Application selective de la protection CSRF
export const protectAgainstCsrf = () => {
  return csrfMiddleware;
};
