import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { submitProfilData, getAdviceForProfile, ProfilFormData, Recommendation } from '@/services/profilService';

// Définition des types
interface UserResponses {
  parfumActuel: string;
  scenteurs: string[];
  famillesAimees: string[];
  famillesNonAimees: string[];
  situations: string[];
  intention: string;
  intensite: string;
  genre: string;
  email: string;
  prenom: string;
  nom: string;
  consentement: boolean;
}

interface Option {
  id: string;
  label: string;
  value: string;
}

// Composant pour la page du conseiller virtuel
const ConseillerVirtuelPage = () => {
  // États pour gérer le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [userResponses, setUserResponses] = useState<UserResponses>({
    parfumActuel: '',
    scenteurs: [],
    famillesAimees: [],
    famillesNonAimees: [],
    situations: [],
    intention: '',
    intensite: '',
    genre: '',
    email: '',
    prenom: '',
    nom: '',
    consentement: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [personalizedAdvice, setPersonalizedAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Options pour les différentes questions
  const senteurOptions: Option[] = [
    { id: 'fraiche', label: '🌬️ Fraîches (agrumes, menthe, propre…)', value: 'Fraîche' },
    { id: 'florale', label: '🌸 Florales (rose, jasmin, iris…)', value: 'Florale' },
    { id: 'sucree', label: '🍭 Sucrées / gourmandes (vanille, caramel, fruits…)', value: 'Sucrée' },
    { id: 'boisee', label: '🌳 Boisées (santal, vétiver, cèdre…)', value: 'Boisée' },
    { id: 'epicee', label: '🌶️ Épicées (poivre, cannelle, gingembre…)', value: 'Épicée' },
    { id: 'musquee', label: '🧴 Musquées / poudrées', value: 'Musquée' }
  ];

  const familleOptions: Option[] = [
    { id: 'florale', label: 'Florale', value: 'Florale' },
    { id: 'boisee', label: 'Boisée', value: 'Boisée' },
    { id: 'aromatique', label: 'Aromatique', value: 'Aromatique' },
    { id: 'fougere', label: 'Fougère', value: 'Fougère' },
    { id: 'hesperidee', label: 'Hespéridée', value: 'Hespéridée' },
    { id: 'chypree', label: 'Chyprée', value: 'Chyprée' },
    { id: 'orientale', label: 'Orientale', value: 'Orientale' }
  ];

  const situationOptions: Option[] = [
    { id: 'quotidien', label: 'Tous les jours, pour moi', value: 'Quotidien' },
    { id: 'travail', label: 'Au travail / dans un cadre professionnel', value: 'Travail' },
    { id: 'soiree', label: 'En soirée ou pour sortir', value: 'Soirée' },
    { id: 'seduction', label: 'Pour séduire ou marquer une présence', value: 'Séduction' },
    { id: 'evenement', label: "Lors d'événements spéciaux (mariages, dîners, fêtes...)", value: 'Événement' },
    { id: 'saison', label: "Selon l'humeur ou la saison", value: 'Saison' }
  ];

  // Gestion des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserResponses(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'consentement') {
      setUserResponses(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setUserResponses(prev => {
      const currentValues = prev[name as keyof UserResponses] as string[];
      
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter((item: string) => item !== value) };
      }
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserResponses(prev => ({ ...prev, [name]: value }));
  };

  // Navigation entre les étapes avec transitions fluides
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Soumission du formulaire - version simplifiée pour débogage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Soumission du formulaire initié');
    }
    setLoading(true);
    setError(null);
    
    try {
      // Vérification des champs obligatoires
      if (!userResponses.email) {
        setError('Veuillez fournir un email');
        return;
      }

      // Préparation des données pour l'API
      const formData: ProfilFormData = {
        email: userResponses.email,
        prenom: userResponses.prenom || '',
        nom: userResponses.nom || '',
        genre_utilisateur: userResponses.genre || 'Mixte',
        parfum_utilise: userResponses.parfumActuel || '',
        familles_aimees: userResponses.famillesAimees,
        familles_detestees: userResponses.famillesNonAimees,
        usage_habituel: userResponses.situations,
        usage_recherche: userResponses.intention || '',
        intensite_souhaitee: userResponses.intensite || 'Moyenne',
        consentement: userResponses.consentement,
        scenteurs: userResponses.scenteurs
      };
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Données préparées:', formData);
      }
      
      // Stocker les données dans localStorage pour les utiliser ultérieurement
      localStorage.setItem('userFormData', JSON.stringify(formData));
      
      // Envoi des données à l'API
      const response = await submitProfilData(formData);
      
      // Si tout s'est bien passé, on récupère les recommandations
      if (response && response.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Réponse de l\'API avec recommendations:', response.recommendations);
          console.log('Recommandation correspondant à l\'inspiration:', response.inspirationMatch);
        }
        setRecommendations(response.recommendations || []);
        
        // Si l'utilisateur a consenti, on récupère les conseils personnalisés
        if (userResponses.consentement) {
          setLoadingAdvice(true);
          try {
            const adviceResponse = await getAdviceForProfile(userResponses.email);
            if (adviceResponse && adviceResponse.recommendations && adviceResponse.recommendations.length > 0) {
              // Génération d'un conseil personnalisé basé sur les recommandations
              const conseil = `Nous vous recommandons particulièrement ${adviceResponse.recommendations[0].nom} qui correspond parfaitement à votre profil.`;
              setPersonalizedAdvice(conseil);
            }
          } catch (adviceErr) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('Erreur lors de la récupération des conseils:', adviceErr);
            }
          } finally {
            setLoadingAdvice(false);
          }
        }
        
        // Marquer comme soumis
        setSubmitted(true);
      } else {
        throw new Error('Erreur lors de la soumission du profil');
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erreur:', err);
      }
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Rendu conditionnel des étapes du questionnaire
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 1/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label htmlFor="parfumActuel" className="block text-lg font-medium text-primary-800 mb-3">
                Utilisez-vous déjà un parfum que vous aimez particulièrement ?
              </label>
              <p className="text-gray-600 mb-4">Si vous avez un parfum coup de cœur, dites-nous lequel. Cela peut nous aider à mieux cerner vos goûts !</p>
              <textarea
                id="parfumActuel"
                name="parfumActuel"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: J'aime beaucoup Coco Mademoiselle de Chanel..."
                value={userResponses.parfumActuel}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 2/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label className="block text-lg font-medium text-primary-800 mb-3">
                Quelles senteurs vous attirent instinctivement ?
              </label>
              <p className="text-gray-600 mb-4">Choisissez toutes les familles qui vous plaisent, même si c'est juste une impression !</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {senteurOptions.map(option => (
                  <div key={option.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={option.id}
                        name="scenteurs"
                        type="checkbox"
                        value={option.value}
                        checked={userResponses.scenteurs.includes(option.value)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={option.id} className="text-gray-700 cursor-pointer">{option.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 3/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label className="block text-lg font-medium text-primary-800 mb-3">
                Vos préférences en familles olfactives
              </label>
              <p className="text-gray-600 mb-4">Sélectionnez les familles que vous aimez et celles que vous n'aimez pas.</p>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-primary-700 mb-3">J'aime particulièrement :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {familleOptions.map(option => (
                    <div key={option.id} className="flex items-start">
                      <input
                        id={`aime-${option.id}`}
                        name="famillesAimees"
                        type="checkbox"
                        value={option.value}
                        checked={userResponses.famillesAimees.includes(option.value)}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor={`aime-${option.id}`} className="ml-3 text-base text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-primary-700 mb-3">Je préfère éviter :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {familleOptions.map(option => (
                    <div key={option.id} className="flex items-start">
                      <input
                        id={`deteste-${option.id}`}
                        name="famillesNonAimees"
                        type="checkbox"
                        value={option.value}
                        checked={userResponses.famillesNonAimees.includes(option.value)}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor={`deteste-${option.id}`} className="ml-3 text-base text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 4/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label className="block text-lg font-medium text-primary-800 mb-3">
                Dans quelles situations portez-vous généralement un parfum ?
              </label>
              <p className="text-gray-600 mb-4">Sélectionnez les contextes habituels d'utilisation.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {situationOptions.map(option => (
                  <div key={option.id} className="flex items-start">
                    <input
                      id={option.id}
                      name="situations"
                      type="checkbox"
                      value={option.value}
                      checked={userResponses.situations.includes(option.value)}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 text-primary-600 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor={option.id} className="ml-3 text-base text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 5/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label className="block text-lg font-medium text-primary-800 mb-3">
                Quelle intensité de parfum préférez-vous ?
              </label>
              <p className="text-gray-600 mb-4">Choisissez l'option qui correspond le mieux à vos préférences.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="intensite-legere"
                    name="intensite"
                    type="radio"
                    value="Légère"
                    checked={userResponses.intensite === "Légère"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intensite-legere" className="ml-3 block text-base text-gray-700">
                    Légère (subtile, pour une empreinte discrète)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="intensite-moyenne"
                    name="intensite"
                    type="radio"
                    value="Moyenne"
                    checked={userResponses.intensite === "Moyenne"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intensite-moyenne" className="ml-3 block text-base text-gray-700">
                    Moyenne (équilibrée, perceptible sans être envahissante)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="intensite-forte"
                    name="intensite"
                    type="radio"
                    value="Forte"
                    checked={userResponses.intensite === "Forte"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intensite-forte" className="ml-3 block text-base text-gray-700">
                    Forte (présence affirmée, sillage marqué)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question 6/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <label className="block text-lg font-medium text-primary-800 mb-3">
                Quelle est votre intention principale ?
              </label>
              <p className="text-gray-600 mb-4">Qu'attendez-vous avant tout de votre parfum ?</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="intention-signature"
                    name="intention"
                    type="radio"
                    value="Signature"
                    checked={userResponses.intention === "Signature"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intention-signature" className="ml-3 block text-base text-gray-700">
                    Une signature qui me ressemble au quotidien
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="intention-seduction"
                    name="intention"
                    type="radio"
                    value="Séduction"
                    checked={userResponses.intention === "Séduction"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intention-seduction" className="ml-3 block text-base text-gray-700">
                    Séduire et attirer l'attention
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="intention-occasion"
                    name="intention"
                    type="radio"
                    value="Occasion"
                    checked={userResponses.intention === "Occasion"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intention-occasion" className="ml-3 block text-base text-gray-700">
                    Marquer des occasions spéciales
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="intention-bien-etre"
                    name="intention"
                    type="radio"
                    value="Bien-être"
                    checked={userResponses.intention === "Bien-être"}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="intention-bien-etre" className="ml-3 block text-base text-gray-700">
                    Me sentir bien, pour mon plaisir personnel
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Dernière étape
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Dernière étape</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <h3 className="text-lg font-medium text-primary-800 mb-4">
                Vos coordonnées
              </h3>
              <p className="text-gray-600 mb-6">
                Pour recevoir votre profil olfactif personnalisé et nos recommandations sur mesure.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={userResponses.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={userResponses.prenom}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={userResponses.nom}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quel genre de parfum recherchez-vous ?</label>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        id="genre-feminin"
                        name="genre"
                        type="radio"
                        value="Féminin"
                        checked={userResponses.genre === "Féminin"}
                        onChange={handleRadioChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="genre-feminin" className="ml-2 block text-sm text-gray-700">
                        Féminin
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="genre-masculin"
                        name="genre"
                        type="radio"
                        value="Masculin"
                        checked={userResponses.genre === "Masculin"}
                        onChange={handleRadioChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="genre-masculin" className="ml-2 block text-sm text-gray-700">
                        Masculin
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="genre-mixte"
                        name="genre"
                        type="radio"
                        value="Mixte"
                        checked={userResponses.genre === "Mixte"}
                        onChange={handleRadioChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="genre-mixte" className="ml-2 block text-sm text-gray-700">
                        Mixte / Unisexe
                      </label>
                    </div>
                  </div>
                </div>
                
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
                    <label htmlFor="consentement" className="text-gray-700">
                      J'accepte de recevoir les recommandations personnalisées et les offres exclusives de CodeParfum.fr.
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !userResponses.email}
                className={`inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white 
                  ${loading || !userResponses.email ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-700 hover:bg-primary-800'}`}
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
      
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-primary-800">Question {currentStep}/6</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <p className="text-center py-8">Cette partie du questionnaire est en cours de développement.</p>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Question suivante
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
    }
  };

  // Affichage des résultats
  const renderResults = () => {
    // Récupérer la correspondance de parfum inspiré si disponible
    const inspirationMatch = recommendations.find(rec => typeof rec.confiance === 'string' ? rec.confiance === 'Très élevée' : rec.confiance > 90);
    
    // Regrouper les recommandations par famille
    const recommendationsByFamily = recommendations.reduce((acc, rec) => {
      if (!rec.famille) return acc;
      
      const famille = rec.famille.split(' ')[0]; // Prendre juste le premier mot (Floral, Ambré, etc.)
      if (!acc[famille]) acc[famille] = [];
      acc[famille].push(rec);
      return acc;
    }, {} as Record<string, Recommendation[]>);
    
    // Regrouper par intensité
    const recommendationsByIntensity = recommendations.reduce((acc, rec) => {
      if (!rec.intensite) return acc;
      
      if (!acc[rec.intensite]) acc[rec.intensite] = [];
      acc[rec.intensite].push(rec);
      return acc;
    }, {} as Record<string, Recommendation[]>);
    
    // Regrouper par occasion
    const recommendationsByOccasion = recommendations.reduce((acc, rec) => {
      if (!rec.occasion) return acc;
      
      // rec.occasion peut être une chaîne ou un tableau
      let occasions: string[] = [];
      
      // Force le typage avec as pour éviter l'inférence 'never'
      const occasionValue = rec.occasion as string | string[] | undefined;
      
      if (Array.isArray(occasionValue)) {
        occasions = occasionValue;
      } else if (typeof occasionValue === 'string') {
        occasions = occasionValue.split('/').map((o: string) => o.trim());
      }
      
      occasions.forEach((occasion: string) => {
        if (!acc[occasion]) acc[occasion] = [];
        if (!acc[occasion].includes(rec)) { // Éviter les doublons
          acc[occasion].push(rec);
        }
      });
      
      return acc;
    }, {} as Record<string, Recommendation[]>);
    
    return (
      <div className="space-y-12">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg border border-primary-100 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-4">
            Votre profil olfactif a été créé !
          </h2>
          <p className="text-xl text-primary-700 mb-6">
            Merci {userResponses.prenom ? userResponses.prenom : 'cher client'} ! Nous avons analysé vos préférences et sélectionné des parfums parfaitement adaptés à votre profil.
          </p>
          {userResponses.consentement && (
            <p className="mt-2 text-base text-primary-600">
              Un email avec votre profil détaillé et des recommandations exclusives a été envoyé à <span className="font-medium">{userResponses.email}</span>.
            </p>
          )}
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700">Erreur: {error}</p>
          </div>
        )}

        {/* Recommandation basée sur le parfum habituel du client */}
        {userResponses.parfumActuel && inspirationMatch && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-primary-200">
            <h3 className="text-2xl font-serif font-medium text-primary-800 mb-6">
              Une fragrance qui pourrait vous séduire
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-48 h-48 rounded-full bg-primary-50 flex items-center justify-center text-5xl">
                  ✨
                </div>
              </div>
              <div className="md:w-2/3">
                <h4 className="text-xl font-semibold text-primary-700 mb-2">Parfum n°{inspirationMatch.reference}</h4>
                <p className="text-gray-700 mb-4">
                  D'après votre appréciation pour <span className="italic">{userResponses.parfumActuel}</span>, nous pensons que cette création pourrait vous offrir une expérience olfactive familière mais avec une touche unique et personnelle.
                </p>
                {inspirationMatch.a_propos ? (
                  <p className="text-gray-700 mb-6">
                    {inspirationMatch.a_propos.substring(0, 200)}...
                  </p>
                ) : (
                  <p className="text-gray-700 mb-6">
                    Notre parfum n°{inspirationMatch.reference} partage certaines notes olfactives que vous appréciez déjà, tout en apportant sa propre signature distinctive. Une fragrance qui évoque des souvenirs agréables tout en créant de nouvelles émotions.
                  </p>
                )}
                
                {inspirationMatch.pyramideOlfactive && (
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center text-gray-700">
                      <span className="w-6 flex-shrink-0">🌿</span>
                      <span className="ml-2">{inspirationMatch.famille}</span>
                    </p>
                    {inspirationMatch.pyramideOlfactive && (
                      <p className="flex items-center text-gray-700">
                        <span className="w-6 flex-shrink-0">👃</span>
                        <span className="ml-2">
                          {inspirationMatch.pyramideOlfactive.notesDeTete ? 
                            inspirationMatch.pyramideOlfactive.notesDeTete.slice(0, 2).join(', ') : 
                            ('Notes parfumées')}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                
                <Link 
                  href={`/catalogue/parfum/${inspirationMatch.reference}`} 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Découvrir ce parfum
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recommandations basées sur les préférences olfactives */}
        {recommendations && recommendations.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-medium text-primary-800">
              Selon vos préférences olfactives
            </h3>
            
            {/* Encart pour chaque famille olfactive aimée */}
            {Object.entries(recommendationsByFamily).map(([famille, recs]) => (
              <div key={famille} className="bg-white p-6 rounded-xl shadow-md border border-primary-100 mb-8">
                <h4 className="text-xl font-medium text-primary-700 mb-4">Votre attirance pour les notes {famille}...</h4>
                <p className="text-gray-700 mb-6">
                  {famille === 'Floral' && 'Les parfums floraux révèlent votre côté romantique et sensible. Cette famille olfactive, à la fois douce et élégante, offre une palette riche d\'émotions.'}
                  {famille === 'Ambré' && 'Votre intérêt pour les notes ambrées témoigne d\'une personnalité chaleureuse qui apprécie la profondeur et la sensualité dans un parfum.'}
                  {famille === 'Boisé' && 'Les parfums boisés que vous appréciez reflètent un caractère naturel et authentique, avec une recherche d\'équilibre entre force et élégance.'}
                  {famille === 'Fruité' && 'Votre goût pour les notes fruitées montre un tempérament joyeux et pétillant, qui aime apporter une touche de fraîcheur dans son sillage.'}
                  {famille === 'Épicé' && 'En choisissant des parfums épicés, vous exprimez une personnalité audacieuse et passionnée, qui n\'hésite pas à affirmer son caractère.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recs.slice(0, 3).map((rec, index) => (
                    <div key={index} className="bg-primary-50 rounded-xl overflow-hidden border border-primary-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl mr-4">
                            ✨
                          </div>
                          <h4 className="text-xl font-medium text-primary-800">Parfum n°{rec.reference}</h4>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="flex items-center text-gray-700">
                            <span className="w-6 flex-shrink-0">🌿</span>
                            <span className="ml-2">{rec.famille || 'Famille variée'}</span>
                          </p>
                          <p className="flex items-center text-gray-700">
                            <span className="w-6 flex-shrink-0">👃</span>
                            <span className="ml-2">{rec.notes || 'Notes diverses'}</span>
                          </p>
                        </div>
                        
                        <p className="text-primary-600 italic mb-6">
                          "{rec.description?.substring(0, 100)}..."
                        </p>
                        
                        <Link 
                          href={`/catalogue/parfum/${rec.reference}`} 
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                          Découvrir ce parfum
                          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Recommandations basées sur l'intensité souhaitée */}
            {Object.entries(recommendationsByIntensity).length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-primary-100 mb-8">
                <h4 className="text-xl font-medium text-primary-700 mb-4">
                  Pour une intensité {userResponses.intensite ? userResponses.intensite.toLowerCase() : 'parfaite'}
                </h4>
                <p className="text-gray-700 mb-6">
                  {userResponses.intensite === 'Légère' && 'Vous privilégiez la subtilité et la discrétion. Ces parfums légers vous offrent une présence délicate qui vous accompagne sans s\'imposer, idéale pour le quotidien.'}
                  {userResponses.intensite === 'Moyenne' && 'L\'équilibre parfait entre présence et discrétion vous correspond. Ces parfums offrent un sillage perceptible sans être envahissant, polyvalent pour toutes occasions.'}
                  {userResponses.intensite === 'Forte' && 'Vous aimez les parfums qui affirment votre présence. Ces fragrances à l\'intensité prononcée laissent un sillage mémorable qui marque les esprits.'}
                  {!userResponses.intensite && 'L\'intensité du parfum est essentielle pour trouver l\'équilibre parfait entre présence et discrétion. Voici des fragrances qui offrent un sillage adapté à votre personnalité.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(recommendationsByIntensity).map(([intensite, recs]) => 
                    recs.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex bg-primary-50 rounded-xl overflow-hidden border border-primary-100 transition-all duration-300 hover:shadow-lg p-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl mr-4 flex-shrink-0">
                          ✨
                        </div>
                        <div>
                          <h5 className="text-lg font-medium text-primary-800 mb-2">Parfum n°{rec.reference}</h5>
                          <p className="text-gray-700 text-sm mb-2">{rec.famille} • {rec.notes}</p>
                          <p className="text-primary-600 italic text-sm mb-3">
                            Intensité: {rec.intensite || 'Moyenne'}
                          </p>
                          <Link 
                            href={`/catalogue/parfum/${rec.reference}`} 
                            className="inline-flex items-center px-3 py-1 text-xs border border-transparent font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Découvrir
                            <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Recommandations basées sur l'usage/occasion */}
            {Object.entries(recommendationsByOccasion).length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-primary-100">
                <h4 className="text-xl font-medium text-primary-700 mb-4">
                  Pour vos moments spéciaux
                </h4>
                <p className="text-gray-700 mb-6">
                  Chaque moment de vie mérite son parfum. Que ce soit pour le quotidien, une soirée spéciale ou un rendez-vous romantique, découvrez des fragrances spécialement sélectionnées pour ces occasions.
                </p>
                
                <div className="space-y-6">
                  {Object.entries(recommendationsByOccasion)
                    .filter(([occasion]) => userResponses.situations.some(sit => occasion.includes(sit)))
                    .slice(0, 2)
                    .map(([occasion, recs]) => (
                      <div key={occasion} className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-800 mb-3">Pour les moments {occasion}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {recs.slice(0, 3).map((rec, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-primary-100">
                              <h6 className="font-medium text-primary-800 mb-1">Parfum n°{rec.reference}</h6>
                              <p className="text-xs text-gray-600 mb-2">{rec.famille} • {rec.notes.split(',')[0]}</p>
                              <Link 
                                href={`/catalogue/parfum/${rec.reference}`} 
                                className="text-primary-600 text-sm hover:underline"
                              >
                                Découvrir →
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md border border-primary-100 text-center">
            <p className="text-primary-700">
              Nous préparons vos recommandations personnalisées...
            </p>
          </div>
        )}

        {/* Conseil personnalisé avec un meilleur contraste */}
        {personalizedAdvice && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden border border-primary-200"
          >

            
            <div className="relative z-10">
              <h3 className="text-2xl font-serif mb-6 text-primary-800">Votre conseil personnalisé</h3>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: personalizedAdvice }}
              ></div>
            </div>
          </motion.div>
        )}

        {/* Éducation olfactive */}
        <div className="bg-primary-50 p-8 rounded-2xl shadow-md border border-primary-100">
          <h3 className="text-2xl font-serif font-medium text-primary-800 mb-6 text-center">Pour aller plus loin dans votre découverte olfactive</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/guide-conseil/familles-olfactives" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl mr-3 group-hover:bg-primary-200 transition-colors">
                  🌿
                </div>
                <h4 className="text-xl font-medium text-primary-700">Les Familles Olfactives</h4>
              </div>
              <p className="text-gray-600">Approfondissez vos connaissances sur les différentes familles de parfums et leurs caractéristiques.</p>
            </Link>
            <Link href="/catalogue/best-sellers" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl mr-3 group-hover:bg-primary-200 transition-colors">
                  ⭐
                </div>
                <h4 className="text-xl font-medium text-primary-700">Nos Best-Sellers</h4>
              </div>
              <p className="text-gray-600">Découvrez les parfums les plus populaires de notre collection et laissez-vous séduire par leurs notes.</p>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/catalogue" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-700 hover:bg-primary-800 shadow-md"
          >
            Explorer tous nos parfums
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Conseiller VIP Virtuel | CodeParfum.fr">
      <div className="relative bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
          >
            <h1 className="text-4xl font-serif font-bold tracking-tight text-primary-900 sm:text-5xl md:text-6xl">
              Votre Conseiller VIP Virtuel
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-primary-600">
              Laissez-nous vous guider vers le parfum qui vous correspond parfaitement
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        {!submitted ? (
          <form>
            {renderStep()}
          </form>
        ) : (
          renderResults()
        )}
      </div>
    </Layout>
  );
};

export default ConseillerVirtuelPage; 