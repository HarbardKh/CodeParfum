/**
 * SafeImage - Composant d'image sécurisé avec gestion des erreurs
 * 
 * Ce composant résout les problèmes suivants :
 * 1. Erreurs 404 pour les images manquantes
 * 2. Support des images statiques et distantes
 * 3. Optimisation automatique avec Next.js Image
 * 4. Fallback vers une image par défaut en cas d'erreur
 */

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { useRouter } from 'next/router';

// Path relatif pour les images statiques
const STATIC_IMAGE_PATH = '/images/';
// Image par défaut à utiliser en cas d'erreur
const DEFAULT_FALLBACK = '/images/fallback/placeholder.jpg';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  staticImagePath?: string;
  onImageError?: (error: Error) => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  staticImagePath = STATIC_IMAGE_PATH,
  alt = 'Image',
  width,
  height,
  onImageError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter();
  
  // Traitement du chemin d'image
  const processImagePath = (path: string): string => {
    // Si c'est une URL complète, la retourner telle quelle
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Si c'est un chemin relatif sans préfixe /images/, ajouter le chemin statique
    if (!path.startsWith('/')) {
      return `${staticImagePath}${path}`;
    }
    
    // Sinon, c'est déjà un chemin absolu dans l'application
    return path;
  };
  
  // Gestion des erreurs de chargement d'image
  const handleError = (error: Error): void => {
    console.warn(`Erreur de chargement de l'image: ${src}`, error);
    
    if (onImageError) {
      onImageError(error);
    }
    
    // Si nous n'avons pas encore essayé le fallback et que nous avons une source fallback,
    // utiliser l'image de fallback
    if (!isError && fallbackSrc) {
      setIsError(true);
      setImgSrc(processImagePath(fallbackSrc));
    }
  };
  
  return (
    <Image
      src={processImagePath(imgSrc)}
      alt={alt}
      width={width || 400}
      height={height || 300}
      onError={(err) => handleError(err as unknown as Error)}
      {...props}
      // Supprimer l'avertissement de console pour les priorités non définies
      priority={props.priority ?? (router.pathname === '/' || router.pathname === '/home')}
    />
  );
};

export default SafeImage;
