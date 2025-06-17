/**
 * Exemple d'utilisation du système d'images sécurisées
 * 
 * Ce composant montre comment utiliser le hook useSafeImage et le composant SafeImage
 * pour gérer les images de manière sécurisée.
 */

import React from 'react';
import Image from 'next/image';
import { useSafeImage } from '../../hooks/useSafeImage';
import { ImageType } from '../../lib/imageUtils';
import SafeImage from '../SafeImage';

interface ImageExampleProps {
  parfumImageUrl?: string;
  heroImageUrl?: string;
  brokenImageUrl?: string;
}

// Exemple de composant utilisant différentes approches pour les images
const ImageExample: React.FC<ImageExampleProps> = ({
  parfumImageUrl,
  heroImageUrl,
  // URL intentionnellement cassée pour montrer le fallback
  brokenImageUrl = '/images/this-will-fail.jpg'
}) => {
  // Utilisation du hook pour l'image du parfum
  const parfum = useSafeImage(parfumImageUrl, 'Parfum', {
    type: ImageType.PARFUM,
    priority: true
  });
  
  // Utilisation du hook pour l'image hero
  const hero = useSafeImage(heroImageUrl, 'Image Hero', {
    type: ImageType.HERO
  });
  
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Exemples d&apos;images sécurisées</h2>
      
      {/* Section 1: Utilisation du hook useSafeImage avec Next/Image */}
      <section className="border rounded p-4">
        <h3 className="text-xl font-semibold mb-2">1. Avec le hook useSafeImage</h3>
        <p className="text-gray-600 mb-4">
          Cette approche utilise le hook personnalisé qui gère automatiquement les fallbacks et les transformations d&apos;URL.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Image de parfum:</p>
            <Image
              {...parfum.imgProps}
              className="rounded"
            />
            {parfum.isLoading && <p>Chargement...</p>}
            {parfum.error && (
              <p className="text-red-500">
                Erreur: {parfum.error.message}
              </p>
            )}
          </div>
          
          <div>
            <p className="mb-2">Image hero:</p>
            <Image
              {...hero.imgProps}
              className="rounded"
            />
          </div>
        </div>
      </section>
      
      {/* Section 2: Utilisation directe du composant SafeImage */}
      <section className="border rounded p-4">
        <h3 className="text-xl font-semibold mb-2">2. Avec le composant SafeImage</h3>
        <p className="text-gray-600 mb-4">
          Cette approche utilise directement le composant SafeImage qui gère les erreurs et les fallbacks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Image avec URL valide:</p>
            <SafeImage
              src={parfumImageUrl || ''}
              alt="Parfum"
              width={300}
              height={300}
              className="rounded"
            />
          </div>
          
          <div>
            <p className="mb-2">Image avec URL cassée (montre le fallback):</p>
            <SafeImage
              src={brokenImageUrl}
              alt="Image cassée"
              width={300}
              height={300}
              className="rounded"
              fallbackSrc="/images/fallback/parfum-placeholder.jpg"
            />
          </div>
        </div>
      </section>
      
      {/* Section 3: Comparaison avec l'approche standard Next/Image */}
      <section className="border rounded p-4">
        <h3 className="text-xl font-semibold mb-2">3. Comparaison avec Next/Image standard</h3>
        <p className="text-gray-600 mb-4">
          L&apos;approche standard peut générer des erreurs 404 et des images cassées.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              Next/Image avec URL valide:
            </p>
            <div className="relative h-[300px] w-[300px]">
              <Image
                src={parfumImageUrl || '/images/fallback/parfum-placeholder.jpg'}
                alt="Parfum avec Next/Image"
                fill
                className="object-cover rounded"
              />
            </div>
          </div>
          
          <div>
            <p className="mb-2">
              Next/Image avec URL cassée (erreur console):
            </p>
            <div className="relative h-[300px] w-[300px]">
              <Image
                src={brokenImageUrl}
                alt="Image cassée avec Next/Image"
                fill
                className="object-cover rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageExample;
