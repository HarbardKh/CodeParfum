/**
 * Configuration sécurisée des cookies de session
 * 
 * Définit des options sécurisées pour les cookies de session
 * utilisés dans l'application Express/PayloadCMS
 */

import { CookieOptions } from 'express';
import ms from 'ms';

// Durée de validité des sessions
const SESSION_DURATION = process.env.SESSION_DURATION || '4h';

// Configuration des cookies en fonction de l'environnement
export const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    // Durée de vie du cookie basée sur la configuration
    maxAge: ms(SESSION_DURATION),
    
    // En production, les cookies doivent utiliser Secure
    // pour être transmis uniquement via HTTPS
    secure: isProduction,
    
    // HttpOnly empêche l'accès aux cookies via JavaScript
    // Protection essentielle contre le XSS
    httpOnly: true,
    
    // Option SameSite protège contre les attaques CSRF
    sameSite: isProduction ? 'strict' : 'lax',
    
    // Le chemin où le cookie est valide
    path: '/',
  };
};

// Configuration de la session PayloadCMS
export const getPayloadSessionOptions = () => {
  return {
    // Options de cookies sécurisés
    cookies: getCookieOptions(),
    
    // Secret pour chiffrer les sessions
    // Utilisation de PAYLOAD_SECRET comme base
    secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET_REPLACE_ME',
    
    // Options de sécurité des sessions
    secureProxy: process.env.NODE_ENV === 'production',
    
    // Nom du cookie de session
    name: 'chogan_session',
    
    // Expiration basée sur la configuration
    expires: ms(SESSION_DURATION),
  };
};

// Fonction pour invalider une session
export const invalidateSession = (req: any): void => {
  if (req.session) {
    req.session.destroy();
  }
};
