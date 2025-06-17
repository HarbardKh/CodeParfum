import React from 'react';
import { motion } from 'framer-motion';

interface ChoixParcoursProps {
  onSelectParcours: (parcours: 'parfum' | 'gouts') => void;
}

const ChoixParcours: React.FC<ChoixParcoursProps> = ({ onSelectParcours }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">
          Comment souhaitez-vous être conseillé ?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choisissez la méthode qui vous convient le mieux pour découvrir votre parfum idéal.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Parcours 1 : Basé sur parfum préféré */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="group cursor-pointer"
          onClick={() => onSelectParcours('parfum')}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                <span className="text-4xl">💎</span>
              </div>
              <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
                Je connais déjà un parfum que j'aime
              </h3>
              <p className="text-gray-600 mb-6">
                Vous avez un parfum coup de cœur ? Dites-nous lequel et nous vous proposerons des créations similaires de notre catalogue.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-8">
                <li>✓ Sélection par marque et nom de parfum</li>
                <li>✓ Correspondances personnalisées</li>
                <li>✓ Descriptions olfactives détaillées</li>
                <li>✓ Résultat immédiat</li>
              </ul>
              <div className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium group-hover:bg-primary-700 transition-colors">
                Choisir ce parcours
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Parcours 2 : Basé sur les goûts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="group cursor-pointer"
          onClick={() => onSelectParcours('gouts')}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-amber-200 group-hover:to-amber-300 transition-colors">
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
                Je veux découvrir selon mes goûts
              </h3>
              <p className="text-gray-600 mb-6">
                Répondez à quelques questions sur vos préférences olfactives et nous vous suggérerons des parfums parfaitement adaptés.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-8">
                <li>✓ Questionnaire personnalisé</li>
                <li>✓ Analyse de vos goûts</li>
                <li>✓ Recommandations multiples</li>
                <li>✓ Conseils d'expert</li>
              </ul>
              <div className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-medium group-hover:bg-amber-700 transition-colors">
                Commencer le questionnaire
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-12"
      >
        <p className="text-gray-500 text-sm">
          💡 Astuce : Les deux méthodes sont complémentaires. Vous pourrez essayer l'autre approche à tout moment.
        </p>
      </motion.div>
    </div>
  );
};

export default ChoixParcours; 