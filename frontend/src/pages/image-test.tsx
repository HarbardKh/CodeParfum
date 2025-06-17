import React from 'react';
import { GetStaticProps } from 'next';
import axios from 'axios';
import ImageExample from '../components/examples/ImageExample';
import Layout from '../components/layout/Layout';

// Types pour les données du parfum
interface Parfum {
  id: string;
  inspiration: string;
  description: any; // Rich text from PayloadCMS
  image?: {
    url: string;
  };
  numeroParf: string;
}

interface ImageTestPageProps {
  parfums: Parfum[];
  error?: string;
}

/**
 * Page de test pour démontrer la gestion sécurisée des images
 */
const ImageTestPage: React.FC<ImageTestPageProps> = ({ parfums, error }) => {
  // Récupérer les URLs des images de parfums si disponibles
  const parfumImageUrl = parfums?.[0]?.image?.url;
  const secondParfumImageUrl = parfums?.[1]?.image?.url;
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Test des images sécurisées</h1>
        
        {/* Message d'erreur si problème d'API */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erreur API:</strong> {error}
          </div>
        )}
        
        {/* Section: Explication */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">À propos de cette page</h2>
          <p className="mb-2">
            Cette page démontre les fonctionnalités du nouveau système de gestion sécurisée des images.
            Elle compare différentes approches pour gérer les images dans Next.js et montre comment notre système:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Transforme les URLs pour qu'elles pointent vers le bon serveur en fonction de l'environnement</li>
            <li>Détecte les images manquantes ou problématiques</li>
            <li>Utilise automatiquement des fallbacks appropriés selon le type d'image</li>
            <li>Offre une solution optimisée pour les performances et le SEO</li>
            <li>Évite les erreurs 404 dans la console qui nuisent aux performances</li>
          </ul>
        </section>
        
        {/* Composant d'exemple avec des images réelles et des fallbacks */}
        <div className="bg-white rounded-lg shadow-md">
          <ImageExample 
            parfumImageUrl={parfumImageUrl} 
            heroImageUrl={secondParfumImageUrl}
            brokenImageUrl="https://invalid-domain.com/broken-image.jpg"
          />
        </div>

        {/* Section: Guide d'implémentation */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Guide d'implémentation</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Utiliser le composant SafeImage</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {`import { SafeImage } from '../components/secure';

// Dans votre composant
<SafeImage
  src={parfum.image?.url}
  alt={parfum.inspiration}
  width={300}
  height={300}
  className="rounded-lg"
  fallbackSrc="/images/fallback/parfum-placeholder.jpg"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">2. Utiliser le hook useSafeImage</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {`import { useSafeImage } from '../hooks/useSafeImage';
import { ImageType } from '../lib/imageUtils';
import Image from 'next/image';

// Dans votre composant
const { imgProps } = useSafeImage(parfum.image?.url, parfum.inspiration, {
  type: ImageType.PARFUM
});

// Puis utiliser les props avec Next/Image
<Image {...imgProps} className="rounded-lg" />`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3. Utiliser directement les utilitaires</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                {`import { prepareImageUrl, ImageType } from '../lib/imageUtils';
import Image from 'next/image';

// Préparer l'URL
const imageUrl = prepareImageUrl(parfum.image?.url, ImageType.PARFUM);

// Utiliser avec Next/Image
<Image 
  src={imageUrl}
  alt={parfum.inspiration}
  width={300}
  height={300}
  className="rounded-lg"
/>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ImageTestPageProps> = async () => {
  try {
    // Récupérer quelques parfums pour tester avec des images réelles
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
    const response = await axios.get(`${serverUrl}/api/parfums?limit=3`);
    
    return {
      props: {
        parfums: response.data.docs || [],
      },
      // Revalider toutes les heures pour les tests
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des parfums:', error);
    return {
      props: {
        parfums: [],
        error: 'Erreur lors de la récupération des données. Voir la console pour plus de détails.',
      },
      revalidate: 60, // Réessayer plus rapidement en cas d'erreur
    };
  }
};

export default ImageTestPage;
