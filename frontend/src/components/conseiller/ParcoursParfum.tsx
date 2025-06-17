import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ParcoursParfumProps {
  onBack: () => void;
  onComplete: (marque: string, parfum: string) => void;
}

// Base de données simplifiée des parfums disponibles (sera connectée au backend plus tard)
const parfumsDisponibles = {
  "Dior": [
    "Sauvage",
    "Miss Dior",
    "J'adore",
    "Dior Homme",
    "Poison"
  ],
  "Chanel": [
    "Coco Mademoiselle",
    "Bleu de Chanel",
    "Chance",
    "N°5",
    "Allure"
  ],
  "Versace": [
    "Dylan Blue",
    "Eros",
    "Bright Crystal",
    "Pour Homme"
  ],
  "Armani": [
    "Acqua di Gio",
    "Si",
    "Code",
    "Stronger With You"
  ],
  "Tom Ford": [
    "Black Orchid",
    "Oud Wood",
    "Tobacco Vanille",
    "Lost Cherry"
  ],
  "Yves Saint Laurent": [
    "Black Opium",
    "Y",
    "Libre",
    "La Nuit de L'Homme"
  ]
};

const ParcoursParfum: React.FC<ParcoursParfumProps> = ({ onBack, onComplete }) => {
  const [marqueSelectionnee, setMarqueSelectionnee] = useState<string>('');
  const [parfumSelectionne, setParfumSelectionne] = useState<string>('');

  const handleMarqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMarqueSelectionnee(e.target.value);
    setParfumSelectionne(''); // Reset parfum quand on change de marque
  };

  const handleParfumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParfumSelectionne(e.target.value);
  };

  const handleSubmit = () => {
    if (marqueSelectionnee && parfumSelectionne) {
      onComplete(marqueSelectionnee, parfumSelectionne);
    }
  };

  const parfumsDisponiblesPourMarque = marqueSelectionnee ? parfumsDisponibles[marqueSelectionnee as keyof typeof parfumsDisponibles] || [] : [];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">
            Quel parfum aimez-vous ?
          </h2>
          <p className="text-lg text-gray-600">
            Sélectionnez la marque puis le parfum que vous appréciez pour que nous puissions vous proposer des créations similaires.
          </p>
        </div>

        {/* Formulaire de sélection */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100">
          <div className="space-y-6">
            {/* Sélection de la marque */}
            <div>
              <label htmlFor="marque" className="block text-lg font-medium text-primary-800 mb-3">
                1. Choisissez la marque
              </label>
              <select
                id="marque"
                value={marqueSelectionnee}
                onChange={handleMarqueChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              >
                <option value="">-- Sélectionnez une marque --</option>
                {Object.keys(parfumsDisponibles).map(marque => (
                  <option key={marque} value={marque}>{marque}</option>
                ))}
              </select>
            </div>

            {/* Sélection du parfum */}
            <div className={`transition-all duration-300 ${marqueSelectionnee ? 'opacity-100' : 'opacity-50'}`}>
              <label htmlFor="parfum" className="block text-lg font-medium text-primary-800 mb-3">
                2. Choisissez le parfum
              </label>
              <select
                id="parfum"
                value={parfumSelectionne}
                onChange={handleParfumChange}
                disabled={!marqueSelectionnee}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Sélectionnez un parfum --</option>
                {parfumsDisponiblesPourMarque.map(parfum => (
                  <option key={parfum} value={parfum}>{parfum}</option>
                ))}
              </select>
            </div>

            {/* Message informatif */}
            {marqueSelectionnee && parfumSelectionne && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-primary-50 border border-primary-200 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-primary-800 font-medium">Parfait !</h4>
                    <p className="text-primary-700 text-sm mt-1">
                      Nous allons vous proposer des créations de notre catalogue qui partagent les mêmes accords olfactifs que <strong>{parfumSelectionne}</strong> de <strong>{marqueSelectionnee}</strong>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>

          <button
            onClick={handleSubmit}
            disabled={!marqueSelectionnee || !parfumSelectionne}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Voir mes recommandations
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Note en bas */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            💡 Votre parfum n'est pas dans la liste ? <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">Contactez-nous</Link> pour que nous l'ajoutions !
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ParcoursParfum; 