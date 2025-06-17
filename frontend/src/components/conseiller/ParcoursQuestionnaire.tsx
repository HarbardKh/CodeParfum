import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParcoursQuestionnaireProps {
  onBack: () => void;
  onComplete: (reponses: QuestionnaireReponses) => void;
}

export interface QuestionnaireReponses {
  famillesOlfactives: string[];
  notesAimees: string[];
  notesDetestees: string[];
  occasion: string;
  genre: string;
}

const ParcoursQuestionnaire: React.FC<ParcoursQuestionnaireProps> = ({ onBack, onComplete }) => {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [reponses, setReponses] = useState<QuestionnaireReponses>({
    famillesOlfactives: [],
    notesAimees: [],
    notesDetestees: [],
    occasion: '',
    genre: ''
  });

  const famillesOlfactives = [
    { id: 'floral', nom: 'Floral', description: 'Rose, jasmin, pivoine...' },
    { id: 'oriental', nom: 'Oriental', description: 'Vanille, ambre, épices...' },
    { id: 'boise', nom: 'Boisé', description: 'Cèdre, santal, oud...' },
    { id: 'fruite', nom: 'Fruité', description: 'Pomme, pêche, fruits rouges...' },
    { id: 'frais', nom: 'Frais', description: 'Citron, menthe, marine...' },
    { id: 'epicé', nom: 'Épicé', description: 'Poivre, cannelle, gingembre...' }
  ];

  const notesOlfactives = {
    floral: ['Rose', 'Jasmin', 'Pivoine', 'Muguet', 'Gardénia', 'Iris'],
    oriental: ['Vanille', 'Ambre', 'Patchouli', 'Encens', 'Oud', 'Musc'],
    boise: ['Cèdre', 'Santal', 'Vétiver', 'Chêne', 'Pin', 'Cyprès'],
    fruite: ['Pomme', 'Pêche', 'Fraise', 'Poire', 'Agrumes', 'Fruits rouges'],
    frais: ['Citron', 'Bergamote', 'Menthe', 'Eucalyptus', 'Marine', 'Ozonic'],
    epicé: ['Poivre noir', 'Cannelle', 'Gingembre', 'Cardamome', 'Clou de girofle', 'Muscade']
  };

  const occasions = [
    { id: 'quotidien', nom: 'Usage quotidien', description: 'Pour tous les jours' },
    { id: 'travail', nom: 'Travail/Bureau', description: 'Professionnel et discret' },
    { id: 'soirée', nom: 'Soirée/Événement', description: 'Plus intense et marquant' },
    { id: 'rendez-vous', nom: 'Rendez-vous romantique', description: 'Séducteur et élégant' },
    { id: 'sport', nom: 'Sport/Loisirs', description: 'Frais et énergisant' }
  ];

  const genres = [
    { id: 'femme', nom: 'Femme', emoji: '👩' },
    { id: 'homme', nom: 'Homme', emoji: '👨' },
    { id: 'mixte', nom: 'Mixte', emoji: '👫' }
  ];

  const getNotesDisponibles = () => {
    if (reponses.famillesOlfactives.length === 0) return [];
    
    let notes: string[] = [];
    reponses.famillesOlfactives.forEach(famille => {
      if (notesOlfactives[famille as keyof typeof notesOlfactives]) {
        notes = [...notes, ...notesOlfactives[famille as keyof typeof notesOlfactives]];
      }
    });
    // Supprimer les doublons sans utiliser Set spread
    return notes.filter((note, index) => notes.indexOf(note) === index);
  };

  const handleMultipleChoice = (field: keyof QuestionnaireReponses, value: string, checked: boolean) => {
    setReponses(prev => {
      const currentValues = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleSingleChoice = (field: keyof QuestionnaireReponses, value: string) => {
    setReponses(prev => ({ ...prev, [field]: value }));
  };

  const etapeSuivante = () => {
    if (etapeActuelle < 4) {
      setEtapeActuelle(etapeActuelle + 1);
    } else {
      onComplete(reponses);
    }
  };

  const etapePrecedente = () => {
    if (etapeActuelle > 1) {
      setEtapeActuelle(etapeActuelle - 1);
    } else {
      onBack();
    }
  };

  const peutContinuer = () => {
    switch (etapeActuelle) {
      case 1: return reponses.famillesOlfactives.length > 0;
      case 2: return reponses.notesAimees.length > 0 || reponses.notesDetestees.length > 0;
      case 3: return reponses.occasion !== '';
      case 4: return reponses.genre !== '';
      default: return false;
    }
  };

  const renderEtape = () => {
    switch (etapeActuelle) {
      case 1:
        return (
          <motion.div
            key="etape1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
              Quelles familles olfactives vous attirent ?
            </h3>
            <p className="text-gray-600 mb-6">Sélectionnez une ou plusieurs familles qui vous plaisent.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {famillesOlfactives.map(famille => (
                <label key={famille.id} className="cursor-pointer">
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    reponses.famillesOlfactives.includes(famille.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reponses.famillesOlfactives.includes(famille.id)}
                        onChange={(e) => handleMultipleChoice('famillesOlfactives', famille.id, e.target.checked)}
                        className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div>
                        <h4 className="font-medium text-primary-800">{famille.nom}</h4>
                        <p className="text-sm text-gray-500">{famille.description}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="etape2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
              Vos préférences de notes
            </h3>
            <p className="text-gray-600 mb-6">
              Parmi ces notes, lesquelles aimez-vous ou détestez-vous ?
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-green-700 mb-3">✓ Notes que j'aime</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getNotesDisponibles().map(note => (
                    <label key={`aime-${note}`} className="cursor-pointer">
                      <div className={`p-2 text-sm border rounded-lg transition-all ${
                        reponses.notesAimees.includes(note)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={reponses.notesAimees.includes(note)}
                          onChange={(e) => handleMultipleChoice('notesAimees', note, e.target.checked)}
                          className="sr-only"
                        />
                        {note}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-3">✗ Notes que je n'aime pas</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getNotesDisponibles().map(note => (
                    <label key={`deteste-${note}`} className="cursor-pointer">
                      <div className={`p-2 text-sm border rounded-lg transition-all ${
                        reponses.notesDetestees.includes(note)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={reponses.notesDetestees.includes(note)}
                          onChange={(e) => handleMultipleChoice('notesDetestees', note, e.target.checked)}
                          className="sr-only"
                        />
                        {note}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="etape3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
              À quelle occasion porterez-vous ce parfum ?
            </h3>
            <p className="text-gray-600 mb-6">Choisissez l'usage principal que vous en ferez.</p>
            
            <div className="space-y-3">
              {occasions.map(occasion => (
                <label key={occasion.id} className="cursor-pointer block">
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    reponses.occasion === occasion.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="occasion"
                        value={occasion.id}
                        checked={reponses.occasion === occasion.id}
                        onChange={(e) => handleSingleChoice('occasion', e.target.value)}
                        className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <h4 className="font-medium text-primary-800">{occasion.nom}</h4>
                        <p className="text-sm text-gray-500">{occasion.description}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="etape4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
              Pour qui cherchez-vous un parfum ?
            </h3>
            <p className="text-gray-600 mb-6">Sélectionnez le style qui vous correspond.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {genres.map(genre => (
                <label key={genre.id} className="cursor-pointer">
                  <div className={`p-6 border-2 rounded-lg text-center transition-all ${
                    reponses.genre === genre.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="genre"
                      value={genre.id}
                      checked={reponses.genre === genre.id}
                      onChange={(e) => handleSingleChoice('genre', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-4xl mb-2">{genre.emoji}</div>
                    <h4 className="font-medium text-primary-800">{genre.nom}</h4>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Étape {etapeActuelle} sur 4</span>
          <span>{Math.round((etapeActuelle / 4) * 100)}% terminé</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(etapeActuelle / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderEtape()}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={etapePrecedente}
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {etapeActuelle === 1 ? 'Retour' : 'Précédent'}
        </button>

        <button
          onClick={etapeSuivante}
          disabled={!peutContinuer()}
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {etapeActuelle === 4 ? 'Voir mes recommandations' : 'Suivant'}
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ParcoursQuestionnaire; 