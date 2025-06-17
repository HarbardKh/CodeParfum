import { GetStaticPaths, GetStaticProps } from 'next';
import { sanitizeRichTextFields, richTextToPlainText } from '@/utils/richTextConverter';
import Layout from '@/components/layout/Layout';
import { getStaticPathsWithPayload, getStaticPropsWithPayload } from '../../src/lib/payload';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface Parfum {
  id: string;
  nom: string;
  prix: number;
  description: string;
  slug: string;
  genre: 'H' | 'F' | 'U';
  volume: string;
  image: {
    url: string;
    alt: string;
  } | null;
  family: {
    id: string;
    name: string;
  };
  intensite: string;
  pyramideOlfactive?: {
    head?: { note: string }[];
    heart?: { note: string }[];
    base?: { note: string }[];
  };
}

interface ParfumPageProps {
  parfum: Parfum;
}

export default function ParfumPage({ parfum }: ParfumPageProps) {
  const router = useRouter();

  // Si la page est en cours de génération, afficher un indicateur de chargement
  if (router.isFallback) {
    return (
      <Layout title="Chargement...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${parfum.nom} | CodeParfum.fr`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du parfum */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            {parfum.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${parfum.image.url}`}
                alt={parfum.image.alt || parfum.nom}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image non disponible</span>
              </div>
            )}
          </div>

          {/* Informations du parfum */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{parfum.nom}</h1>
            
            <div className="mt-4 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {parfum.genre === 'H' ? 'Homme' : parfum.genre === 'F' ? 'Femme' : 'Unisexe'}
              </span>
              <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {parfum.family.name}
              </span>
            </div>
            
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{parfum.description}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">Intensité</h2>
              <div className="mt-2 flex items-center">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-primary-500 rounded-full" 
                    style={{ 
                      width: parfum.intensite === 'Légère' ? '33%' : 
                             parfum.intensite === 'Moyenne' ? '66%' : '100%' 
                    }}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-600">{parfum.intensite}</span>
              </div>
            </div>

            {/* Pyramide olfactive */}
            {parfum.pyramideOlfactive && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Pyramide Olfactive</h2>
                
                <div className="mt-3 space-y-4">
                  {/* Notes de tête */}
                  {parfum.pyramideOlfactive.head && parfum.pyramideOlfactive.head.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Notes de tête</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {parfum.pyramideOlfactive.head.map((item, index) => (
                          <span key={index} className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
                            {item.note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes de cœur */}
                  {parfum.pyramideOlfactive.heart && parfum.pyramideOlfactive.heart.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Notes de cœur</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {parfum.pyramideOlfactive.heart.map((item, index) => (
                          <span key={index} className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs">
                            {item.note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes de fond */}
                  {parfum.pyramideOlfactive.base && parfum.pyramideOlfactive.base.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Notes de fond</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {parfum.pyramideOlfactive.base.map((item, index) => (
                          <span key={index} className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
                            {item.note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prix et volume */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">{parfum.prix} €</span>
                <span className="ml-2 text-sm text-gray-500">{parfum.volume}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return getStaticPathsWithPayload(async (payload) => {
    try {
      // Réduire le nombre de parfums générés à la compilation pour éviter le rate limiting (429)
      const parfums = await payload.find({
        collection: 'parfums',
        limit: 10, // Réduit de 100 à 10 pour éviter les erreurs 429
        // Optionnel: on peut ajouter un tri pour générer les plus populaires en premier
        sort: '-updatedAt', // Générer les plus récemment mis à jour
      });

      console.log(`Génération statique pour ${parfums.docs.length} parfums, les autres seront générés à la demande`);

      return {
        paths: parfums.docs.map((parfum: any) => ({
          params: { slug: parfum.slug },
        })),
        // 'blocking' signifie que les pages non pré-rendues seront générées côté serveur à la demande
        fallback: 'blocking',
      };
    } catch (error) {
      console.error('Error in getStaticPaths:', error);
      return {
        paths: [],
        fallback: 'blocking',
      };
    }
  });
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await axios.get(`${API_URL}/api/parfums`, {
      params: {
        where: JSON.stringify({
          slug: {
            equals: slug,
          },
        }),
        populate: JSON.stringify({
          image: {
            depth: 1,
          },
          family: {
            depth: 1,
          },
        }),
        limit: 1
      },
    });

    const parfumsData = response.data;

    if (!parfumsData || !parfumsData.docs || parfumsData.docs.length === 0) {
      return {
        notFound: true,
      };
    }
    
    // Récupérer le document brut
    const rawParfum = parfumsData.docs[0];
    
    // Sanitiser les données brutes avec notre utilitaire de conversion rich text
    const sanitizedRawParfum = sanitizeRichTextFields(rawParfum);
    
    // Créer un objet sanitisé pour éviter les erreurs de sérialisation
    const parfum: Parfum = {
      id: sanitizedRawParfum.id || '',
      nom: sanitizedRawParfum.nom || '',
      prix: typeof sanitizedRawParfum.prix === 'number' ? sanitizedRawParfum.prix : 0,
      // Conversion explicite du champ description qui cause l'erreur React #31
      description: typeof sanitizedRawParfum.description === 'string' ? sanitizedRawParfum.description : richTextToPlainText(sanitizedRawParfum.description),
      slug: sanitizedRawParfum.slug || '',
      genre: (sanitizedRawParfum.genre as 'H' | 'F' | 'U') || 'U',
      volume: sanitizedRawParfum.volume || '',
      image: sanitizedRawParfum.image ? {
        url: sanitizedRawParfum.image.url || '',
        alt: sanitizedRawParfum.image.alt || sanitizedRawParfum.nom || 'Parfum'
      } : null,
      family: sanitizedRawParfum.family ? {
        id: sanitizedRawParfum.family.id || '',
        name: sanitizedRawParfum.family.name || ''
      } : { id: '', name: '' },
      intensite: sanitizedRawParfum.intensite || '',
      // Assurer que pyramideOlfactive a toujours des tableaux valides
      pyramideOlfactive: {
        head: Array.isArray(sanitizedRawParfum.pyramideOlfactive?.head) ? 
          sanitizedRawParfum.pyramideOlfactive.head.map((item: any) => ({ note: item.note || '' })) : [],
        heart: Array.isArray(sanitizedRawParfum.pyramideOlfactive?.heart) ?
          sanitizedRawParfum.pyramideOlfactive.heart.map((item: any) => ({ note: item.note || '' })) : [],
        base: Array.isArray(sanitizedRawParfum.pyramideOlfactive?.base) ?
          sanitizedRawParfum.pyramideOlfactive.base.map((item: any) => ({ note: item.note || '' })) : []
      }
    };

    // Log pour déboggage
    console.log(`Parfum sanitisé pour ${slug}:`, JSON.stringify(parfum, null, 2));

    return {
      props: {
        parfum,
      },
      revalidate: 600, // Revalider toutes les 10 minutes
    };
  } catch (error) {
    console.error('Error in getStaticProps for slug:', slug, error);
    return {
      notFound: true,
    };
  }
};