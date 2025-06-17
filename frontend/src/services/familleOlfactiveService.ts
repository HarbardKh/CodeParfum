import { fetchData } from './apiService';
import LogService from './logService';

// Type pour les familles olfactives
export interface FamilleOlfactive {
  id: string;
  nom: string;
  slug: string;
  description: string;
  caracteristiques?: string[];
  notesCommunes?: string[];
  parfumsNotables?: string[];
  image?: {
    url: string;
    alt: string;
  };
  icone?: string;
  couleur?: string;
}

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

// Fonction pour récupérer toutes les familles olfactives
export const getAllFamillesOlfactives = async (): Promise<FamilleOlfactive[]> => {
  try {
    const { data, error } = await fetchData<PaginatedResponse<FamilleOlfactive>>(
      '/api/familles-olfactives', 
      {}, 
      { docs: getDefaultFamillesOlfactives(), totalDocs: 7, limit: 100, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null }
    );
    
    if (error || !data) {
      LogService.error('Erreur lors de la récupération des familles olfactives:', error);
      // Retourner des familles par défaut en cas d'erreur
      return getDefaultFamillesOlfactives();
    }
    
    return data.docs;
  } catch (error) {
    LogService.error('Erreur lors de la récupération des familles olfactives:', error);
    // Retourner des familles par défaut en cas d'erreur
    return getDefaultFamillesOlfactives();
  }
};

// Fonction pour récupérer une famille olfactive par son slug
export const getFamilleOlfactiveBySlug = async (slug: string): Promise<FamilleOlfactive | null> => {
  try {
    const { data, error } = await fetchData<PaginatedResponse<FamilleOlfactive>>(
      '/api/familles-olfactives', 
      {
        params: {
          'where[slug][equals]': slug
        }
      }
    );
    
    if (error || !data) {
      LogService.error(`Erreur lors de la récupération de la famille olfactive ${slug}:`, error);
      
      // Chercher dans les familles par défaut en cas d'erreur
      const defaultFamilles = getDefaultFamillesOlfactives();
      const defaultFamille = defaultFamilles.find(f => f.slug === slug);
      return defaultFamille || null;
    }
    
    if (data.docs && data.docs.length > 0) {
      return data.docs[0];
    }
    
    // Si la famille n'est pas trouvée dans l'API, chercher dans les familles par défaut
    LogService.warn(`Famille olfactive ${slug} non trouvée dans l'API, utilisation des données par défaut`);
    const defaultFamilles = getDefaultFamillesOlfactives();
    const defaultFamille = defaultFamilles.find(f => f.slug === slug);
    
    return defaultFamille || null;
  } catch (error) {
    LogService.error(`Erreur lors de la récupération de la famille olfactive ${slug}:`, error);
    // Chercher dans les familles par défaut en cas d'erreur
    const defaultFamilles = getDefaultFamillesOlfactives();
    const defaultFamille = defaultFamilles.find(f => f.slug === slug);
    return defaultFamille || null;
  }
};

// Données par défaut pour les familles olfactives
export const getDefaultFamillesOlfactives = (): FamilleOlfactive[] => {
  return [
    {
      id: '1',
      nom: 'Florale',
      slug: 'florale',
      description: 'La famille des parfums floraux est la plus vaste et la plus populaire, particulierement dans les parfums feminins. Ces fragrances evoquent l\'arome naturel des fleurs',
      caracteristiques: ['Elegance', 'Feminite', 'Romantisme'],
      notesCommunes: ['Rose', 'Jasmin', 'Fleur d\'oranger', 'Tubereuse', 'Violette', 'Pivoine'],
      parfumsNotables: ['J\'adore de Dior', 'Flower by Kenzo', 'Coco Mademoiselle de Chanel'],
      icone: '🌸',
      couleur: 'bg-pink-100'
    },
    {
      id: '2',
      nom: 'Orientale',
      slug: 'orientale',
      description: 'Les parfums orientaux sont chaleureux, capiteux et sensuels. Ils se caracterisent par des notes epicees, boisees, balsamiques ou vanillees',
      caracteristiques: ['Sensualite', 'Chaleur', 'Opulence'],
      notesCommunes: ['Vanille', 'Ambre', 'Epices', 'Bois precieux', 'Encens', 'Muscs'],
      parfumsNotables: ['Shalimar de Guerlain', 'Black Opium d\'Yves Saint Laurent', 'Hypnotic Poison de Dior'],
      icone: '🌶️',
      couleur: 'bg-amber-100'
    },
    {
      id: '3',
      nom: 'Boisée',
      slug: 'boisee',
      description: 'Les parfums boises evoquent la nature sauvage, les forets et les sous-bois. Ils sont caracterises par l\'utilisation de notes issues du bois des arbres',
      caracteristiques: ['Force', 'Sophistication', 'Elegance naturelle'],
      notesCommunes: ['Cedre', 'Santal', 'Vetiver', 'Patchouli', 'Gaiac', 'Cypres'],
      parfumsNotables: ['Terre d\'Hermes', 'Santal 33 de Le Labo', 'Egoiste de Chanel'],
      icone: '🌲',
      couleur: 'bg-emerald-100'
    },
    {
      id: '4',
      nom: 'Aromatique',
      slug: 'aromatique',
      description: 'Les parfums aromatiques sont frais et herbaces, souvent construits autour de plantes aromatiques comme la lavande, le romarin ou la sauge',
      caracteristiques: ['Fraicheur', 'Naturalite', 'Energie'],
      notesCommunes: ['Lavande', 'Romarin', 'Thym', 'Sauge', 'Menthe', 'Basilic'],
      parfumsNotables: ['Pour un Homme de Caron', 'Eau Sauvage de Dior', 'Drakkar Noir de Guy Laroche'],
      icone: '🌿',
      couleur: 'bg-blue-100'
    },
    {
      id: '5',
      nom: 'Hespéridée',
      slug: 'hesperidee',
      description: 'Les parfums hesperides sont frais et petillants, ils tirent leur nom des "hesperides", qui designent les agrumes en parfumerie',
      caracteristiques: ['Fraicheur', 'Vivacite', 'Legerete'],
      notesCommunes: ['Bergamote', 'Citron', 'Orange', 'Pamplemousse', 'Mandarine', 'Lime'],
      parfumsNotables: ['Eau d\'Orange Verte d\'Hermes', 'Light Blue de Dolce & Gabbana', 'CK One de Calvin Klein'],
      icone: '🍊',
      couleur: 'bg-yellow-100'
    },
    {
      id: '6',
      nom: 'Fougère',
      slug: 'fougere',
      description: 'La famille fougere doit son nom au parfum "Fougere Royale" de Houbigant (1882). Ces parfums associent des notes lavandees, boisees et herbacees',
      caracteristiques: ['Masculinite', 'Fraicheur aromatique', 'Caractere'],
      notesCommunes: ['Lavande', 'Mousse de chene', 'Coumarine', 'Geranium', 'Bergamote', 'Fougere'],
      parfumsNotables: ['Drakkar Noir de Guy Laroche', 'Fahrenheit de Dior', 'Le Male de Jean Paul Gaultier'],
      icone: '🌿',
      couleur: 'bg-green-100'
    },
    {
      id: '7',
      nom: 'Chyprée',
      slug: 'chypree',
      description: 'La famille chypree doit son nom au parfum "Chypre" de Coty (1917). Ces parfums sont caracterises par un accord de bergamote, mousse de chene et labdanum',
      caracteristiques: ['Sophistication', 'Caractere affirme', 'Elegance intemporelle'],
      notesCommunes: ['Bergamote', 'Mousse de chene', 'Patchouli', 'Labdanum', 'Fleurs', 'Fruits'],
      parfumsNotables: ['Miss Dior de Dior', 'Mitsouko de Guerlain', 'Aromatics Elixir de Clinique'],
      icone: '🍀',
      couleur: 'bg-purple-100'
    }
  ];
};
