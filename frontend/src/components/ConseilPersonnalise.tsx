import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '@/services/apiService';

interface Parfum {
  id: string;
  reference: string;
  name: string;
  price: number;
  gender: string;
  volume: string;
  famille_olfactive: string;
  famille_principale: string;
  famille_secondaire: string;
  intensite: string;
  occasion: string;
  inspiration: string;
  description: string;
  a_propos: string;
  conseil: string;
  pyramideOlfactive: {
    head: string[];
    heart: string[];
    base: string[];
  };
  tags: string[];
}

interface UserPreferences {
  parfumHabitude?: string;
  familles?: string[];
  intensite?: string;
  occasions?: string[];
}

interface PerfumesResponse {
  perfumes: Parfum[];
}

interface ConseilResponse {
  conseil: string;
}

const ConseilPersonnalise: React.FC = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [parfums, setPerfums] = useState<Parfum[]>([]);
  const [loading, setLoading] = useState(true);
  const [conseilPersonnalise, setConseilPersonnalise] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les préférences utilisateur depuis localStorage
  useEffect(() => {
    try {
      const parfumHabitude = localStorage.getItem('parfumHabitude') || '';
      const familles = JSON.parse(localStorage.getItem('familles') || '[]');
      const intensite = localStorage.getItem('intensite') || '';
      const occasions = JSON.parse(localStorage.getItem('occasions') || '[]');

      setUserPreferences({
        parfumHabitude,
        familles,
        intensite,
        occasions
      });
      
      fetchPerfumes();
    } catch (err) {
      console.error('Erreur lors de la récupération des préférences:', err);
      setError('Impossible de récupérer vos préférences. Veuillez réessayer.');
      setLoading(false);
    }
  }, []);

  // Récupérer les données des parfums
  const fetchPerfumes = async () => {
    try {
      const { data, error } = await fetchData<PerfumesResponse>(
        '/data/perfumes.json'
      );
      
      if (error || !data) {
        throw new Error('Impossible de récupérer les données des parfums');
      }
      
      setPerfums(data.perfumes);
    } catch (err) {
      console.error('Erreur lors de la récupération des parfums:', err);
      setError('Impossible de charger les données des parfums. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Générer le prompt pour OpenAI
  const generatePrompt = (preferences: UserPreferences, parfumsList: Parfum[]) => {
    // Créer une version simplifiée de la liste de parfums pour éviter un prompt trop long
    const simplifiedPerfumes = parfumsList.map(p => ({
      id: p.id,
      reference: p.reference,
      name: p.name,
      gender: p.gender,
      famille_olfactive: p.famille_olfactive,
      intensite: p.intensite,
      occasion: p.occasion,
      inspiration: p.inspiration,
      description: p.description.substring(0, 150) + '...' // Limiter la taille
    }));

    return `
    Tu es un expert en parfumerie et copywriting. Tu dois générer un texte personnalisé à afficher sur une page web de conseils olfactifs. Le contenu doit être basé uniquement sur les données réelles issues de la liste de parfums fournie ci-dessous, qui contient des parfums de la marque Chogan.
    
    Voici les données saisies par l'utilisateur dans un formulaire :
    - Parfum habituel : ${preferences.parfumHabitude || '(non renseigné)'}
    - Familles olfactives préférées : ${preferences.familles?.join(', ') || '(non renseigné)'}
    - Intensité recherchée : ${preferences.intensite || '(non renseigné)'}
    - Occasions d'utilisation : ${preferences.occasions?.join(', ') || '(non renseigné)'}
    
    Voici les règles de génération du contenu :
    1. **Si un parfum habituel est renseigné** :
       - Rechercher un parfum Chogan dans la liste qui s'en inspire (même famille olfactive, ambiance similaire, intensité proche)
       - Présenter ce parfum avec un storytelling subtil, **sans jamais mentionner qu'il s'agit d'une imitation**
       - Expliquer pourquoi ce parfum pourrait plaire, en lien avec celui que la personne utilise déjà
    
    2. **Ensuite, recommander 1 à 3 autres parfums** basés sur les préférences renseignées (familles, intensité, occasion) :
       - Ces parfums doivent venir **exclusivement de la liste fournie**
       - Expliquer en quelques lignes pourquoi chacun est adapté
       - Toujours utiliser un ton chaleureux, vendeur, inspiré des descriptions de parfumeries haut de gamme
    
    3. **Structure claire du texte de sortie** :
       - Titre : "Votre conseil personnalisé"
       - Section 1 (si parfum habituel renseigné) : "🌿 Selon vos habitudes"
       - Section 2 : "💫 Selon vos préférences olfactives"
       - Chaque section doit contenir un ou plusieurs blocs avec **nom du parfum**, **description émotionnelle/storytelling**, et **argumentaire olfactif**
       - Ne jamais mentionner un parfum qui n'existe pas dans la liste fournie
    
    Si aucune correspondance n'est possible, le dire poliment ("Nous n'avons pas trouvé de parfum correspondant parfaitement à vos critères, mais…").
    
    Voici la liste des parfums disponibles :
    ${JSON.stringify(simplifiedPerfumes)}
    `;
  };

  // Appeler l'API OpenAI lorsque les données sont prêtes
  useEffect(() => {
    const callOpenAI = async () => {
      if (!userPreferences || parfums.length === 0 || loading) return;

      try {
        setLoading(true);
        const prompt = generatePrompt(userPreferences, parfums);
        
        const { data, error } = await postData<ConseilResponse, { prompt: string }>(
          '/api/generateConseil',
          { prompt },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (error || !data) {
          throw new Error('Erreur lors de l\'appel à l\'API: ' + (error?.message || 'Réponse inattendue'));
        }

        if (data.conseil) {
          setConseilPersonnalise(data.conseil);
        } else {
          throw new Error('Réponse inattendue de l\'API');
        }
      } catch (err) {
        console.error('Erreur lors de l\'appel à l\'API:', err);
        setError('Impossible de générer votre conseil personnalisé. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    callOpenAI();
  }, [userPreferences, parfums, loading]);

  if (loading) {
    return (
      <div className="conseil-container">
        <h1>Votre conseil personnalisé</h1>
        <div className="loading">
          <p>Nous analysons vos préférences pour vous proposer les parfums idéaux...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conseil-container">
        <h1>Votre conseil personnalisé</h1>
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.href = '/Guide-Conseil/Conseiller-Virtuel'}>
            Retour au formulaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conseil-container">
      <h1>Votre conseil personnalisé</h1>
      
      {conseilPersonnalise ? (
        <div 
          className="conseil-content" 
          dangerouslySetInnerHTML={{ __html: conseilPersonnalise.replace(/\n/g, '<br/>') }}
        />
      ) : (
        <div className="no-results">
          <p>Nous n'avons pas trouvé de parfum correspondant parfaitement à vos critères.</p>
          <p>Veuillez ajuster vos préférences et réessayer.</p>
          <button onClick={() => window.location.href = '/Guide-Conseil/Conseiller-Virtuel'}>
            Retour au formulaire
          </button>
        </div>
      )}
    </div>
  );
};

export default ConseilPersonnalise; 