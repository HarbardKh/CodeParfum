import axios from 'axios';
import { resilientApiClient, fetchWithRetry, API_URL } from './axiosRetry';
import { GetStaticProps, GetServerSideProps } from 'next';

// La constante API_URL est maintenant importée depuis axiosRetry.ts

// Interface pour les résultats paginés
interface PaginatedDocs<T> {
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

// Client axios configuré pour l'API Payload avec logique de retry
// On utilise maintenant resilientApiClient importé depuis axiosRetry.ts

/**
 * Fonction utilitaire pour récupérer des données depuis l'API Payload
 * @param endpoint - Endpoint de l'API (ex: /api/parfums)
 * @param params - Paramètres de requête optionnels
 */
export async function fetchFromPayload<T>(endpoint: string, params: Record<string, any> = {}) {
  try {
    // Utilisation du client résilient avec retry automatique
    return await fetchWithRetry<T>(endpoint, params);
  } catch (error) {
    console.error(`Erreur lors de la récupération des données depuis ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fonction utilitaire pour getStaticProps avec des données Payload
 * Permet de récupérer des données depuis l'API Payload pour les pages statiques
 */
export const getStaticPropsWithPayload: GetStaticProps = async (context) => {
  try {
    // Récupérer les parfums mis en avant
    const featuredParfums = await fetchFromPayload<PaginatedDocs<any>>('/api/parfums', {
      limit: 6,
      sort: '-popularite',
      depth: 1,
    });

    // Récupérer les familles olfactives
    const famillesOlfactives = await fetchFromPayload<PaginatedDocs<any>>('/api/familles-olfactives', {
      limit: 10,
    });

    // Récupérer les articles de blog
    const articles = await fetchFromPayload<PaginatedDocs<any>>('/api/articles', {
      limit: 3,
      sort: '-datePublication',
    });

    return {
      props: {
        featuredParfums: featuredParfums?.docs || [],
        famillesOlfactives: famillesOlfactives?.docs || [],
        articles: articles?.docs || [],
      },
      // Revalidation toutes les 10 minutes
      revalidate: 600,
    };
  } catch (error) {
    console.error('Erreur dans getStaticPropsWithPayload:', error);
    return {
      props: {
        featuredParfums: [],
        famillesOlfactives: [],
        articles: [],
      },
      revalidate: 60,
    };
  }
};

/**
 * Fonction utilitaire pour getServerSideProps avec des données Payload
 * Permet de récupérer des données depuis l'API Payload pour les pages dynamiques
 */
export const getServerSidePropsWithPayload: GetServerSideProps = async (context) => {
  // Fonction similaire à getStaticPropsWithPayload mais pour le rendu côté serveur
  // Utile pour les pages qui nécessitent des données fraîches à chaque requête
  try {
    // Exemple d'implémentation - à adapter selon les besoins
    const { query } = context;

    return {
      props: {
        // Propriétés dynamiques
        query: query || {},
      },
    };
  } catch (error) {
    console.error('Erreur dans getServerSidePropsWithPayload:', error);
    return {
      props: {
        query: {},
      },
    };
  }
};

/**
 * Interface pour le client Payload simplifié
 */
export interface PayloadClient {
  find: <T = any>(params: {
    collection: string;
    where?: Record<string, any>;
    limit?: number;
    sort?: string;
    page?: number;
    depth?: number;
    populate?: Record<string, any>;
  }) => Promise<{ docs: T[]; totalDocs: number; totalPages: number; page: number; }>
}

/**
 * Fonction utilitaire pour getStaticPaths avec des données Payload
 * Permet de générer les chemins statiques pour les pages dynamiques
 */
export const getStaticPathsWithPayload = async <T = any>(
  callback: (payload: PayloadClient) => Promise<T>
): Promise<T> => {
  // Créons un "faux" payload qui utilise notre client axios pour les requêtes
  const payload: PayloadClient = {
    find: async ({ collection, where = {}, limit = 10, sort, page, depth, populate }) => {
      try {
        const response = await axios.get(`${API_URL}/api/${collection}`, {
          params: {
            where: JSON.stringify(where),
            limit,
            sort,
            page,
            depth,
            populate: populate ? JSON.stringify(populate) : undefined
          }
        });
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la récupération des données depuis ${collection}:`, error);
        return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
      }
    }
  };

  // Appeler le callback avec notre "faux" payload
  return callback(payload);
};
