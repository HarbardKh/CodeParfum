import React from 'react';
import { UserResponses } from '@/types/conseil';

interface FinaliserProfilProps {
  userResponses: UserResponses;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  prevStep: () => void;
  loading: boolean;
}

const FinaliserProfil: React.FC<FinaliserProfilProps> = ({
  userResponses,
  handleInputChange,
  handleRadioChange,
  handleCheckboxChange,
  handleSubmit,
  prevStep,
  loading
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-semibold text-primary-800">Finaliser votre consultation personnalisée</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
        <p className="text-gray-600 mb-6">Pour recevoir vos recommandations personnalisées, veuillez compléter les informations suivantes :</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Votre adresse email <span className="text-red-600">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="votre.email@exemple.com"
              value={userResponses.email}
              onChange={handleInputChange}
            />
            <p className="mt-1 text-xs text-gray-500">Nous utiliserons cette adresse pour vous envoyer vos recommandations personnalisées.</p>
          </div>

          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Votre prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Prénom"
              value={userResponses.prenom}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre <span className="text-red-600">*</span></label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="genre-femme"
                  name="genre"
                  type="radio"
                  value="Femme"
                  checked={userResponses.genre === 'Femme'}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="genre-femme" className="ml-3 block text-sm font-medium text-gray-700">Femme</label>
              </div>
              <div className="flex items-center">
                <input
                  id="genre-homme"
                  name="genre"
                  type="radio"
                  value="Homme"
                  checked={userResponses.genre === 'Homme'}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="genre-homme" className="ml-3 block text-sm font-medium text-gray-700">Homme</label>
              </div>
              <div className="flex items-center">
                <input
                  id="genre-mixte"
                  name="genre"
                  type="radio"
                  value="Mixte"
                  checked={userResponses.genre === 'Mixte' || !userResponses.genre}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="genre-mixte" className="ml-3 block text-sm font-medium text-gray-700">Peu importe / Mixte</label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentement"
                  name="consentement"
                  type="checkbox"
                  checked={userResponses.consentement}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consentement" className="font-medium text-gray-700">
                  J'accepte de recevoir des recommandations personnalisées <span className="text-red-600">*</span>
                </label>
                <p className="text-gray-500">Nous respectons votre vie privée et ne partageons jamais vos données avec des tiers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la question précédente
        </button>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || !userResponses.email || !userResponses.consentement}
          className={`inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white 
            ${loading || !userResponses.email || !userResponses.consentement ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-700 hover:bg-primary-800'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </>
          ) : (
            <>
              Recevoir mes recommandations
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FinaliserProfil; 