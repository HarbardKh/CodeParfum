/**
 * Utilitaires d'image avancés pour Chogan MVP
 * 
 * Ce module fournit des fonctions pour:
 * 1. Transformer les URLs d'images pour qu'elles pointent vers le bon serveur
 * 2. Détecter les images manquantes ou problématiques
 * 3. Générer des fallbacks appropriés
 * 4. Fournir des chemins vers les images statiques et du contenu
 */

// Constantes pour les chemins d'images statiques
export const STATIC_IMAGE_PATH = '/images/';
export const DEFAULT_FALLBACK = '/images/fallback/placeholder.jpg';

// Types d'images pour utiliser le bon fallback
export enum ImageType {
  PARFUM = 'parfum',
  HERO = 'hero',
  PROFILE = 'profile',
  LOGO = 'logo',
  BANNER = 'banner',
  GENERIC = 'generic'
}

// Mapping des types d'images vers les fallbacks appropriés
const fallbackMap: Record<ImageType, string> = {
  [ImageType.PARFUM]: '/images/fallback/parfum-placeholder.jpg',
  [ImageType.HERO]: '/images/fallback/hero-placeholder.jpg',
  [ImageType.PROFILE]: '/images/fallback/profile-placeholder.jpg',
  [ImageType.LOGO]: '/images/fallback/logo-placeholder.jpg',
  [ImageType.BANNER]: '/images/fallback/banner-placeholder.jpg',
  [ImageType.GENERIC]: '/images/fallback/placeholder.jpg'
};

/**
 * Retourne une image de fallback appropriée selon le type d'image
 */
export function getFallbackImage(type: ImageType = ImageType.GENERIC): string {
  return fallbackMap[type] || DEFAULT_FALLBACK;
}

/**
 * Vérifie si une URL d'image est probablement valide
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Vérifie que l'URL a une extension d'image valide
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  const hasValidExtension = validExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  // Vérifie que l'URL n'est pas une URL d'erreur connue
  const isKnownErrorUrl = url.includes('undefined') || url.includes('[object%20Object]');
  
  return hasValidExtension && !isKnownErrorUrl;
}

/**
 * Transforme une URL d'image PayloadCMS pour qu'elle fonctionne correctement
 * quel que soit l'environnement (développement ou production)
 */
export function transformImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // URL du CMS en production - TOUJOURS utiliser cette URL en dur en production
  const CMS_PRODUCTION_URL = 'https://projet-chogan-mvp.onrender.com';
  const CMS_LOCAL_URL = 'http://localhost:3002';
  
  // Forcer l'utilisation de l'URL de production en environnement de production
  const isProduction = process.env.NODE_ENV === 'production' || 
                      (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
  
  // En production, utiliser TOUJOURS l'URL codée en dur
  const serverUrl = isProduction ? CMS_PRODUCTION_URL : (process.env.NEXT_PUBLIC_SERVER_URL || CMS_LOCAL_URL);
  
  // Si l'URL contient déjà l'URL de production, la laisser telle quelle
  if (url.includes(CMS_PRODUCTION_URL)) {
    return url;
  }
  
  // Si l'URL est absolue et contient localhost:3002
  if (url.includes(CMS_LOCAL_URL)) {
    return url.replace(CMS_LOCAL_URL, serverUrl);
  }
  
  // Si l'URL est relative (commence par /uploads)
  if (url.startsWith('/uploads')) {
    return `${serverUrl}${url}`;
  }
  
  // Pour toutes les autres URLs, les retourner telles quelles
  return url;
}

/**
 * Prépare une URL d'image pour l'affichage en vérifiant sa validité et en appliquant
 * les transformations nécessaires. Retourne une image fallback si nécessaire.
 */
export function prepareImageUrl(url: string | null | undefined, type: ImageType = ImageType.GENERIC): string {
  // Si l'URL n'est pas valide, utiliser une image de secours
  if (!isValidImageUrl(url)) {
    return getFallbackImage(type);
  }
  
  // Transformer l'URL pour qu'elle fonctionne dans l'environnement actuel
  return transformImageUrl(url);
}
