/**
 * Hook personnalisé pour la gestion sécurisée des images
 * 
 * Ce hook facilite l'utilisation des images dans les composants React
 * en gérant automatiquement les transformations d'URL et les fallbacks.
 */

import { useState, useEffect } from 'react';
import { 
  prepareImageUrl, 
  isValidImageUrl,
  ImageType,
  getFallbackImage
} from '../lib/imageUtils';

interface UseSafeImageOptions {
  type?: ImageType;
  width?: number;
  height?: number;
  priority?: boolean;
}

interface UseSafeImageResult {
  src: string;
  isLoading: boolean;
  error: Error | null;
  imgProps: {
    src: string;
    width: number;
    height: number;
    alt: string;
    priority?: boolean;
  };
}

/**
 * Hook pour gérer les images de manière sécurisée
 * 
 * @param srcUrl - URL de l'image source
 * @param alt - Texte alternatif pour l'image
 * @param options - Options de configuration
 * @returns Objet contenant les propriétés pour le composant Image
 */
export function useSafeImage(
  srcUrl: string | null | undefined,
  alt: string = 'Image',
  options: UseSafeImageOptions = {}
): UseSafeImageResult {
  const { 
    type = ImageType.GENERIC,
    width: customWidth,
    height: customHeight,
    priority = false
  } = options;

  // État pour l'URL de l'image
  const [src, setSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Dimensions par défaut basées sur le type d'image
  const getDefaultDimensions = () => {
    switch (type) {
      case ImageType.PARFUM:
        return { width: 300, height: 300 };
      case ImageType.HERO:
        return { width: 1920, height: 600 };
      case ImageType.PROFILE:
        return { width: 150, height: 150 };
      case ImageType.LOGO:
        return { width: 200, height: 80 };
      case ImageType.BANNER:
        return { width: 1200, height: 400 };
      default:
        return { width: 400, height: 300 };
    }
  };

  const defaultDimensions = getDefaultDimensions();
  const width = customWidth || defaultDimensions.width;
  const height = customHeight || defaultDimensions.height;

  // Effet pour préparer l'URL de l'image
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Valider et transformer l'URL
      if (!srcUrl || !isValidImageUrl(srcUrl)) {
        setSrc(getFallbackImage(type));
      } else {
        const transformedUrl = prepareImageUrl(srcUrl, type);
        setSrc(transformedUrl);
      }
    } catch (err: any) {
      setError(err);
      // En cas d'erreur, utiliser l'image de fallback
      setSrc(getFallbackImage(type));
    } finally {
      setIsLoading(false);
    }
  }, [srcUrl, type]);

  // Renvoyer les propriétés nécessaires pour le composant Image
  return {
    src,
    isLoading,
    error,
    imgProps: {
      src,
      width,
      height,
      alt,
      priority
    }
  };
}
