import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { logSecurityEvent } from './securityLogger';

/**
 * Middleware de validation qui applique les règles et gère les erreurs
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Exécute toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Récupère les erreurs de validation
    const errors = validationResult(req);
    
    // S'il n'y a pas d'erreurs, on continue
    if (errors.isEmpty()) {
      return next();
    }
    
    // Log l'événement de sécurité pour les requêtes invalides
    logSecurityEvent(
      'VALIDATION_FAILED', 
      `Validation échouée pour ${req.method} ${req.originalUrl || req.url} - ${JSON.stringify(errors.array())}`,
      (req as any)?.user?.id || 'anonymous'
    );
    
    // Retourne les erreurs
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
      message: 'Les données fournies sont invalides'
    });
  };
};

/**
 * Validation pour les identifiants
 */
export const validateId = () => {
  return [
    param('id')
      .isMongoId()
      .withMessage('L\'identifiant n\'est pas valide')
  ];
};

/**
 * Validation pour les requêtes de connexion
 */
export const validateLogin = () => {
  return [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('L\'email n\'est pas valide'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères')
  ];
};

/**
 * Validation pour la création/modification d'un parfum
 */
export const validateParfum = () => {
  return [
    body('numeroParf')
      .notEmpty()
      .withMessage('Le numéro de parfum est requis')
      .isNumeric()
      .withMessage('Le numéro de parfum doit être un nombre'),
    body('inspiration')
      .if(body('inspiration').exists())
      .isString()
      .withMessage('L\'inspiration doit être une chaîne de caractères'),
    body('genre')
      .notEmpty()
      .withMessage('Le genre est requis')
      .isIn(['F', 'H', 'U'])
      .withMessage('Le genre doit être F, H ou U'),
    body('actif')
      .optional()
      .isBoolean()
      .withMessage('Le statut actif doit être un booléen')
  ];
};

/**
 * Validation pour les paramètres de pagination
 */
export const validatePagination = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La page doit être un entier positif'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('La limite doit être un entier entre 1 et 100')
  ];
};

/**
 * Validation pour les requêtes de recherche
 */
export const validateSearch = () => {
  return [
    query('q')
      .optional()
      .isString()
      .withMessage('Le terme de recherche doit être une chaîne de caractères')
      .isLength({ min: 2, max: 50 })
      .withMessage('Le terme de recherche doit contenir entre 2 et 50 caractères'),
    ...validatePagination()
  ];
};
