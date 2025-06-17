import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import styles from '../../styles/Parfums.module.css';
import Layout from '../../src/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchData } from '@/services/apiService';

// Interface pour les parfums
interface ParfumProps {
  id: string;
  numeroParf?: string;
  reference?: string;
  prix?: number;
  genre: 'F' | 'H' | 'U';
  image?: {
    url: string;
    alt: string;
  };
  famille?: string;
  familleOlfactive?: {
    nom: string;
  };
  nouveaute?: boolean;
}

interface ParfumsPageProps {
  parfums: ParfumProps[];
  pagination: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  error?: string;
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

export default function ParfumsPage({ parfums, pagination, error }: ParfumsPageProps) {
  const router = useRouter();
  
  // États simplifiés - la plupart de la logique de chargement/filtrage est maintenant dans getServerSideProps
  const [searchTerm, setSearchTerm] = useState((router.query.q as string) || '');
  const [genreFilter, setGenreFilter] = useState((router.query.genre as string) || '');
  const [nouveauteFilter, setNouveauteFilter] = useState(router.query.nouveaute === 'true');

  // Stats calculées à partir des données de pagination ou des filtres actuels
  // Pour l'instant, nous n'avons plus les stats globales facilement. 
  // Cela pourrait être recalculé ou récupéré autrement si nécessaire.
  const [stats, setStats] = useState({ total: pagination?.totalDocs || 0, homme: 0, femme: 0 });

  useEffect(() => {
    // Mettre à jour les filtres locaux si l'URL change (ex: navigation navigateur)
    if (router.isReady) {
      setSearchTerm((router.query.q as string) || '');
      setGenreFilter((router.query.genre as string) || '');
      setNouveauteFilter(router.query.nouveaute === 'true');
    }
  }, [router.query, router.isReady]);
  
  const handleFilterChange = () => {
    const query: any = {};
    if (genreFilter) query.genre = genreFilter;
    if (searchTerm) query.q = searchTerm;
    if (nouveauteFilter) query.nouveaute = 'true';
    // La page sera réinitialisée à 1 lors d'un changement de filtre
    router.push({ pathname: '/parfums', query });
  };

  // Appeler handleFilterChange lorsque les filtres changent
  // Debounce ou délai pourrait être ajouté ici pour la recherche
  useEffect(() => {
    if (!router.isReady) return;
    
    const queryGenre = (router.query.genre as string) || '';
    const querySearch = (router.query.q as string) || '';
    const queryNouveaute = router.query.nouveaute === 'true';
  
    // Si les filtres locaux sont différents de ceux de l'URL, on met à jour l'URL
    if (genreFilter !== queryGenre || searchTerm !== querySearch || nouveauteFilter !== queryNouveaute) {
      const timer = setTimeout(() => {
        handleFilterChange();
      }, 500); // Délai de 500ms
      return () => clearTimeout(timer);
    }
  }, [searchTerm, genreFilter, nouveauteFilter, router.isReady, router.query]);
  
  // Fonction pour générer l'image du parfum
  const getParfumImage = (parfum: ParfumProps) => {
    if (parfum.image && parfum.image.url) {
      return parfum.image.url;
    }
    
    // Image par défaut basée sur le genre
    return parfum.genre === 'F' 
      ? '/images/olfazetta-femme.png' 
      : '/images/olfazetta-homme.png';
  };

  // Fonction pour générer l'URL de la page de détail du parfum
  const getParfumUrl = (parfum: ParfumProps) => {
    // Format standardisé pour le slug: ref-XXX (où XXX est le numéro du parfum)
    return `/parfums/ref-${parfum.numeroParf || parfum.reference || parfum.id}`;
  };
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Erreur</h1>
        <p>{error}</p>
        <button onClick={() => router.reload()}>Réessayer</button>
      </div>
    );
  }
  
  return (
    <Layout title="Catalogue de Parfums | CodeParfum.fr" description="Découvrez notre collection de parfums d'exception">
      <main className={styles.main}>
        <h1 className={`${styles.title} font-serif`}>Notre Collection de Parfums</h1>
        
        {/* Filtres et recherche - responsive */}
        <div className="sticky top-16 z-30 bg-white shadow-md mb-6 pb-2 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-3 px-4 sm:px-0 pb-2">
            <div className="w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Rechercher un parfum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C7A13E] focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setGenreFilter(''); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${genreFilter === '' ? 'bg-[#C7A13E] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Tous {pagination && `(${pagination.totalDocs})`}
              </button>
              <button 
                onClick={() => { setGenreFilter('H'); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${genreFilter === 'H' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Homme
              </button>
              <button 
                onClick={() => { setGenreFilter('F'); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${genreFilter === 'F' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Femme
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-sm font-medium hover:bg-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nouveauteFilter}
                  onChange={(e) => setNouveauteFilter(e.target.checked)}
                  className="h-4 w-4 text-[#C7A13E] rounded"
                />
                <span>Nouveautés</span>
              </label>
            </div>
          </div>
        </div>
        
        {parfums.length === 0 && !error ? (
          <div className={styles.noResults}>
            <p>Aucun parfum ne correspond à votre recherche.</p>
            <button 
              onClick={() => router.push('/parfums')}
              className={styles.resetButton}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center md:text-left px-4 sm:px-0">
              <p className="text-sm text-gray-600">{pagination.totalDocs} parfum{pagination.totalDocs > 1 ? 's' : ''} trouvé{pagination.totalDocs > 1 ? 's' : ''} - Page {pagination.page}/{pagination.totalPages}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-2 sm:px-0">
              {parfums.map((parfum) => (
                <Link href={getParfumUrl(parfum)} key={parfum.id} className="block transition-transform hover:scale-105 duration-200">
                  <div className="h-full border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative w-full pb-[100%] overflow-hidden bg-gray-50">
                      <img 
                        src={getParfumImage(parfum)} 
                        alt={`Parfum ${parfum.numeroParf || parfum.reference || ''}`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      {parfum.nouveaute && (
                        <span className="absolute top-2 right-2 bg-[#C7A13E] text-white text-xs font-bold px-2 py-1 rounded">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                        N°{parfum.numeroParf || parfum.reference || 'N/A'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${parfum.genre === 'F' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                          {parfum.genre === 'F' ? 'Femme' : parfum.genre === 'H' ? 'Homme' : 'Unisexe'}
                        </span>
                        {parfum.familleOlfactive && (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{parfum.familleOlfactive.nom}</span>
                        )}
                      </div>
                      <p className="text-[#C7A13E] font-bold text-right">{parfum.prix ? `${parfum.prix.toFixed(2)} €` : 'Prix non disponible'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-8 mb-12 px-4 sm:px-0">
                <div className="flex justify-center items-center gap-2">
                  {/* Boutons numérotés de pagination - cachés sur mobile */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      // Afficher 2 pages avant et 2 pages après la page actuelle
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 2) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 1) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Link
                          key={pageNum}
                          href={{ pathname: '/parfums', query: { ...router.query, page: pageNum } }}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${pageNum === pagination.page ? 'bg-[#C7A13E] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Indicateur de page mobile */}
                  <span className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md">
                    Page {pagination.page} sur {pagination.totalPages}
                  </span>
                </div>
                
                {/* Boutons précédent/suivant */}
                <div className="flex items-center space-x-2">
                  {pagination.hasPrevPage && (
                    <Link 
                      href={{ pathname: '/parfums', query: { ...router.query, page: pagination.page - 1 } }} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Précédent
                    </Link>
                  )}

                  {pagination.hasNextPage && (
                    <Link 
                      href={{ pathname: '/parfums', query: { ...router.query, page: pagination.page + 1 } }} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                    >
                      Suivant
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentPage = parseInt(context.query.page as string) || 1;
  const genre = context.query.genre as string || '';
  const searchTerm = context.query.q as string || '';
  const nouveaute = context.query.nouveaute === 'true';

  try {
    const apiUrls = [
      process.env.NEXT_PUBLIC_API_URL,
      'http://localhost:3002',
      'http://127.0.0.1:3002',
    ].filter(Boolean);
    
    for (const apiUrl of apiUrls) {
      try {
        const apiParams: any = {
          limit: 12,
          page: currentPage,
          sort: 'numeroParf',
          depth: 1, // Pour peupler familleOlfactive
        };

        // Construction de la clause 'where' pour PayloadCMS
        const whereClauses: any[] = [];
        if (genre) {
          whereClauses.push({ genre: { equals: genre } });
        }
        if (nouveaute) {
          whereClauses.push({ nouveaute: { equals: true } });
        }
        if (searchTerm) {
          whereClauses.push({
            or: [
              { numeroParf: { like: searchTerm } },
              { reference: { like: searchTerm } },
              // Ajouter d'autres champs pour la recherche si nécessaire (ex: nom inspiration, famille)
            ],
          });
        }
        if (whereClauses.length > 0) {
          apiParams.where = { and: whereClauses };
        }
        
        const { data, error } = await fetchData<PaginatedResponse<ParfumProps>>(
          '/api/parfums',
          {
            params: apiParams,
            timeout: 5000, // Augmentation du timeout
            baseURL: apiUrl,
          }
        );
        
        if (error) {
          console.warn(`Erreur API (${apiUrl}): ${error.message}`);
          continue;
        }
        
        if (data?.docs) {
          return {
            props: {
              parfums: data.docs,
              pagination: {
                totalDocs: data.totalDocs,
                limit: data.limit,
                totalPages: data.totalPages,
                page: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
              },
            },
          };
        }
      } catch (err: any) {
        console.warn(`Échec de connexion à l'API (${apiUrl}): ${err.message}`);
        }
      }
    
    return {
      props: {
        parfums: [],
        pagination: { totalDocs: 0, limit: 12, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false },
        error: "Impossible de charger les parfums. Veuillez réessayer.",
      },
    };
    
  } catch (error: any) {
    console.error('Erreur globale dans getServerSideProps:', error.message);
    return {
      props: {
        parfums: [],
        pagination: { totalDocs: 0, limit: 12, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false },
        error: "Une erreur critique est survenue.",
      },
    };
  }
};
