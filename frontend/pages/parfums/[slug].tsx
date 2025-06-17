import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/layout/Layout';
import ParfumDetailV2 from '@/components/parfums/ParfumDetailV2';
import { getParfumByReference } from '@/services/parfumService';
import { fetchData } from '@/services/apiService';

// Interface pour la réponse paginée de l'API
interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Interface pour les parfums
interface Parfum {
  id: string;
  numeroParf?: string;
  reference?: string;
  noteTete?: string;
  noteCoeur?: string;
  noteFond?: string;
  notesOlfactives?: {
    tete?: { note: string }[];
    coeur?: { note: string }[];
    fond?: { note: string }[];
  };
  [key: string]: any; // Pour permettre d'autres propriétés
}

interface ParfumPageProps {
  parfum: any;
  error?: string;
  apiSource: string;
}

export default function ParfumPage({ parfum, error, apiSource }: ParfumPageProps) {
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold">Erreur</h1>
          <p>{error}</p>
          <a href="/parfums" className="text-burgundy hover:underline">
            Retour au catalogue
          </a>
        </div>
      </Layout>
    );
  }

  // Utiliser le composant ParfumDetailV2 qui gère les variantes
  return <ParfumDetailV2 parfum={parfum} apiSource={apiSource} error={error} />;
}

// Récupère les données d'un parfum spécifique à partir de sa référence
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    if (!slug) {
      return { notFound: true };
    }

    // Extraire le numéro du parfum depuis le format 'ref-XXX' du slug
    const numeroParf = slug.startsWith('ref-') ? slug.substring(4) : null;
    
    if (!numeroParf) {
      return { notFound: true }; // Si le format du slug n'est pas valide
    }
    
    // Utiliser notre service amélioré avec gestion d'erreurs automatique
    const { data: parfum, error } = await getParfumByReference(numeroParf);
    
    if (parfum) {
      // Si le parfum vient des données de démo, formatter les notes olfactives
      // On utilise un type plus général pour permettre l'ajout des notes formatées
      let formattedParfum: any = { ...parfum };
      
      // Conversion des notes textuelles en objets si nécessaire
      if (parfum.noteTete && !parfum.notesOlfactives?.tete) {
        formattedParfum = {
          ...formattedParfum,
          notesDepart: parfum.noteTete.split('-').map((note: string) => ({ note: note.trim() })) || [],
          notesCoeur: parfum.noteCoeur?.split('-').map((note: string) => ({ note: note.trim() })) || [],
          notesFond: parfum.noteFond?.split('-').map((note: string) => ({ note: note.trim() })) || []
        };
      }
      
      return {
        props: {
          parfum: formattedParfum,
          apiSource: error ? 'demo' : 'api',
          error: error ? error.message : null
        },
        revalidate: 3600, // Revalider les données toutes les heures
      };
    }
    
    // Si aucun parfum n'a été trouvé
    return { 
      notFound: true 
    };
  } catch (error) {
    console.error('Erreur globale lors de la récupération du parfum:', error);
    return { notFound: true };
  }
};

// Génère tous les chemins possibles pour les parfums
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // D'abord, essayer de récupérer les parfums via l'API
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
    
    const { data, error } = await fetchData<PaginatedResponse<Parfum>>(
      '/api/parfums',
      {
        params: {
          limit: 1000, // Récupérer un grand nombre de parfums
        },
        baseURL: apiUrl
      }
    );

    if (error) {
      console.error('Erreur lors de la récupération des parfums:', error);
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    if (data?.docs && data.docs.length > 0) {
      // Créer les chemins pour chaque parfum récupéré de l'API
      // Utiliser le numeroParf au lieu du slug pour masquer les noms d'origine
      const paths = data.docs.map((parfum: Parfum) => ({
        params: { slug: `ref-${parfum.numeroParf || parfum.reference}` },
      }));

      return {
        paths,
        fallback: 'blocking', // Si un chemin n'existe pas, attendre la génération de la page
      };
    }
    
    return {
      paths: [],
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Erreur lors de la génération des chemins:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

