import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { transformImageUrl } from '@/lib/imageUtils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackGender?: 'M' | 'F' | 'U';
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  fallbackGender,
  ...rest
}) => {
  const [error, setError] = useState(false);
  
  // Détermine l'image de fallback en fonction du genre si spécifié
  const getFallbackImage = () => {
    if (fallbackSrc) return fallbackSrc;
    
    // Image par défaut basée sur le genre
    if (fallbackGender === 'F') {
      return '/images/olfazetta-femme.png';
    } else if (fallbackGender === 'M') {
      return '/images/olfazetta-homme.png';
    } else {
      return '/images/placeholder.jpg';
    }
  };

  // Transformer l'URL de l'image pour qu'elle fonctionne en production
  // Ne pas transformer si l'URL contient déjà l'URL de production
  const validSrc = (!src || src === '') 
    ? getFallbackImage() 
    : (typeof src === 'string' && src.includes('https://projet-chogan-mvp.onrender.com'))
      ? src 
      : transformImageUrl(src as string);
  
  return (
    <Image
      src={error ? getFallbackImage() : validSrc}
      alt={alt || 'Image produit'}
      onError={() => setError(true)}
      {...rest}
    />
  );
};

export default ImageWithFallback; 