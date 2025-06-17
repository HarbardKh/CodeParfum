import { fetchData, API_URL, ApiError } from './apiService';

// Types pour les données des parfums
export interface Variante {
  volume: string;
  prix: number;
  ref: string;
}

export interface Parfum {
  id: string;
  numeroParf: string; // Remplacé reference par numeroParf
  inspiration?: string;
  slug: string;
  description?: string;
  description1?: string;
  familleOlfactive: {
    id: string;
    nom: string;
  } | string;
  genre: string;
  prix: number;
  image?: {
    url: string;
    alt: string;
  };
  formatParDefaut?: string;
  variantes?: Variante[];
  famillePrincipale?: string;
  familleSecondaire?: string;
  intensite?: string;
  occasion?: string;
  volume?: string;
  notesOlfactives?: {
    tete: string[];
    coeur: string[];
    fond: string[];
  };
  nouveaute?: boolean;
  bestSeller?: boolean;
  noteTete?: string;
  noteCoeur?: string;
  noteFond?: string;
  aPropos?: string;
  ConseilExpertise?: string;
  reference?: string; // Pour compatibilité
}

export interface ParfumResponse {
  docs: Parfum[];
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

// Données de démonstration pour les parfums (à utiliser en cas d'échec de l'API)
const defaultParfums: any[] = [ // Utilisation de any[] temporairement pour éviter les erreurs TypeScript pendant la transition
  { 
    id: '1', 
    numeroParf: 'CH006', // Remplacé nom et reference par numeroParf
    inspiration: 'Opium',
    slug: 'opium', 
    description1: 'Un parfum envoûtant aux notes orientales et épicées.',
    familleOlfactive: {
      id: 'fam1',
      nom: 'Orientale'
    },
    genre: 'F',
    prix: 79.90,
    noteTete: 'Mandarine - Bergamote - Poivre',
    noteCoeur: 'Jasmin - Rose - Ylang-ylang',
    noteFond: 'Vanille - Ambre - Patchouli',
    volume: '70ml',
    formatParDefaut: '70ml',
    variantes: [
      { volume: '70ml', prix: 79.90, ref: 'CH006' },
      { volume: '30ml', prix: 49.90, ref: 'CH006-30' },
      { volume: '15ml', prix: 29.90, ref: 'CH006-15' }
    ],
    nouveaute: false,
    bestSeller: true,
  },
  { 
    id: '2', 
    numeroParf: 'CH012', // Remplacé nom et reference par numeroParf
    inspiration: 'Aventus',
    slug: 'aventus', 
    description1: 'Un parfum frais et audacieux pour l\'homme moderne.',
    familleOlfactive: {
      id: 'fam2',
      nom: 'Boisée'
    },
    genre: 'H',
    prix: 89.90,
    noteTete: 'Ananas - Bergamote - Cassis',
    noteCoeur: 'Bouleau - Patchouli - Rose',
    noteFond: 'Musc - Chêne - Vanille',
    volume: '70ml',
    formatParDefaut: '70ml',
    variantes: [
      { volume: '70ml', prix: 89.90, ref: 'CH012' },
      { volume: '30ml', prix: 59.90, ref: 'CH012-30' }
    ],
    nouveaute: true,
    bestSeller: false,
  },
  { 
    id: '3', 
    numeroParf: 'CH008', 
    inspiration: 'La Vie Est Belle',
    slug: 'la-vie-est-belle', 
    description: 'Une ode à la beauté de la vie avec des notes gourmandes.',
    familleOlfactive: {
      id: 'fam3',
      nom: 'Florale Fruité'
    },
    genre: 'F',
    prix: 75.90,
    noteTete: 'Cassis - Poire',
    noteCoeur: 'Iris - Jasmin - Fleur d\'oranger',
    noteFond: 'Praline - Vanille - Patchouli',
    volume: '70ml',
    formatParDefaut: '70ml',
    variantes: [
      { volume: '70ml', prix: 75.90, ref: 'CH008' },
      { volume: '30ml', prix: 45.90, ref: 'CH008-30' },
      { volume: '15ml', prix: 25.90, ref: 'CH008-15' }
    ],
    stock: 20,
    nouveaute: false,
    bestSeller: true
  }
]

// Fonction pour récupérer tous les parfums avec pagination
export const getAllParfums = async (
  page = 1, 
  limit = 12, 
  filters?: { genre?: string; familleOlfactive?: string; nouveaute?: boolean; search?: string }
): Promise<{ data: ParfumResponse | null; error: ApiError | null }> => {
  const params = { 
    page, 
    limit,
    ...(filters || {})
  };
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Débogage API] Paramètres de la requête:', params);
  }
  
  try {
    const result = await fetchData<ParfumResponse>('/api/parfums', { params });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Débogage API] Réponse brute:', result);
    
      if (!result.data) {
        console.error('[Débogage API] Pas de données reçues');
      } else {
        console.log('[Débogage API] Détails de la réponse:', {
          totalDocs: result.data.totalDocs,
          docs: result.data.docs?.length || 0,
          page: result.data.page,
          totalPages: result.data.totalPages,
          hasNextPage: result.data.hasNextPage,
          hasPrevPage: result.data.hasPrevPage
        });
        
        if (result.data.docs && result.data.docs.length > 0) {
          console.log('[Débogage API] Premier parfum:', {
            numeroParf: result.data.docs[0].numeroParf,
            id: result.data.docs[0].id
          });
          console.log('[Débogage API] Dernier parfum:', {
            numeroParf: result.data.docs[result.data.docs.length - 1].numeroParf,
            id: result.data.docs[result.data.docs.length - 1].id
          });
        }
      }
    }
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Débogage API] Erreur lors de la récupération des parfums:', error);
    }
    return { data: null, error: { status: 500, message: 'Erreur lors de la récupération des parfums' } };
  }
};

// Fonction pour récupérer un parfum par son slug
export const getParfumBySlug = async (slug: string): Promise<{ data: Parfum | null; error: ApiError | null }> => {
  // Recherche dans les données de démo d'abord
  const defaultParfum = defaultParfums.find(p => p.slug === slug);
  return await fetchData<Parfum>(`/api/parfums/slug/${slug}`, {}, defaultParfum);
};

// Fonction pour récupérer un parfum par son numéro
export const getParfumByReference = async (reference: string): Promise<{ data: Parfum | null; error: ApiError | null }> => {
  const params = {
    where: {
      numeroParf: {
        equals: reference,
      },
    },
    depth: 2,
  };
  
  const result = await fetchData<ParfumResponse>('/api/parfums', { params });
  
  if (result.data && result.data.docs && result.data.docs.length > 0) {
    return { data: result.data.docs[0], error: null };
  }
  
  // Si aucun parfum n'est trouvé ou en cas d'erreur, chercher dans les données de démonstration
  // Note: les données de démo utilisent encore 'reference', nous gardons cette recherche pour la compatibilité
  const defaultParfum = defaultParfums.find(p => p.numeroParf === reference || p.reference === reference);
  
  if (defaultParfum) {
    return { data: defaultParfum, error: result.error };
  }
  
  return { data: null, error: result.error || { status: 404, message: 'Parfum non trouvé' } };
};

// Fonction pour récupérer les parfums en vedette
export const getFeaturedParfums = async (limit = 4): Promise<{ data: Parfum[]; error: ApiError | null }> => {
  const params = {
    limit,
    bestSeller: true,
    sort: '-createdAt'
  };
  
  const result = await fetchData<ParfumResponse>('/api/parfums', { params });
  
  if (result.data && result.data.docs) {
    return { data: result.data.docs, error: null };
  }
  
  // Fallback sur les données de démo
  const featuredDemoParfums = defaultParfums.filter(p => p.bestSeller).slice(0, limit);
  return { data: featuredDemoParfums, error: result.error };
};

// Fonction pour récupérer les nouveautés
export const getNewArrivals = async (limit = 4): Promise<{ data: Parfum[]; error: ApiError | null }> => {
  const params = {
    limit,
    nouveaute: true,
    sort: '-createdAt'
  };
  
  const result = await fetchData<ParfumResponse>('/api/parfums', { params });
  
  if (result.data && result.data.docs) {
    return { data: result.data.docs, error: null };
  }
  
  // Fallback sur les données de démo
  const newDemoParfums = defaultParfums.filter(p => p.nouveaute).slice(0, limit);
  return { data: newDemoParfums, error: result.error };
};

// Fonction pour récupérer les parfums par famille olfactive
export const getParfumsByFamilleOlfactive = async (familleNom: string, limit = 8): Promise<{ data: Parfum[]; error: ApiError | null }> => {
  const params = {
    limit,
    'familleOlfactive.nom': familleNom,
    sort: '-createdAt'
  };
  
  const result = await fetchData<ParfumResponse>('/api/parfums', { params });
  
  if (result.data && result.data.docs) {
    return { data: result.data.docs, error: null };
  }
  
  // Fallback sur les données de démo
  const filteredDemoParfums = defaultParfums
    .filter(p => {
      if (typeof p.familleOlfactive === 'string') {
        return p.familleOlfactive === familleNom;
      } else if (p.familleOlfactive && typeof p.familleOlfactive === 'object') {
        return p.familleOlfactive.nom === familleNom;
      }
      return false;
    })
    .slice(0, limit);
  
  return { data: filteredDemoParfums, error: result.error };
};

// Nouvelle fonction pour obtenir 6 parfums aléatoires qui changent tous les 3 jours
export const getRandomParfumsForSelection = async (limit = 6): Promise<{ data: Parfum[]; error: ApiError | null }> => {
  // Utiliser la date actuelle pour générer un seed qui change tous les 3 jours
  const currentDate = new Date();
  const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  const seedPeriod = Math.floor(dayOfYear / 3); // Change tous les 3 jours
  
  // Paramètres pour récupérer tous les parfums
  const params = {
    limit: 100, // Récupérer un nombre suffisant pour faire une sélection aléatoire
    sort: '-createdAt'
  };
  
  try {
    const result = await fetchData<ParfumResponse>('/api/parfums', { params });
    
    if (result.data && result.data.docs && result.data.docs.length > 0) {
      // Fonction pour générer un nombre pseudo-aléatoire basé sur un seed
      const pseudoRandom = (seed: number, max: number): number => {
        // Simple algorithme de génération pseudo-aléatoire basé sur un seed
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        const randomValue = (a * seed + c) % m;
        return Math.floor((randomValue / m) * max);
      };
      
      const parfums = result.data.docs;
      const selectedParfums: Parfum[] = [];
      const usedIndices = new Set<number>();
      
      // Sélectionner 'limit' parfums uniques
      for (let i = 0; i < limit && usedIndices.size < parfums.length; i++) {
        // Générer un index aléatoire basé sur le seed et la position
        let randomIndex = pseudoRandom(seedPeriod + i * 1000, parfums.length);
        
        // S'assurer que nous ne sélectionnons pas le même parfum deux fois
        while (usedIndices.has(randomIndex) && usedIndices.size < parfums.length) {
          randomIndex = (randomIndex + 1) % parfums.length;
        }
        
        usedIndices.add(randomIndex);
        selectedParfums.push(parfums[randomIndex]);
      }
      
      return { data: selectedParfums, error: null };
    }
    
    // Fallback sur les données de démo si aucun parfum n'est trouvé
    const shuffledDemoParfums = [...defaultParfums].sort(() => {
      // Utiliser un tri aléatoire basé sur le seedPeriod
      return 0.5 - Math.sin(seedPeriod * 0.1);
    }).slice(0, limit);
    
    return { data: shuffledDemoParfums, error: null };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erreur lors de la récupération des parfums aléatoires:', error);
    }
    
    // Fallback sur les données de démo en cas d'erreur
    const shuffledDemoParfums = [...defaultParfums].sort(() => {
      // Utiliser un tri aléatoire basé sur le seedPeriod
      return 0.5 - Math.sin(seedPeriod * 0.1);
    }).slice(0, limit);
    
    return { 
      data: shuffledDemoParfums, 
      error: { status: 500, message: 'Erreur lors de la récupération des parfums aléatoires' } 
    };
  }
};
