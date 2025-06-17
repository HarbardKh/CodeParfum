import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { Parfum, Variante } from '@/types/parfum';
import { ApiError } from '@/services/apiService';
import styles from '@/styles/ParfumDetail.module.css';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';

interface ParfumDetailProps {
  parfum: Parfum;
  apiSource: string;
  error?: string | null;
}

const ParfumDetailV2: React.FC<ParfumDetailProps> = ({ parfum, apiSource, error }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [selectedVariante, setSelectedVariante] = useState<Variante | undefined>(
    parfum.variantes && parfum.variantes.length > 0 
      ? parfum.variantes.find(v => v.volume === parfum.formatParDefaut) || parfum.variantes[0]
      : undefined
  );
  
  // Utiliser le contexte du panier
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity } = useCart();
  
  // Générer l'ID unique du produit (fonction réutilisable)
  const getCartItemId = () => {
    return selectedVariante 
      ? `${parfum.id}-${selectedVariante.volume.replace(/\s+/g, '-')}` 
      : parfum.id;
  };
  
  // Récupérer la quantité actuelle dans le panier
  const currentCartItemId = getCartItemId();
  const currentQuantityInCart = getItemQuantity(currentCartItemId);

  // Logs pour débogage
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ParfumDetailV2 - Données du parfum:', parfum);
      console.log('ParfumDetailV2 - Variantes disponibles:', parfum.variantes);
      console.log('ParfumDetailV2 - Variante sélectionnée:', selectedVariante);
      console.log('ParfumDetailV2 - ID panier:', currentCartItemId);
      console.log('ParfumDetailV2 - Quantité actuelle dans le panier:', currentQuantityInCart);
    }
  }, [parfum, selectedVariante, currentQuantityInCart, currentCartItemId]);

  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
  };

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    if (currentQuantityInCart > 0) return; // Ne pas ajouter si déjà présent, utiliser les boutons +/-
    
    setIsLoading(true);
    setAddToCartError(null);
    
    try {
      // Utiliser la fonction getCartItemId pour garantir la cohérence
      const cartItemId = getCartItemId();
        
      // Créer l'item pour le panier
      const cartItem = {
        id: cartItemId,
        name: `Parfum ${parfum.numeroParf || parfum.reference} ${selectedVariante ? `(${selectedVariante.volume})` : ''}`,
        price: selectedVariante ? selectedVariante.prix : parfum.prix,
        quantity: quantity,
        image: parfum.image?.url,
        imagePlaceholder: parfum.genre === 'F' ? 'feminin' : 'masculin'
      };
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Ajout au panier:', cartItem);
      }
      
      // Ajouter au panier via le contexte
      addToCart(cartItem);
      
      // Simuler le temps de traitement
      setTimeout(() => {
        setIsLoading(false);
        // Réinitialiser la quantité après ajout
        setQuantity(1);
      }, 800);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erreur lors de l\'ajout au panier:', error);
      }
      setAddToCartError('Une erreur est survenue lors de l\'ajout au panier. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  // Augmenter la quantité dans le panier
  const handleIncreaseQuantity = () => {
    // Utiliser la fonction getCartItemId pour garantir la cohérence
    const cartItemId = getCartItemId();
    updateQuantity(cartItemId, currentQuantityInCart + 1);
  };

  // Diminuer la quantité dans le panier
  const handleDecreaseQuantity = () => {
    // Utiliser la fonction getCartItemId pour garantir la cohérence
    const cartItemId = getCartItemId();
    
    // Si un seul article, on supprime complètement
    if (currentQuantityInCart === 1) {
      removeFromCart(cartItemId);
    } else {
      updateQuantity(cartItemId, currentQuantityInCart - 1);
    }
  };

  // Rendu des notes olfactives
  const renderNotes = (type: 'tete' | 'coeur' | 'fond') => {
    let notes = [];
    let icon = '';
    let title = '';

    switch (type) {
      case 'tete':
        notes = parfum.notesDepart || [];
        icon = '✨';
        title = 'Notes de tête';
        break;
      case 'coeur':
        notes = parfum.notesCoeur || [];
        icon = '❤️';
        title = 'Notes de cœur';
        break;
      case 'fond':
        notes = parfum.notesFond || [];
        icon = '💦';
        title = 'Notes de fond';
        break;
    }

    if (!notes.length) return <p>Information non disponible</p>;

    return (
      <div className="flex flex-col items-center">
        <span className="text-2xl mb-2">{icon}</span>
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <div className="space-y-2">
          {notes.map((note, index) => (
            <div key={index} className="flex items-center">
              <span className="text-burgundy mr-2">•</span>
              <span>{note.note}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Définir le genre du parfum pour l'affichage
  const getGenreText = () => {
    switch (parfum.genre) {
      case 'F':
      case 'Femme':
        return 'Femme';
      case 'H':
      case 'Homme':
        return 'Homme';
      default:
        return 'Unisexe';
    }
  };

  // Gérer le changement de variante
  const handleVarianteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const volume = e.target.value;
    const variante = parfum.variantes?.find(v => v.volume === volume);
    setSelectedVariante(variante);
  };

  // Prix actuel à afficher
  const currentPrice = selectedVariante ? selectedVariante.prix : parfum.prix;

  return (
    <Layout 
      title={`Parfum N°${parfum.numeroParf || parfum.reference} - CodeParfum.fr`} 
      description={parfum.description1 || parfum.description}
    >
      <div className={styles.container}>
        <Link href="/parfums" className={styles.backLink}>
          &larr; Retour au catalogue
        </Link>
        
        {/* Affichage des erreurs */}
        {error && (
          <ErrorAlert 
            error={error} 
            className="mb-6"
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Section principale: Image et infos principales */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Image du Parfum */}
          <motion.div 
            className="relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {parfum.image ? (
                <div className="aspect-square relative">
                  <Image
                    src={parfum.image.url}
                    alt={parfum.image.alt || parfum.nom || ''}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                  {/* Utiliser l'image appropriée en fonction du genre */}
                  <Image
                    src={
                      parfum.genre === 'F' || parfum.genre === 'Femme'
                        ? '/images/olfazetta-femme.png'
                        : '/images/olfazetta-homme.png' // Même image pour homme et unisexe
                    }
                    alt={`Parfum ${parfum.numeroParf || parfum.reference || ''} - ${getGenreText()}`}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Informations essentielles du Parfum */}
          <motion.div 
            className={styles.productInfoColumn}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Section promo */}
            <div className={styles.promoBox}>
              <span className={styles.promoIcon}>★</span>
              <p>Pour chaque parfum de 70 ml acheté, vous recevez gratuitement une recharge de parfum de 15 ml de la même fragrance.</p>
            </div>

            <div className={styles.productHeader}>
              <h1 className={styles.productName}>Parfum {parfum.numeroParf || parfum.reference}</h1>
              
              <div className={styles.productMeta}>
                <span className={styles.reference}>Série Exclusive N°{parfum.numeroParf || parfum.reference}</span>
                <div className={styles.categoryInfo}>
                  <span className={styles.genre}>{getGenreText()}</span>
                  {typeof parfum.familleOlfactive !== 'string' && parfum.familleOlfactive?.nom && (
                    <span className={styles.famille}>{parfum.familleOlfactive.nom}</span>
                  )}
                  {typeof parfum.familleOlfactive === 'string' && (
                    <span className={styles.famille}>{parfum.familleOlfactive}</span>
                  )}
                </div>
              </div>

              {/* Bannière mode démo */}
              {apiSource === 'demo' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Mode démonstration</strong>
                  <span className="block sm:inline"> - Données de démo utilisées.</span>
                </div>
              )}

              <div className={styles.productPriceContainer}>
                <div className={styles.productPrice}>
                  {currentPrice.toFixed(2)} € <small>TVA incluse</small>
                </div>
                {selectedVariante && (
                  <div className={styles.reference}>
                    Ref: {selectedVariante.ref}
                  </div>
                )}
              </div>
            </div>
              
            {/* Sélecteur de variantes si disponible */}
            {parfum.variantes && parfum.variantes.length > 0 && (
              <div className="mt-6 mb-6">
                <h2 className={styles.sectionTitle}>Choisir le format</h2>
                <div className="relative mt-4">
                  <select
                    value={selectedVariante?.volume || ''}
                    onChange={handleVarianteChange}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-md shadow leading-tight focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                  >
                    {parfum.variantes.map((variante, index) => (
                      <option key={`variante-${variante.volume}-${index}`} value={variante.volume}>
                        {variante.volume} - {variante.prix.toFixed(2)} €
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Erreur d'ajout au panier */}
            {addToCartError && (
              <ErrorAlert 
                error={addToCartError} 
                className="mb-4"
                onRetry={handleAddToCart}
              />
            )}

            {/* Bouton d'ajout au panier dynamique */}
            <AnimatePresence mode="wait">
              {currentQuantityInCart === 0 ? (
                /* Bouton classique quand pas d'article dans le panier */
                <motion.button 
                  key="add-to-cart"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleAddToCart}
                  disabled={isLoading || (parfum.enStock === false)}
                  className={styles.buyButton}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </>
                  ) : parfum.enStock === false ? 'Indisponible' : 'Ajouter au panier'}
                </motion.button>
              ) : (
                /* Compteur avec boutons + et - ou corbeille quand articles dans le panier */
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-white border-2 border-black rounded-md overflow-hidden"
                >
                  {/* Bouton - ou corbeille selon quantité */}
                  <motion.button 
                    onClick={handleDecreaseQuantity}
                    className="py-3 px-4 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentQuantityInCart === 1 ? (
                      /* Icône corbeille quand un seul article */
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ) : (
                      /* Icône moins quand plusieurs articles */
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                  </motion.button>
                  
                  {/* Affichage de la quantité */}
                  <span className="text-lg font-bold py-3 px-6">
                    {currentQuantityInCart}
                  </span>
                  
                  {/* Bouton + */}
                  <motion.button 
                    onClick={handleIncreaseQuantity}
                    className="py-3 px-4 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div 
          className="mb-10"
          variants={descriptionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.productDescription}>
            {parfum.description1 || "Un parfum d'exception aux notes raffinées, élaboré pour séduire et laisser une impression mémorable. Sa composition unique saura vous accompagner tout au long de la journée."}
          </p>
          
          {/* Informations additionnelles */}
          <div className={styles.additionalInfo + " mt-6"}>
            {(selectedVariante?.volume || parfum.volume) && (
              <div className={styles.infoItem}>
                <h4>Volume</h4>
                <p>{selectedVariante?.volume || parfum.volume}</p>
              </div>
            )}
            
            {parfum.intensite && (
              <div className={styles.infoItem}>
                <h4>Intensité</h4>
                <p>{parfum.intensite}</p>
              </div>
            )}
            
            {parfum.occasion && (
              <div className={styles.infoItem}>
                <h4>Occasions</h4>
                <p>{parfum.occasion}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Notes Olfactives */}
        <div className={styles.fullWidthSection}>
          <h2 className={styles.sectionTitle}>Pyramide Olfactive</h2>
          <div className={styles.notesCards}>
            <div className={styles.noteCard}>
              {renderNotes('tete')}
            </div>

            <div className={styles.noteCard}>
              {renderNotes('coeur')}
            </div>

            <div className={styles.noteCard}>
              {renderNotes('fond')}
            </div>
          </div>
        </div>

        {/* À propos du parfum */}
        <div className={styles.fullWidthSection}>
          <h2 className={styles.sectionTitle}>À propos de ce parfum</h2>
          <div className={styles.aboutContent}>
            <div>
              <p>
                {parfum.aPropos || 
                  `Ce parfum de la série exclusive N°${parfum.numeroParf || parfum.reference} vous offre une expérience sensorielle unique. 
                  Sa formulation exclusive combine des ingrédients de haute qualité pour créer une fragrance inoubliable qui vous accompagnera tout au long de la journée.`}
              </p>
            </div>
            <div className={styles.placeholderImage}></div>
          </div>
        </div>

        {/* Conseils d'utilisation */}
        <div className={styles.fullWidthSection}>
          <h2 className={styles.sectionTitle}>Conseils & Expertise</h2>
          <div className={styles.expertiseContent}>
            <div className={styles.placeholderImage}></div>
            <div className={styles.expertiseText}>
              <p>
                {parfum.conseil || parfum.ConseilExpertise || 
                  `Pour une expérience parfumée optimale, appliquez le parfum N°${parfum.numeroParf || parfum.reference} sur les points de pulsation : 
                  poignets, cou et derrière les oreilles. Ces zones plus chaudes du corps favorisent la diffusion du parfum tout au long de la journée, 
                  révélant progressivement toutes les notes de la fragrance.`}
              </p>
              <button className={styles.guideButton}>
                <span>Découvrir nos guides</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParfumDetailV2;
