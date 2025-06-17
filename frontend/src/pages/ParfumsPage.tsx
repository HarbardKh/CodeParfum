import React, { useState, useEffect } from 'react';
import ParfumCard, { ParfumProps } from '../components/ParfumCard';
import styles from '../../styles/Parfums.module.css';
import Layout from '../components/layout/Layout';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getAllParfums } from '../services/parfumService';
import { motion } from 'framer-motion';
import { Parfum } from '../types/parfum';
import { ApiError } from '../services/apiService';

interface ParfumsPageProps {
  parfums: ParfumProps[];
  totalDocs: number;
  totalPages: number;
  page: number;
  error?: string;
}

// Fonction de conversion pour adapter le type Parfum au type ParfumProps
const adaptParfumsToParfumProps = (parfums: Parfum[]): ParfumProps[] => {
  return parfums.map(parfum => {
    // Traiter le cas où familleOlfactive est une chaîne de caractères
    let formattedFamilleOlfactive: { nom: string } | undefined = undefined;
    
    if (parfum.familleOlfactive) {
      if (typeof parfum.familleOlfactive === 'string') {
        formattedFamilleOlfactive = { nom: parfum.familleOlfactive };
      } else if (typeof parfum.familleOlfactive === 'object' && parfum.familleOlfactive.nom) {
        formattedFamilleOlfactive = { nom: parfum.familleOlfactive.nom };
      }
    }
    
    return {
      id: parfum.id,
      nom: parfum.nom,
      reference: parfum.reference,
      // Utiliser numeroParf s'il existe, sinon utiliser reference comme fallback
      numeroParf: parfum.numeroParf || parfum.reference,
      inspiration: parfum.inspiration,
      prix: parfum.prix,
      image: parfum.image,
      placeholderUrl: parfum.placeholderUrl,
      imagePlaceholder: parfum.imagePlaceholder,
      slug: parfum.slug,
      nouveaute: parfum.nouveaute,
      familleOlfactive: formattedFamilleOlfactive,
      // Convertir le type string en union type 'F' | 'H' | 'U'
      genre: (parfum.genre === 'Femme' || parfum.genre === 'F') ? 'F' :
             (parfum.genre === 'Homme' || parfum.genre === 'H') ? 'H' : 'U'
    };
  });
};

const ParfumsPage: React.FC<ParfumsPageProps> = ({ 
  parfums: initialParfums, 
  totalDocs, 
  totalPages, 
  page, 
  error 
}) => {
  const [parfums, setParfums] = useState(initialParfums || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiError, setApiError] = useState<string | null>(error || null);
  const [filter, setFilter] = useState({
    genre: '',
    familleOlfactive: '',
    nouveaute: false,
  });
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [totalItems, setTotalItems] = useState(totalDocs || 0);
  const [pageCount, setPageCount] = useState(totalPages || 1);
  
  // Charge les parfums filtrés
  const loadParfums = async (page = 1, filters: any = {}) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const { data, error } = await getAllParfums(page, 12, filters);
      
      if (data) {
        const adaptedParfums = adaptParfumsToParfumProps(data.docs as any);
        setParfums(adaptedParfums);
        setTotalItems(data.totalDocs);
        setPageCount(data.totalPages);
        setCurrentPage(data.page);
      } else if (error) {
        console.error('Erreur lors du chargement des parfums:', error.message);
        setApiError(error.message);
      }
    } catch (err) {
      console.error('Erreur inattendue lors du chargement des parfums:', err);
      setApiError('Une erreur inattendue est survenue lors du chargement des parfums.');
    } finally {
      setLoading(false);
    }
  };
  
  // Effet pour recharger les parfums quand les filtres ou la page changent
  useEffect(() => {
    const filters: any = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (filter.genre) {
      filters.genre = filter.genre;
    }
    
    if (filter.familleOlfactive) {
      filters.familleOlfactive = filter.familleOlfactive;
    }
    
    if (filter.nouveaute) {
      filters.nouveaute = true;
    }
    
    loadParfums(currentPage, filters);
  }, [currentPage, filter, searchTerm]);
  
  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pageCount) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  
  // Gestion de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Réinitialiser à la première page
  };
  
  // Gestion des filtres
  const handleFilterChange = (key: string, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Réinitialiser à la première page
  };
  
  return (
    <Layout title="Catalogue de Parfums | Chogan" description="Découvrez notre collection de parfums d'exception">
      <main className={styles.main}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Notre Collection de Parfums
        </motion.h1>
        
        {apiError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <ErrorAlert 
              error={apiError} 
              onRetry={() => loadParfums(currentPage, {
                ...filter,
                search: searchTerm
              })} 
            />
          </motion.div>
        )}
        
        <motion.div 
          className={styles.filtersContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Rechercher un parfum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              disabled={loading}
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={loading}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
          
          <div className={styles.filters}>
            <select
              value={filter.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className={styles.select}
              disabled={loading}
            >
              <option value="">Tous les genres</option>
              <option value="F">Femme</option>
              <option value="H">Homme</option>
              <option value="U">Unisexe</option>
            </select>
            
            <label className={`${styles.checkboxLabel} ${loading ? styles.disabled : ''}`}>
              <input
                type="checkbox"
                checked={filter.nouveaute}
                onChange={(e) => handleFilterChange('nouveaute', e.target.checked)}
                className={styles.checkbox}
                disabled={loading}
              />
              Nouveautés
            </label>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Chargement des parfums..." />
          </div>
        ) : parfums.length === 0 ? (
          <motion.div 
            className={styles.noResults}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>Aucun parfum ne correspond à votre recherche.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter({ genre: '', familleOlfactive: '', nouveaute: false });
              }}
              className={styles.resetButton}
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className={styles.resultCount}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p>{totalItems} parfum{totalItems > 1 ? 's' : ''} trouvé{totalItems > 1 ? 's' : ''}</p>
            </motion.div>
            
            <motion.div 
              className={styles.grid}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {parfums.map((parfum, index) => (
                <motion.div 
                  key={parfum.id} 
                  className={styles.cardWrapper}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                  }}
                >
                  <ParfumCard {...parfum} />
                </motion.div>
              ))}
            </motion.div>
            
            {pageCount > 1 && (
              <motion.div 
                className={styles.pagination}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className={styles.pageButton}
                >
                  Précédent
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    // Logique pour afficher les numéros de page autour de la page actuelle
                    let pageNum;
                    if (pageCount <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pageCount - 2) {
                      pageNum = pageCount - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={currentPage === pageNum || loading}
                        className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount || loading}
                  className={styles.pageButton}
                >
                  Suivant
                </button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
};

export default ParfumsPage;
