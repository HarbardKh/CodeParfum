import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ConseillerService, RecommandationsResponse } from '../src/services/conseiller';
import ResultatsScoring from '../src/components/conseiller/ResultatsScoring';

// Types pour les parcours
interface QuestionnaireReponses {
  famillesOlfactives: string[];
  notesAimees: string[];
  notesDetestees: string[];
  genre: string;
}

interface ParfumSelection {
  marque: string;
  parfum: string;
}

interface ReferenceChogan {
  numero: string;
  nom: string;
  description: string;
  familleOlfactive: string;
  notesDescription: string;
}

interface CorrespondanceParfum {
  parfumOriginal: {
    marque: string;
    nom: string;
  };
  referenceChogan: ReferenceChogan;
}

const ConseillerVirtuelPage = () => {
  const [etapeActuelle, setEtapeActuelle] = useState<'choix' | 'parfum' | 'questionnaire' | 'resultats'>('choix');
  const [parcoursSelectionne, setParcoursSelectionne] = useState<'parfum' | 'gouts' | null>(null);
  const [parfumSelectionne, setParfumSelectionne] = useState<ParfumSelection | null>(null);
  const [reponsesQuestionnaire, setReponsesQuestionnaire] = useState<QuestionnaireReponses | null>(null);
  const [resultatsScoring, setResultatsScoring] = useState<RecommandationsResponse | null>(null);

  // États pour la gestion des données backend
  const [parfumsDisponibles, setParfumsDisponibles] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour gérer le scoring des parfums
  const handleScoringParfums = async (reponses: QuestionnaireReponses) => {
    console.log('🎯 handleScoringParfums appelée avec les réponses:', reponses);
    setIsLoading(true);
    try {
      console.log('🎯 Lancement du système de scoring avec les réponses:', reponses);
      
      const resultats = await ConseillerService.obtenirRecommandations(reponses);
      console.log('📊 Résultats reçus:', resultats);
      
      setReponsesQuestionnaire(reponses);
      setResultatsScoring(resultats);
      setEtapeActuelle('resultats');
      
      console.log('✅ Scoring terminé, changement d\'état vers resultats');
    } catch (error) {
      console.error('❌ Erreur lors du scoring:', error);
      alert('Une erreur est survenue lors de l\'analyse de vos préférences. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour retourner au questionnaire depuis les résultats
  const retourAuQuestionnaire = () => {
    setEtapeActuelle('questionnaire');
    setResultatsScoring(null);
  };

  // Fonction pour recommencer complètement
  const recommencerConseiller = () => {
    setEtapeActuelle('choix');
    setParcoursSelectionne(null);
    setParfumSelectionne(null);
    setReponsesQuestionnaire(null);
    setResultatsScoring(null);
  };

  // Mapping des parfums vers leurs marques
  const parfumVersMarque: {[key: string]: string} = {
    // Yves Saint Laurent
    "OPIUM": "Yves Saint Laurent",
    "MANIFESTO": "Yves Saint Laurent", 
    "BLACK OPIUM": "Yves Saint Laurent",
    "MON PARIS": "Yves Saint Laurent",
    "LIBRE": "Yves Saint Laurent",
    "LA NUIT DE L'HOMME": "Yves Saint Laurent",
    
    // Dior
    "J'ADORE": "Dior",
    "HYPNOTIC POISON": "Dior",
    "CHERIE MISS DIOR": "Dior",
    "POISON GIRL": "Dior",
    "JOY": "Dior",
    "FAHRENHEIT": "Dior",
    "EAU SAUVAGE": "Dior",
    "DIOR HOMME INTENSE": "Dior",
    
    // Mugler
    "ALIEN": "Mugler",
    "ANGEL": "Mugler",
    
    // Dolce & Gabbana
    "LIGHT BLUE": "Dolce & Gabbana",
    "DOLCE": "Dolce & Gabbana",
    "THE ONE": "Dolce & Gabbana",
    "LIGHT BLUE (Pour Homme)": "Dolce & Gabbana",
    "INTENSO": "Dolce & Gabbana",
    
    // Gucci
    "GUILTY": "Gucci",
    "FLORA": "Gucci",
    
    // Paco Rabanne
    "LADY MILLION": "Paco Rabanne",
    "OLYMPEA": "Paco Rabanne",
    "ONE MILLION": "Paco Rabanne",
    "BLACK XS": "Paco Rabanne",
    "INVICTUS": "Paco Rabanne",
    
    // Chanel
    "CHANEL N°5": "Chanel",
    "COCO MADEMOISELLE": "Chanel",
    "ALLURE": "Chanel",
    "CHANCE": "Chanel",
    "GABRIELLE": "Chanel",
    "BLEU": "Chanel",
    "ALLURE (Homme)": "Chanel",
    
    // Narciso Rodriguez
    "FOR HER": "Narciso Rodriguez",
    "NARCISO": "Narciso Rodriguez",
    
    // Autres marques
    "FLOWER": "Kenzo",
    "TRESOR": "Lancôme",
    "HYPNOSE": "Lancôme", 
    "LA VIE EST BELLE": "Lancôme",
    "EAU D'ISSEY": "Issey Miyake",
    "CHLOE": "Chloé",
    "LOVE CHLOE": "Chloé",
    "CHRISTAL NOIR": "Versace",
    "DYLAN BLUE": "Versace",
    "ÉROS": "Versace",
    "ANGE OU DEMON": "Givenchy",
    "L'INTERDIT": "Givenchy",
    "OMNIA AMETHYSTE": "Bvlgari",
    "OMNIA INDIAN GARNET": "Bvlgari",
    "MAN IN BLACK": "Bvlgari",
    "HUGO": "Hugo Boss",
    "THE SCENT": "Hugo Boss",
    "ACQUA DI GIOIA": "Giorgio Armani",
    "SI": "Giorgio Armani",
    "MY WAY": "Giorgio Armani",
    "ACQUA DI GIO": "Giorgio Armani",
    "BLACK CODE": "Giorgio Armani",
    "CLASSIQUE ESSENCE": "Jean Paul Gaultier",
    "SCANDAL": "Jean Paul Gaultier",
    "LE MALE": "Jean Paul Gaultier",
    "SIGNORINA": "Salvatore Ferragamo",
    "AMO FERRAGAMO": "Salvatore Ferragamo",
    "AVENTUS FOR HER": "Creed",
    "AVENTUS": "Creed",
    "BURBERRY": "Burberry",
    "BURBERRY FOR MEN": "Burberry",
    "MR BURBERRY": "Burberry",
    "YES I AM": "Cacharel",
    "LA PETITE ROBE NOIRE": "Guerlain",
    "GOOD GIRL": "Carolina Herrera",
    "PRADA PARADOXE": "Prada",
    "ROMA": "Laura Biagiotti",
    "DECLARATION": "Cartier",
    "PASHA": "Cartier",
    "TERRE D'HERMÈS": "Hermès",
    "SPICE BOMB": "Viktor & Rolf",
    "MAN": "Calvin Klein",
    "ACQUA DI SALE": "Profumum Roma",
    "UOMO": "Valentino",
    "LEGEND": "Montblanc",
    "WANTED": "Azzaro",
    "CHROME": "Azzaro",
    "SUR LA ROUTE": "Louis Vuitton"
  };

  // Fonction pour charger les parfums depuis le backend
  const chargerParfumsDisponibles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'}/api/parfums?limit=1000`);
      const data = await response.json();
      
      if (data.docs) {
        // Regrouper les parfums par marque basé sur le mapping
        const parfumsParMarque: {[key: string]: string[]} = {};
        
        data.docs.forEach((parfum: any) => {
          if (parfum.inspiration) {
            const inspiration = parfum.inspiration.trim();
            const marque = parfumVersMarque[inspiration];
            
            if (marque) {
              if (!parfumsParMarque[marque]) {
                parfumsParMarque[marque] = [];
              }
              
              if (!parfumsParMarque[marque].includes(inspiration)) {
                parfumsParMarque[marque].push(inspiration);
              }
            }
          }
        });
        
        setParfumsDisponibles(parfumsParMarque);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des parfums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour trouver la correspondance Chogan
  const trouverCorrespondance = async (marque: string, parfum: string): Promise<any | null> => {
    try {
      // Rechercher dans la base par le champ inspiration (nom exact du parfum)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'}/api/parfums?where[inspiration][equals]=${encodeURIComponent(parfum)}&limit=1`);
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        return data.docs[0]; // Retourner le parfum Chogan correspondant
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche de correspondance:', error);
      return null;
    }
  };

  // Charger les parfums au montage du composant
  React.useEffect(() => {
    chargerParfumsDisponibles();
  }, []);

  // Composant de choix du parcours
  const ChoixParcours = () => (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">
          Comment souhaitez-vous être conseillé ?
        </h2>
        <p className="text-lg text-gray-600 mx-auto">
          Choisissez la méthode qui vous convient le mieux pour découvrir votre parfum idéal.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="group cursor-pointer"
          onClick={() => {
            setParcoursSelectionne('parfum');
            setEtapeActuelle('parfum');
          }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-300 flex flex-col">
            <div className="text-center flex-grow">
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
            </div>
            <div className="text-center mt-auto">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-base group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl border border-blue-500">
                <span className="text-lg mr-2">💎</span>
                Choisir ce parcours
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="group cursor-pointer"
          onClick={() => {
            setParcoursSelectionne('gouts');
            setEtapeActuelle('questionnaire');
          }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary-300 flex flex-col">
            <div className="text-center flex-grow">
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
            </div>
            <div className="text-center mt-auto">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl font-semibold text-base group-hover:from-amber-700 group-hover:to-orange-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl border border-amber-500">
                <span className="text-lg mr-2">🌟</span>
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

  // Composant parcours parfum
  const ParcoursParfum = () => {
    const [marqueSelectionnee, setMarqueSelectionnee] = useState<string>('');
    const [parfumSelectionneLocal, setParfumSelectionneLocal] = useState<string>('');

    // Les parfums disponibles sont maintenant chargés depuis le backend

    const handleMarqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMarqueSelectionnee(e.target.value);
      setParfumSelectionneLocal('');
    };

    const handleParfumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParfumSelectionneLocal(e.target.value);
    };

    const handleSubmit = () => {
      if (marqueSelectionnee && parfumSelectionneLocal) {
        setParfumSelectionne({ marque: marqueSelectionnee, parfum: parfumSelectionneLocal });
        setEtapeActuelle('resultats');
      }
    };

    const parfumsDisponiblesPourMarque = marqueSelectionnee ? parfumsDisponibles[marqueSelectionnee as keyof typeof parfumsDisponibles] || [] : [];

          return (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">
                Quel parfum aimez-vous ?
              </h2>
            <p className="text-lg text-gray-600">
              Sélectionnez la marque puis le parfum que vous appréciez pour que nous puissions vous proposer des créations similaires.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100">
            <div className="space-y-6">
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
                  <option value="">
                    {isLoading ? "Chargement des marques..." : "-- Sélectionnez une marque --"}
                  </option>
                  {Object.keys(parfumsDisponibles).map(marque => (
                    <option key={marque} value={marque}>{marque}</option>
                  ))}
                </select>
              </div>

              <div className={`transition-all duration-300 ${marqueSelectionnee ? 'opacity-100' : 'opacity-50'}`}>
                <label htmlFor="parfum" className="block text-lg font-medium text-primary-800 mb-3">
                  2. Choisissez le parfum
                </label>
                <select
                  id="parfum"
                  value={parfumSelectionneLocal}
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

              {marqueSelectionnee && parfumSelectionneLocal && (
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
                        Nous allons vous proposer des créations de notre catalogue qui partagent les mêmes accords olfactifs que <strong>{parfumSelectionneLocal}</strong> de <strong>{marqueSelectionnee}</strong>.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setEtapeActuelle('choix')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>

            <button
              onClick={handleSubmit}
              disabled={!marqueSelectionnee || !parfumSelectionneLocal}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Voir mes recommandations
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              💡 Votre parfum n'est pas dans la liste ? <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">Contactez-nous</Link> pour que nous l'ajoutions !
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  // Composant questionnaire simplifié
  const ParcoursQuestionnaire = () => {
    const [etapeQuestionnaire, setEtapeQuestionnaire] = useState(1);
    const [notesEviterOuvert, setNotesEviterOuvert] = useState(false);
    const [reponses, setReponses] = useState<QuestionnaireReponses>({
      famillesOlfactives: [],
      notesAimees: [],
      notesDetestees: [],
      genre: ''
    });

    // Les 7 familles olfactives officielles avec leurs couleurs
    const famillesOlfactives = [
      { id: 'hesperidee', nom: 'Hespéridée', description: 'Citron, bergamote, pamplemousse, orange...', couleur: 'from-yellow-400 to-orange-400', bordure: 'border-yellow-400', fond: 'bg-yellow-50' },
      { id: 'floral', nom: 'Florale', description: 'Rose, jasmin, muguet, pivoine...', couleur: 'from-pink-400 to-rose-400', bordure: 'border-pink-400', fond: 'bg-pink-50' },
      { id: 'fougere', nom: 'Fougère', description: 'Lavande, géranium, mousse de chêne...', couleur: 'from-purple-400 to-indigo-400', bordure: 'border-purple-400', fond: 'bg-purple-50' },
      { id: 'chypree', nom: 'Chyprée', description: 'Bergamote, mousse de chêne, patchouli...', couleur: 'from-green-400 to-emerald-400', bordure: 'border-green-400', fond: 'bg-green-50' },
      { id: 'boisee', nom: 'Boisée', description: 'Cèdre, santal, vétiver, oud...', couleur: 'from-amber-600 to-orange-600', bordure: 'border-amber-600', fond: 'bg-amber-50' },
      { id: 'aromatique', nom: 'Aromatique', description: 'Romarin, thym, sauge, herbes...', couleur: 'from-lime-400 to-green-500', bordure: 'border-lime-400', fond: 'bg-lime-50' },
      { id: 'orientale', nom: 'Orientale', description: 'Vanille, ambre, épices, musc...', couleur: 'from-red-500 to-pink-600', bordure: 'border-red-500', fond: 'bg-red-50' }
    ];

    // Notes olfactives officielles par famille
    const notesParFamille = {
      floral: {
        notes: ['Rose', 'Jasmin', 'Iris', 'Fleur d\'oranger', 'Violette', 'Muguet', 'Pivoine', 'Tiaré', 'Ylang-ylang']
      },
      boisee: {
        notes: ['Cèdre', 'Santal', 'Vétiver', 'Patchouli', 'Bois de Gaïac', 'Bois de cachemire', 'Oud', 'Mousse de chêne']
      },
      orientale: {
        notes: ['Vanille', 'Fève tonka', 'Benjoin', 'Ambre', 'Ciste/Labdanum', 'Myrrhe', 'Encens', 'Cannelle', 'Clou de girofle', 'Musc chaud']
      },
      hesperidee: {
        notes: ['Bergamote', 'Citron', 'Orange', 'Mandarine', 'Pamplemousse', 'Petitgrain', 'Yuzu', 'Néroli']
      },
      chypree: {
        notes: ['Bergamote', 'Rose', 'Jasmin', 'Patchouli', 'Mousse de chêne', 'Labdanum', 'Musc', 'Cuir doux']
      },
      fougere: {
        notes: ['Lavande', 'Coumarine', 'Géranium', 'Mousse de chêne', 'Vétiver', 'Sauge', 'Bergamote']
      },
      aromatique: {
        notes: ['Thym', 'Romarin', 'Basilic', 'Menthe', 'Lavande', 'Sauge', 'Estragon', 'Aneth']
      }
    };



    const genres = [
      { id: 'femme', nom: 'Femme', emoji: '👩' },
      { id: 'homme', nom: 'Homme', emoji: '👨' },
      { id: 'mixte', nom: 'Mixte', emoji: '👫' }
    ];

    const handleMultipleChoice = (field: keyof QuestionnaireReponses, value: string, checked: boolean) => {
      setReponses(prev => {
        const currentValues = prev[field] as string[];
        if (checked) {
          // Pour les familles olfactives : si on dépasse 3, on retire la première
          if (field === 'famillesOlfactives' && currentValues.length >= 3) {
            const newValues = [...currentValues.slice(1), value]; // Retire le premier, ajoute le nouveau
            return { ...prev, [field]: newValues };
          }
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
      console.log('🔄 etapeSuivante appelée, étape actuelle:', etapeQuestionnaire);
      console.log('📝 Réponses actuelles:', reponses);
      
      if (etapeQuestionnaire < 3) {
        setEtapeQuestionnaire(etapeQuestionnaire + 1);
        console.log('➡️ Passage à l\'étape suivante:', etapeQuestionnaire + 1);
      } else {
        console.log('🎯 Fin du questionnaire, lancement du scoring...');
        // Appeler le système de scoring
        handleScoringParfums(reponses);
      }
    };

    const etapePrecedente = () => {
      if (etapeQuestionnaire > 1) {
        setEtapeQuestionnaire(etapeQuestionnaire - 1);
      } else {
        setEtapeActuelle('choix');
      }
    };

    const peutContinuer = () => {
      switch (etapeQuestionnaire) {
        case 1: 
          const etape1Valid = reponses.famillesOlfactives.length > 0;
          console.log('✅ Validation étape 1:', etape1Valid, 'familles sélectionnées:', reponses.famillesOlfactives);
          return etape1Valid;
        case 2: {
          // Minimum 3 notes aimées × nombre de familles sélectionnées
          const notesMinimumRequises = reponses.famillesOlfactives.length * 3;
          const etape2Valid = reponses.notesAimees.length >= notesMinimumRequises;
          console.log('✅ Validation étape 2:', etape2Valid, 'notes aimées:', reponses.notesAimees.length, 'minimum requis:', notesMinimumRequises);
          return etape2Valid;
        }
        case 3: 
          const etape3Valid = reponses.genre !== '';
          console.log('✅ Validation étape 3:', etape3Valid, 'genre sélectionné:', reponses.genre);
          return etape3Valid;
        default: return false;
      }
    };

    // Obtenir toutes les notes disponibles pour les familles sélectionnées
    const getNotesDisponibles = () => {
      if (reponses.famillesOlfactives.length === 0) return [];
      
      let toutesLesNotes: string[] = [];
      reponses.famillesOlfactives.forEach(familleId => {
        const famille = notesParFamille[familleId as keyof typeof notesParFamille];
        if (famille) {
          toutesLesNotes = [...toutesLesNotes, ...famille.notes];
        }
      });
      return Array.from(new Set(toutesLesNotes)); // Supprimer les doublons
    };

    const renderEtapeQuestionnaire = () => {
      switch (etapeQuestionnaire) {
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
              <p className="text-gray-600 mb-6">Sélectionnez les familles olfactives qui vous attirent.</p>
              
              {/* Première ligne : 6 familles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {famillesOlfactives.slice(0, 6).map(famille => (
                  <label key={famille.id} className="cursor-pointer">
                    <div className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      reponses.famillesOlfactives.includes(famille.id)
                        ? `${famille.bordure} ${famille.fond} shadow-lg ring-2 ring-opacity-50`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}>
                      <input
                        type="checkbox"
                        checked={reponses.famillesOlfactives.includes(famille.id)}
                        onChange={(e) => handleMultipleChoice('famillesOlfactives', famille.id, e.target.checked)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">{famille.nom}</h4>
                        <div className={`h-3 w-full rounded-full bg-gradient-to-r ${famille.couleur} mb-3 shadow-sm`}></div>
                        <p className="text-sm text-gray-600 leading-relaxed">{famille.description}</p>
                        {reponses.famillesOlfactives.includes(famille.id) && (
                          <div className="mt-3 flex justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Deuxième ligne : 7ème famille centrée */}
              <div className="flex justify-center">
                {famillesOlfactives.slice(6, 7).map(famille => (
                  <label key={famille.id} className="cursor-pointer max-w-md w-full">
                    <div className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      reponses.famillesOlfactives.includes(famille.id)
                        ? `${famille.bordure} ${famille.fond} shadow-lg ring-2 ring-opacity-50`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}>
                      <input
                        type="checkbox"
                        checked={reponses.famillesOlfactives.includes(famille.id)}
                        onChange={(e) => handleMultipleChoice('famillesOlfactives', famille.id, e.target.checked)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">{famille.nom}</h4>
                        <div className={`h-3 w-full rounded-full bg-gradient-to-r ${famille.couleur} mb-3 shadow-sm`}></div>
                        <p className="text-sm text-gray-600 leading-relaxed">{famille.description}</p>
                        {reponses.famillesOlfactives.includes(famille.id) && (
                          <div className="mt-3 flex justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
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
                Affinez vos préférences
              </h3>
              <p className="text-gray-600 mb-2">
                Parmi les notes de vos familles sélectionnées, lesquelles aimez-vous ou détestez-vous ?
              </p>
              <p className="text-primary-600 font-medium mb-6">
                ✨ Sélectionnez au minimum {reponses.famillesOlfactives.length * 3} notes que vous aimez 
                ({reponses.notesAimees.length}/{reponses.famillesOlfactives.length * 3} sélectionnées)
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center">
                    <span className="text-xl mr-2">✓</span>
                    Notes que j'aime particulièrement
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getNotesDisponibles().map(note => (
                      <label key={`aime-${note}`} className="cursor-pointer">
                        <div className={`p-3 text-sm border-2 rounded-lg transition-all text-center ${
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
                  <button
                    onClick={() => setNotesEviterOuvert(!notesEviterOuvert)}
                    className="w-full text-left font-medium text-red-700 mb-3 flex items-center justify-between hover:text-red-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">✗</span>
                      Notes que je n'aime pas du tout (optionnel)
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${notesEviterOuvert ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {notesEviterOuvert && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 md:grid-cols-3 gap-2"
                    >
                      {getNotesDisponibles().map(note => (
                        <label key={`deteste-${note}`} className="cursor-pointer">
                          <div className={`p-3 text-sm border-2 rounded-lg transition-all text-center ${
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
                    </motion.div>
                  )}
                </div>

                {getNotesDisponibles().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Veuillez d'abord sélectionner des familles olfactives à l'étape précédente.</p>
                  </div>
                )}
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
                Pour qui est ce parfum ?
              </h3>
              <p className="text-gray-600 mb-6">Sélectionnez le genre pour lequel vous recherchez un parfum.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {genres.map(genre => (
                  <div 
                    key={genre.id} 
                    className={`p-6 border-2 rounded-lg transition-all duration-200 text-center cursor-pointer transform hover:scale-105 ${
                      reponses.genre === genre.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSingleChoice('genre', genre.id)}
                  >
                    <div className="text-4xl mb-3">{genre.emoji}</div>
                    <h4 className={`font-medium transition-colors ${
                      reponses.genre === genre.id 
                        ? 'text-primary-700' 
                        : 'text-primary-800'
                    }`}>
                      {genre.nom}
                    </h4>
                    {reponses.genre === genre.id && (
                      <div className="mt-2">
                        <div className="inline-flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );

      default:
          return null;
      }
    };

        return (
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Étape {etapeQuestionnaire} sur 3</span>
            <span>{Math.round((etapeQuestionnaire / 3) * 100)}% terminé</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(etapeQuestionnaire / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderEtapeQuestionnaire()}
          </AnimatePresence>
            </div>

        <div className="flex justify-between items-center mt-8">
              <button
            onClick={etapePrecedente}
            className="inline-flex items-center px-6 py-3 border-2 border-gray-400 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            {etapeQuestionnaire === 1 ? 'Retour' : 'Précédent'}
              </button>

              <button
            onClick={etapeSuivante}
            disabled={!peutContinuer()}
            className={`inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-bold rounded-xl text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
              !peutContinuer() 
                ? 'bg-gray-400 cursor-not-allowed border-gray-300' 
                : etapeQuestionnaire === 3 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-400' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-blue-400'
            }`}
          >
            {etapeQuestionnaire === 3 ? (
              <>
                <span className="text-2xl mr-3">✨</span>
                Voir mes recommandations
                <svg className="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            ) : (
              <>
                <span className="text-xl mr-2">👉</span>
                Suivant
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

  // Composant résultats
  const ResultatsConseils = () => {
    const [referenceChogan, setReferenceChogan] = useState<any | null>(null);
    const [loadingCorrespondance, setLoadingCorrespondance] = useState(false);
    
    // Charger la correspondance quand on arrive sur les résultats
    React.useEffect(() => {
      if (parcoursSelectionne === 'parfum' && parfumSelectionne) {
        const chargerCorrespondance = async () => {
          setLoadingCorrespondance(true);
          const correspondance = await trouverCorrespondance(parfumSelectionne.marque, parfumSelectionne.parfum);
          setReferenceChogan(correspondance);
          setLoadingCorrespondance(false);
        };
        chargerCorrespondance();
      }
    }, [parfumSelectionne, parcoursSelectionne]);

    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">
            Vos recommandations personnalisées
          </h2>
          <p className="text-lg text-gray-600">
            Voici nos suggestions basées sur vos préférences
          </p>
        </motion.div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 mb-8">
          {parcoursSelectionne === 'parfum' && parfumSelectionne && (
            <div className="text-center">
              {loadingCorrespondance ? (
                <div>
                  <div className="text-6xl mb-4">⏳</div>
                  <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
                    Recherche en cours...
                  </h3>
                  <p className="text-gray-600">
                    Nous analysons votre sélection pour vous proposer le parfum Chogan idéal.
                  </p>
                </div>
              ) : referenceChogan ? (
                <div className="space-y-8">
                  {/* En-tête avec émoji et titre principal */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌟</div>
                    <h3 className="text-3xl font-serif font-semibold text-primary-800 mb-4">
                      Votre parfum Chogan idéal
                    </h3>
                  </div>

                  {/* Section d'introduction explicative */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="text-xl font-medium text-primary-800 mb-4 flex items-center">
                      <span className="mr-2">🎯</span>
                      Pourquoi cette recommandation ?
                    </h4>
                    
                    <div className="space-y-4 text-gray-700">
                      <p className="text-lg leading-relaxed">
                        Vous avez choisi <strong className="text-primary-700">{parfumSelectionne.parfum}</strong> de <strong className="text-primary-700">{parfumSelectionne.marque}</strong>, 
                        un parfum reconnu pour ses qualités olfactives exceptionnelles.
                      </p>
                      
                      {/* Analyse des familles olfactives */}
                      {(referenceChogan.famillePrincipale || referenceChogan.familleSecondaire) && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-medium text-primary-800 mb-2 flex items-center">
                            <span className="mr-2">🌿</span>
                            Familles olfactives communes
                          </h5>
                          <p className="text-sm">
                            Notre référence Chogan N°{referenceChogan.numeroParf} appartient à la famille 
                            <strong className="text-purple-700 mx-1">
                              {referenceChogan.famillePrincipale}
                              {referenceChogan.familleSecondaire && ` - ${referenceChogan.familleSecondaire}`}
                            </strong>
                            , tout comme votre parfum préféré. Vous retrouverez ainsi des accords familiers et une personnalité olfactive qui devrait vous séduire.
                          </p>
                        </div>
                      )}

                      {/* Analyse des notes olfactives */}
                      {(referenceChogan.noteTete || referenceChogan.noteCoeur || referenceChogan.noteFond) && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-medium text-primary-800 mb-3 flex items-center">
                            <span className="mr-2">👃</span>
                            Profil olfactif détaillé
                          </h5>
                          <div className="space-y-2 text-sm">
                            {referenceChogan.noteTete && (
                              <div className="flex">
                                <span className="font-medium text-green-700 w-24 flex-shrink-0">Notes de tête :</span>
                                <span className="text-gray-700">{referenceChogan.noteTete}</span>
                              </div>
                            )}
                            {referenceChogan.noteCoeur && (
                              <div className="flex">
                                <span className="font-medium text-pink-700 w-24 flex-shrink-0">Notes de cœur :</span>
                                <span className="text-gray-700">{referenceChogan.noteCoeur}</span>
                              </div>
                            )}
                            {referenceChogan.noteFond && (
                              <div className="flex">
                                <span className="font-medium text-amber-700 w-24 flex-shrink-0">Notes de fond :</span>
                                <span className="text-gray-700">{referenceChogan.noteFond}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-3 italic">
                            Ces notes créent une signature olfactive qui se rapproche de celle de votre parfum préféré, 
                            vous offrant une expérience familière tout en découvrant une nouvelle création.
                          </p>
                        </div>
                      )}

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <p className="text-center font-medium text-green-800">
                          ✨ <strong>Notre conclusion :</strong> Cette référence Chogan devrait vous séduire car elle partage 
                          les mêmes codes olfactifs que votre parfum coup de cœur, tout en vous offrant 
                          l'excellence et l'accessibilité de la marque Chogan.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fiche produit détaillée */}
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl border border-primary-200">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-primary-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                        N° {referenceChogan.numeroParf}
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-serif font-bold text-primary-800 mb-4 text-center">
                      Référence Chogan N°{referenceChogan.numeroParf}
                    </h4>
                    
                    {referenceChogan.description1 && (
                      <p className="text-gray-700 italic mb-6 text-lg text-center leading-relaxed">
                        "{referenceChogan.description1}"
                      </p>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                        <span className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                          {referenceChogan.genre === 'F' ? '👩 Féminin' : referenceChogan.genre === 'H' ? '👨 Masculin' : '👥 Unisexe'}
                        </span>
                        {referenceChogan.intensite && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                            🎯 {referenceChogan.intensite}
                          </span>
                        )}
                        {(referenceChogan.famillePrincipale || referenceChogan.familleOlfactive) && (
                          <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                            🌿 {typeof referenceChogan.familleOlfactive === 'object' ? referenceChogan.familleOlfactive.nom : (referenceChogan.famillePrincipale || referenceChogan.familleOlfactive)}
                          </span>
                        )}
                      </div>
                      
                      {referenceChogan.aPropos && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">À propos de ce parfum :</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">{referenceChogan.aPropos}</p>
                        </div>
                      )}

                      {referenceChogan.ConseilExpertise && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                            <span className="mr-2">💡</span>
                            Conseil d'expert
                          </h5>
                          <p className="text-sm text-blue-700 leading-relaxed">{referenceChogan.ConseilExpertise}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-primary-800">
                        {referenceChogan.prix}€
                      </div>
                      <p className="text-sm text-gray-600">Prix exceptionnel pour une qualité premium</p>
                      <Link href={`/catalogue/${referenceChogan.slug}`}>
                        <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                          <span className="mr-2">🛍️</span>
                          Découvrir ce parfum
                          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-serif font-semibold text-primary-800 mb-4">
                    Aucune correspondance trouvée
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Votre sélection : <strong>{parfumSelectionne.parfum}</strong> de <strong>{parfumSelectionne.marque}</strong>
                  </p>
                  <div className="bg-amber-50 p-6 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Parfum non encore référencé</h4>
                    <p className="text-amber-700 text-sm">
                      Ce parfum n'est pas encore disponible dans notre gamme Chogan. 
                      En attendant, vous pouvez essayer avec un autre parfum ou utiliser notre questionnaire personnalisé.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        {parcoursSelectionne === 'gouts' && resultatsScoring && reponsesQuestionnaire && (
          <ResultatsScoring
            resultats={resultatsScoring}
            reponses={reponsesQuestionnaire}
            onRetour={retourAuQuestionnaire}
            onRecommencer={recommencerConseiller}
          />
        )}

        {/* Indicateur de chargement pour le scoring */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center mx-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                🎯 Analyse en cours...
              </h3>
              <p className="text-gray-600">
                Nous analysons vos préférences pour vous proposer les parfums les plus adaptés.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            setEtapeActuelle('choix');
            setParcoursSelectionne(null);
            setParfumSelectionne(null);
            setReponsesQuestionnaire(null);
          }}
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Recommencer
        </button>
      </div>
    </div>
    );
  };

  const renderContenu = () => {
    switch (etapeActuelle) {
      case 'choix':
        return <ChoixParcours />;
      case 'parfum':
        return <ParcoursParfum />;
      case 'questionnaire':
        return <ParcoursQuestionnaire />;
      case 'resultats':
        return <ResultatsConseils />;
      default:
        return <ChoixParcours />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-800 mb-4">
              Conseiller Virtuel
            </h1>
            <p className="text-xl text-gray-600 mx-auto">
              Découvrez le parfum parfait grâce à notre système de recommandations personnalisées. 
              Deux approches, un seul objectif : vous accompagner vers votre fragrance idéale.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {renderContenu()}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default ConseillerVirtuelPage; 