import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ParfumRecommande, RecommandationsResponse, ConseillerService } from '../../services/conseiller';

interface ResultatsScoringProps {
  resultats: RecommandationsResponse;
  reponses: {
    famillesOlfactives: string[];
    notesAimees: string[];
    notesDetestees: string[];
    genre: string;
  };
  onRetour: () => void;
  onRecommencer: () => void;
}

const ResultatsScoring: React.FC<ResultatsScoringProps> = ({ 
  resultats, 
  reponses, 
  onRetour, 
  onRecommencer 
}) => {
  const [parfumSelectionne, setParfumSelectionne] = useState<ParfumRecommande | null>(null);
  const [vueDetails, setVueDetails] = useState(false);

  const { recommendations } = resultats.data;

  // Tri des recommandations par score décroissant et limitation aux 5 meilleurs
  const topParfums = [...recommendations]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Fonction pour générer l'URL de la fiche produit
  const genererUrlProduit = (parfum: any) => {
    return `/parfums/ref-${parfum.numeroParf}`;
  };

  // Fonction pour obtenir l'image du parfum
  const obtenirImageParfum = (parfum: any) => {
    // Image par défaut basée sur le genre
    return parfum.genre === 'F' 
      ? '/images/olfazetta-femme.png' 
      : '/images/olfazetta-homme.png';
  };

  // Fonction pour générer le texte explicatif personnalisé
  const genererTexteExplicatif = () => {
    const genreTexte = ConseillerService.mapperGenre(reponses.genre);
    
    let texte = `En tenant compte des familles et notes olfactives que vous avez sélectionnées`;
    
    texte += `, nous vous recommandons ces parfums qui s'accordent parfaitement avec votre recherche d'un parfum ${genreTexte.toLowerCase()}`;
    
    texte += `, vous offrant une expérience olfactive sur mesure.`;
    
    return texte;
  };

  const afficherDetailsParfum = (parfum: ParfumRecommande) => {
    setParfumSelectionne(parfum);
    setVueDetails(true);
  };

  const masquerDetails = () => {
    setVueDetails(false);
    setParfumSelectionne(null);
  };

  const renderCarteParfum = (item: ParfumRecommande, index: number) => {
    const urlProduit = genererUrlProduit(item.parfum);
    const imageParfum = obtenirImageParfum(item.parfum);
    
    return (
      <motion.div
        key={item.parfum.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.15 }}
        className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
      >
        {/* Badge de position */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            #{index + 1}
          </div>
        </div>

        {/* Image du parfum */}
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img 
            src={imageParfum}
            alt={`Chogan ${item.parfum.numeroParf}`}
            className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Contenu principal */}
        <div className="p-8 flex flex-col flex-grow">
          {/* En-tête avec numéro Chogan */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              Chogan {item.parfum.numeroParf}
            </h3>
            <div className="flex items-center justify-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {item.parfum.genre === 'F' ? '👩 Femme' : item.parfum.genre === 'H' ? '👨 Homme' : '👥 Mixte'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 font-medium">
                {item.parfum.famillePrincipale}
              </span>
            </div>
          </div>

          {/* Description du parfum */}
          <div className="mb-6 flex-grow">
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              {item.parfum.description1 && item.parfum.description1.trim() !== "" 
                ? item.parfum.description1 
                : "Une création olfactive raffinée qui saura vous séduire par sa composition unique et son caractère distinctif."}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3 mt-auto">
            <Link href={urlProduit} className="block">
              <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center cursor-pointer">
                🛍️ Voir la fiche produit
              </div>
            </Link>
            <button 
              onClick={() => afficherDetailsParfum(item)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-300"
            >
              📋 Plus de détails
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderDetailsParfum = () => {
    if (!parfumSelectionne) return null;

    const urlProduit = genererUrlProduit(parfumSelectionne.parfum);
    const imageParfum = obtenirImageParfum(parfumSelectionne.parfum);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={masquerDetails}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* En-tête avec image */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 text-center">
              <button 
                onClick={masquerDetails}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light"
                title="Fermer"
              >
                ×
              </button>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                  <img 
                    src={imageParfum}
                    alt={`Chogan ${parfumSelectionne.parfum.numeroParf}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 text-left">
                  <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                    Chogan {parfumSelectionne.parfum.numeroParf}
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                      {parfumSelectionne.parfum.genre === 'F' ? '👩 Femme' : parfumSelectionne.parfum.genre === 'H' ? '👨 Homme' : '👥 Mixte'}
                    </span>
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                      {parfumSelectionne.parfum.intensite}
                    </span>
                    <span className="bg-primary-200 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                      {parfumSelectionne.parfum.famillePrincipale}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg italic leading-relaxed">
                    "{parfumSelectionne.parfum.description1 && parfumSelectionne.parfum.description1.trim() !== "" 
                      ? parfumSelectionne.parfum.description1 
                      : "Une création olfactive raffinée qui saura vous séduire par sa composition unique et son caractère distinctif."}"
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu détaillé */}
            <div className="p-8 space-y-8">
              {/* Pyramide olfactive */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">🌸 Composition olfactive</h3>
                <div className="grid gap-4">
                  {parfumSelectionne.parfum.noteTete && (
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">✨</span>
                        <h4 className="font-semibold text-yellow-800">Première impression</h4>
                      </div>
                      <p className="text-yellow-700 leading-relaxed">{parfumSelectionne.parfum.noteTete}</p>
                    </div>
                  )}
                  {parfumSelectionne.parfum.noteCoeur && (
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">💖</span>
                        <h4 className="font-semibold text-pink-800">Cœur du parfum</h4>
                      </div>
                      <p className="text-pink-700 leading-relaxed">{parfumSelectionne.parfum.noteCoeur}</p>
                    </div>
                  )}
                  {parfumSelectionne.parfum.noteFond && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">🌙</span>
                        <h4 className="font-semibold text-purple-800">Sillage durable</h4>
                      </div>
                      <p className="text-purple-700 leading-relaxed">{parfumSelectionne.parfum.noteFond}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={urlProduit} className="flex-1">
                  <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center cursor-pointer">
                    🛍️ Voir la fiche produit complète
                  </div>
                </Link>
                <button
                  onClick={masquerDetails}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-8 rounded-2xl font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Continuer ma sélection
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* En-tête premium */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <h1 className="text-4xl font-serif font-bold mb-4">
            ✨ Vos parfums sélectionnés
          </h1>
          <p className="text-xl text-primary-100">
            Nos {topParfums.length} créations les plus adaptées à votre personnalité
          </p>
        </motion.div>
      </div>

      {/* Texte explicatif personnalisé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Pourquoi ces parfums vous correspondent
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {genererTexteExplicatif()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grille des parfums recommandés */}
      {topParfums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topParfums.map((item, index) => renderCarteParfum(item, index))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-3xl"
        >
          <div className="text-8xl mb-6">🌸</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Affinez votre recherche
          </h3>
          <p className="text-gray-600 text-lg">
            Explorons ensemble d'autres familles olfactives pour trouver votre parfum idéal
          </p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {vueDetails && renderDetailsParfum()}
      </AnimatePresence>
    </div>
  );
};

export default ResultatsScoring;