// Types pour les produits de parfumerie
export interface ProductImage {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

export interface FragranceNote {
  name: string;
  type: 'top' | 'middle' | 'base';
}

export interface Product {
  // Identifiants et informations de base
  id: string;
  name: string;
  slug: string;
  reference?: string;  // Numéro de référence du produit
  numeroParf?: string; // Autre identifiant possible utilisé dans le backend
  gender?: 'H' | 'F' | string; // Genre du parfum (Homme ou Femme)
  nom?: string; // Nom du parfum (utilisé dans getStaticProps)
  
  // Description et présentation
  description?: string;
  shortDescription?: string;
  a_propos?: string; // À propos du parfum, informations détaillées
  conseil?: string; // Conseils d'utilisation
  famille_olfactive?: string; // Famille olfactive du parfum
  famille_principale?: string; // Famille principale (classification olfactive)
  famille_secondaire?: string; // Famille secondaire (classification olfactive)
  intensite?: string; // Intensité du parfum
  volume?: string; // Volume/taille du produit
  
  // Tarification
  price: number;
  comparePrice?: number;
  
  // Médias
  images?: ProductImage[];
  mainImage?: ProductImage;
  
  // Catégorisation
  brand?: ProductBrand;
  categories?: ProductCategory[];
  variants?: ProductVariant[];
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[]; // Tags associés au produit
  
  // Caractéristiques olfactives
  fragrance?: {
    family?: string;
    intensity?: string;
    notes?: FragranceNote[];
    pyramid?: {
      head?: string[];
      heart?: string[];
      base?: string[];
    };
  };
  
  // Pyramide olfactive - supporte plusieurs formats
  pyramideOlfactive?: {
    notesDeTete?: string[];
    notesDeCoeur?: string[];
    notesDeFond?: string[];
    head?: string[]; // Pour compatibilité avec les deux notations
    heart?: string[];
    base?: string[];
  };
  
  // Attributs pour le système de recommandation
  confiance?: string | number; // Peut être une chaîne ('Très élevée') ou un nombre (0-100)
  occasion?: string | string[]; // Peut être une chaîne unique ou un tableau
  
  // Métadonnées temporelles
  createdAt?: string;
  updatedAt?: string;
  
  // Propriétés utilisées dans le backend
  prix?: number; // Prix utilisé dans getStaticProps
  genre?: string; // Genre utilisé dans getStaticProps
  familleOlfactive?: any; // Utilisé dans getStaticProps
  notesDepart?: any[]; // Utilisé dans getStaticProps
  notesCoeur?: any[]; // Utilisé dans getStaticProps
  notesFond?: any[]; // Utilisé dans getStaticProps
  aPropos?: string; // Utilisé dans getStaticProps
}
