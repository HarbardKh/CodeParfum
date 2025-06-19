/**
 * Configuration sécurisée des cookies de session
 * 
 * Définit des options sécurisées pour les cookies de session
 * utilisés dans l'application Express/PayloadCMS
 */

import { CookieOptions } from 'express';

// Durée de validité des sessions en millisecondes (4 heures par défaut)
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 heures

// Configuration des cookies en fonction de l'environnement
export const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    // Durée de vie du cookie (4 heures)
    maxAge: SESSION_DURATION_MS,
    
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
    
    // Expiration basée sur la configuration (4 heures)
    expires: SESSION_DURATION_MS,
  };
};

// Fonction pour invalider une session
export const invalidateSession = (req: any): void => {
  if (req.session) {
    req.session.destroy();
  }
};
