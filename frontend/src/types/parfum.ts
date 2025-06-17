// Types pour les parfums
export interface Note {
  note: string;
}

export interface FamilleOlfactive {
  id: string;
  nom: string;
  description?: string;
}

export interface ImageType {
  url: string;
  alt: string;
}

export interface NotesOlfactives {
  tete?: Note[];
  coeur?: Note[];
  fond?: Note[];
}

export interface Variante {
  volume: string;
  prix: number;
  ref: string;
}

export interface Parfum {
  id: string;
  nom: string;
  reference: string;
  numeroParf?: string;
  inspiration?: string;
  description: string;
  description1?: string;
  genre: string;
  prix: number;
  prixAncien?: number;
  enStock?: boolean;
  volume?: string;
  nouveaute?: boolean;
  intensite?: string;
  occasion?: string;
  image?: ImageType;
  placeholderUrl?: string;
  imagePlaceholder?: 'feminin' | 'masculin' | 'unisexe';
  familleOlfactive?: FamilleOlfactive | string;
  notesDepart?: Note[];
  notesCoeur?: Note[];
  notesFond?: Note[];
  notesOlfactives?: NotesOlfactives;
  noteTete?: string;
  noteCoeur?: string;
  noteFond?: string;
  aPropos?: string;
  conseil?: string;
  ConseilExpertise?: string;
  popularite?: number;
  stock?: number;
  slug: string;
  bestSeller?: boolean;
  variantes?: Variante[];
  formatParDefaut?: string;
  createdAt?: string;
  updatedAt?: string;
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
