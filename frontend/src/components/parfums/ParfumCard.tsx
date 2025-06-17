import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '../ui/ImageWithFallback';

interface ParfumCardProps {
  parfum: {
    id: string;
    numeroParf?: string;
    reference?: string;
    prix?: number | string;
    genre?: string;
    familleOlfactive?: string | { nom?: string };
    nouveaute?: boolean;
    image?: {
      url?: string;
      alt?: string;
    };
  };
  variant?: 'grid' | 'featured';
  imageSize?: 'small' | 'medium' | 'large';
}

// Fonction pour formater le prix
const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2) + ' €';
  }
  return price ? String(price) + ' €' : 'Prix non disponible';
};

// Fonction pour obtenir le nom de la famille olfactive
const getFamilleNom = (famille: any): string => {
  if (typeof famille === 'string') {
    return famille;
  }
  if (famille && typeof famille === 'object') {
    return famille.nom || 'Non spécifiée';
  }
  return 'Non spécifiée';
};

/**
 * Composant réutilisable pour afficher une carte de parfum
 */
export const ParfumCard: React.FC<ParfumCardProps> = ({ 
  parfum, 
  variant = 'grid',
  imageSize = 'medium' 
}) => {
  // Déterminer l'URL de l'image avec fallback approprié
  const getParfumImage = () => {
    if (parfum.image && parfum.image.url && parfum.image.url.trim() !== '') {
      return parfum.image.url;
    }
    
    // Retourner directement l'image de fallback basée sur le genre
    return parfum.genre === 'F' || parfum.genre === 'Femme'
      ? '/images/olfazetta-femme.png'
      : '/images/olfazetta-homme.png';
  };

  // Déterminer le genre pour l'image de fallback
  const fallbackGender = parfum.genre === 'F' || parfum.genre === 'Femme' 
    ? 'F' 
    : 'M';

  // Construire l'URL de la page détail
  const getParfumUrl = () => {
    const reference = parfum.numeroParf || parfum.reference || parfum.id;
    return `/parfums/ref-${reference}`;
  };
  
  // Afficher le genre formaté
  const getGenreFormatted = () => {
    if (!parfum.genre) return 'Unisexe';
    
    if (parfum.genre === 'F' || parfum.genre.toLowerCase() === 'femme') {
      return 'Femme';
    } else if (parfum.genre === 'H' || parfum.genre.toLowerCase() === 'homme') {
      return 'Homme';
    } else {
      return 'Unisexe';
    }
  };
  
  // Classes d'image selon la taille
  const imageSizeClasses = {
    small: 'aspect-[3/4] max-h-52',
    medium: 'aspect-square max-h-64',
    large: 'aspect-[4/5] max-h-72'
  };
  
  if (variant === 'featured') {
    // Affichage en mode mise en avant (pour la page d'accueil)
    return (
      <Link href={getParfumUrl()} className="group">
        <div className={`relative ${imageSizeClasses[imageSize]} w-full overflow-hidden rounded-lg bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-300`}>
          {/* Image du parfum */}
          <div className="h-full w-full relative">
            <ImageWithFallback 
              src={getParfumImage()}
              alt={parfum.image?.alt || `Parfum ${parfum.numeroParf || parfum.reference || ''}`}
              fill
              fallbackGender={fallbackGender}
              className="object-contain object-center group-hover:scale-105 transition-transform duration-500" 
            />
            
            {/* Overlay avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-90 transition-opacity"></div>
          </div>
          
          {/* Badge Nouveauté si applicable */}
          {parfum.nouveaute && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Nouveauté
            </div>
          )}
        </div>
        
        {/* Informations du parfum */}
        <div className="mt-4 flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            N°{parfum.numeroParf || parfum.reference || ''}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {getFamilleNom(parfum.familleOlfactive)}
          </p>
          <p className="mt-1 text-sm text-primary-600 font-medium">
            {getGenreFormatted()}
          </p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {formatPrice(parfum.prix)}
          </p>
        </div>
      </Link>
    );
  }
  
  // Affichage standard en grille (pour le catalogue)
  return (
    <Link href={getParfumUrl()} className="block hover:shadow-md transition-shadow rounded-lg overflow-hidden">
      <div className="flex flex-col h-full">
        <div className={`relative ${imageSizeClasses[imageSize]} w-full bg-gray-100`}>
          <ImageWithFallback 
            src={getParfumImage()}
            alt={parfum.image?.alt || `Parfum ${parfum.numeroParf || parfum.reference || ''}`}
            fill
            fallbackGender={fallbackGender}
            className="object-cover object-center" 
          />
          
          {parfum.nouveaute && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Nouveauté
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow bg-white">
          <h3 className="font-medium text-lg">
            N°{parfum.numeroParf || parfum.reference || ''}
          </h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">
              {getGenreFormatted()}
            </span>
            <span className="text-sm">
              {getFamilleNom(parfum.familleOlfactive)}
            </span>
          </div>
          <p className="mt-auto pt-3 font-semibold text-primary-600">
            {formatPrice(parfum.prix)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ParfumCard; 