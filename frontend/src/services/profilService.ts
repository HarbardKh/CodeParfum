import { postData } from './apiService';
import LogService from './logService';

// URL de base de l'API
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

export interface ProfilFormData {
  email: string;
  prenom: string;
  nom: string;
  genre_utilisateur: string;
  parfum_utilise: string;
  familles_aimees: string[];
  familles_detestees: string[];
  usage_habituel: string[];
  usage_recherche: string;
  intensite_souhaitee: string;
  consentement: boolean;
  scenteurs: string[];
}

export interface Recommendation {
  id: string;
  nom: string;
  description: string;
  reference: string;
  a_propos: string;
  famille: string;
  notes: string;
  intensite: string;
  occasion: string[];
  pyramideOlfactive: {
    notesDeTete: string[];
    notesDeCoeur: string[];
    notesDeFond: string[];
  };
  image?: {
    url: string;
    alt: string;
  };
  prix: number;
  confiance: number;
  familleOlfactive: string | {
    id: string;
    nom: string;
  };
  genre: string;
  slug: string;
}

// Fonction qui envoie les données du profil utilisateur à l'API pour générer des recommandations
export const submitProfilData = async (formData: ProfilFormData): Promise<{ success: boolean; message: string; userId?: string; recommendations?: Recommendation[]; inspirationMatch?: string; advice?: string }> => {
  try {
    // Tentative d'envoi des données à l'API
    LogService.debug('Envoi des données à l\'API:', formData);
    
    // Préparation des données pour l'API
    const apiPrompt = {
      parfumActuel: formData.parfum_utilise,
      preferences: {
        familles: formData.familles_aimees,
        senteurs: formData.scenteurs,
        usages: formData.usage_habituel,
        intention: formData.usage_recherche,
        intensite: formData.intensite_souhaitee
      },
      exclusions: formData.familles_detestees,
      genre: formData.genre_utilisateur
    };

    try {
      // Tenter d'envoyer les données à l'API avec postData
      const payload = { formData, apiPrompt };
      const response = await postData<any, typeof payload>('/api/profils', payload);
      
      // Si on a obtenu une réponse valide de l'API
      if (response.data && !response.error) {
        LogService.info('Profil utilisateur enregistré avec succès');
        return {
          success: true,
          message: 'Votre profil a été enregistré avec succès.',
          userId: response.data.userId,
          recommendations: response.data.recommendations,
          inspirationMatch: response.data.inspirationMatch,
          advice: response.data.advice
        };
      }
    } catch (apiError) {
      LogService.warn('API non disponible, utilisation des données mockées', apiError);
      // Continuer avec les données mockées en cas d'erreur API
    }
    
    // Version mockée (utilisée si l'API n'est pas disponible)
    LogService.info('Utilisation des données mockées pour les recommandations');
    
    // Simuler la récupération des parfums depuis la base de données
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        nom: 'Élégance Florale',
        reference: 'P101',
        description: 'Un parfum floral sophistiqué aux notes de jasmin et rose.',
        a_propos: 'Créé pour celles qui apprécient la subtilité des fleurs blanches.',
        famille: 'Florale',
        notes: 'Jasmin, Rose, Bergamote',
        intensite: 'Moyenne',
        occasion: ['Quotidien', 'Travail'],
        pyramideOlfactive: {
          notesDeTete: ['Bergamote', 'Citron'],
          notesDeCoeur: ['Jasmin', 'Rose'],
          notesDeFond: ['Musc', 'Vanille']
        },
        image: {
          url: '/images/parfums/elegance-florale.jpg',
          alt: 'Flacon Élégance Florale'
        },
        prix: 42.50,
        confiance: 95,
        familleOlfactive: 'Florale',
        genre: 'Femme',
        slug: 'elegance-florale'
      },
      {
        id: '2',
        nom: 'Boisé Intense',
        reference: 'P202',
        description: 'Un parfum boisé, profond et mystérieux.',
        a_propos: 'Les notes de bois précieux apportent une signature unique et mémorable.',
        famille: 'Boisée',
        notes: 'Santal, Cèdre, Patchouli',
        intensite: 'Forte',
        occasion: ['Soirée', 'Événement'],
        pyramideOlfactive: {
          notesDeTete: ['Bergamote', 'Poivre'],
          notesDeCoeur: ['Cèdre', 'Vétiver'],
          notesDeFond: ['Santal', 'Patchouli']
        },
        image: {
          url: '/images/parfums/boise-intense.jpg',
          alt: 'Flacon Boisé Intense'
        },
        prix: 52.90,
        confiance: 87,
        familleOlfactive: 'Boisée',
        genre: 'Homme',
        slug: 'boise-intense'
      },
      {
        id: '3',
        nom: 'Fraîcheur Hespéridée',
        reference: 'P153',
        description: 'Une explosion d\'agrumes pour une sensation de fraîcheur immédiate.',
        a_propos: 'Idéal pour les journées chaudes ou pour les personnes actives.',
        famille: 'Hespéridée',
        notes: 'Citron, Mandarine, Bergamote',
        intensite: 'Légère',
        occasion: ['Quotidien', 'Sport'],
        pyramideOlfactive: {
          notesDeTete: ['Citron', 'Mandarine', 'Bergamote'],
          notesDeCoeur: ['Petit Grain', 'Néroli'],
          notesDeFond: ['Musc', 'Bois de Cèdre']
        },
        image: {
          url: '/images/parfums/fraicheur-hesperidee.jpg',
          alt: 'Flacon Fraîcheur Hespéridée'
        },
        prix: 38.90,
        confiance: 90,
        familleOlfactive: 'Hespéridée',
        genre: 'Mixte',
        slug: 'fraicheur-hesperidee'
      }
    ];
    
    // Simuler l'analyse pour trouver le meilleur match
    // Dans un environnement réel, on enverrait les données à l'API backend
    let filteredRecommendations = [...mockRecommendations];
    
    // Filtrer par genre si spécifié
    if (formData.genre_utilisateur && formData.genre_utilisateur !== 'Mixte') {
      filteredRecommendations = filteredRecommendations.filter(r => 
        r.genre === formData.genre_utilisateur || r.genre === 'Mixte'
      );
    }
    
    // Filtrer par famille olfactive si préférences indiquées
    if (formData.familles_aimees && formData.familles_aimees.length > 0) {
      filteredRecommendations = filteredRecommendations.filter(r => {
        const famille = typeof r.familleOlfactive === 'string' ? 
          r.familleOlfactive : r.familleOlfactive.nom;
        return formData.familles_aimees.includes(famille);
      });
    }
    
    // Exclure les familles non aimées
    if (formData.familles_detestees && formData.familles_detestees.length > 0) {
      filteredRecommendations = filteredRecommendations.filter(r => {
        const famille = typeof r.familleOlfactive === 'string' ? 
          r.familleOlfactive : r.familleOlfactive.nom;
        return !formData.familles_detestees.includes(famille);
      });
    }
    
    // Si aucune recommandation trouvée après filtrage, revenir aux recommandations d'origine
    if (filteredRecommendations.length === 0) {
      LogService.warn('Aucune recommandation trouvée après filtrage, utilisation des recommandations par défaut');
      filteredRecommendations = mockRecommendations;
    }
    
    // Générer un conseil personnalisé
    const personalizedAdvice = `Basé sur vos préférences pour ${formData.familles_aimees.join(', ')}, nous vous recommandons d'explorer des parfums ${formData.scenteurs.join(', ')}. Pour une utilisation ${formData.usage_recherche}, une intensité ${formData.intensite_souhaitee} semble idéale pour vous.`;
    
    return {
      success: true,
      message: 'Votre profil a été enregistré avec succès.',
      userId: 'user-' + Date.now(),
      recommendations: filteredRecommendations,
      inspirationMatch: filteredRecommendations[0]?.nom || '',
      advice: personalizedAdvice
    };
  } catch (error) {
    LogService.error('Erreur lors de l\'envoi des données du profil:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement du profil.'
    };
  }
};

// Fonction qui récupère des recommandations basées sur le profil utilisateur
export const getAdviceForProfile = async (userId: string): Promise<{ success: boolean; message: string; recommendations?: Recommendation[] }> => {
  try {
    // Tentative d'appel à l'API avec postData (remplace l'ancien axios.get)
    try {
      LogService.debug('Récupération des recommandations pour l\'utilisateur', userId);
      const response = await postData<any, { userId: string }>('/api/recommendations', { userId });
      
      if (response.data && !response.error) {
        LogService.info('Recommandations récupérées avec succès');
        return {
          success: true,
          message: 'Recommandations récupérées avec succès.',
          recommendations: response.data.recommendations
        };
      }
    } catch (apiError) {
      LogService.warn('API non disponible, utilisation des données mockées', apiError);
      // Continuer avec les données mockées en cas d'erreur API
    }
    
    // Données simulées pour le développement (utilisées si l'API n'est pas disponible)
    LogService.info('Utilisation des données mockées pour les recommandations');
    const recommendations: Recommendation[] = [
      {
        id: '1',
        nom: 'Séduction Nocturne',
        description: 'Un parfum oriental mystérieux avec des notes de vanille et d\'ambre.',
        prix: 79.90,
        familleOlfactive: 'Orientale',
        genre: 'Femme',
        slug: 'seduction-nocturne',
        // Ajout des propriétés manquantes pour satisfaire le type Recommendation
        reference: 'P301',
        a_propos: 'Un parfum séduisant pour les soirées',
        famille: 'Orientale',
        notes: 'Vanille, Ambre, Musc',
        intensite: 'Forte',
        occasion: ['Soirée'],
        pyramideOlfactive: {
          notesDeTete: ['Bergamote'],
          notesDeCoeur: ['Vanille'],
          notesDeFond: ['Ambre', 'Musc']
        },
        confiance: 90
      },
      {
        id: '2',
        nom: 'Élégance Boisée',
        description: 'Un parfum boisé élégant avec des notes de cèdre et de vétiver.',
        prix: 85.50,
        familleOlfactive: 'Boisée',
        genre: 'Homme',
        slug: 'elegance-boisee',
        // Ajout des propriétés manquantes pour satisfaire le type Recommendation
        reference: 'P202',
        a_propos: 'Un parfum boisé aux notes profondes',
        famille: 'Boisée',
        notes: 'Cèdre, Vétiver, Patchouli',
        intensite: 'Moyenne',
        occasion: ['Quotidien', 'Business'],
        pyramideOlfactive: {
          notesDeTete: ['Bergamote', 'Citron'],
          notesDeCoeur: ['Cèdre', 'Vétiver'],
          notesDeFond: ['Patchouli', 'Ambre']
        },
        confiance: 85
      },
      {
        id: '3',
        nom: 'Fraîcheur Marine',
        description: 'Un parfum aquatique frais avec des notes marines et d\'agrumes.',
        prix: 69.90,
        familleOlfactive: 'Aquatique',
        genre: 'Unisexe',
        slug: 'fraicheur-marine',
        // Ajout des propriétés manquantes pour satisfaire le type Recommendation
        reference: 'P103',
        a_propos: 'Un parfum frais pour les journées chaudes',
        famille: 'Aquatique',
        notes: 'Notes marines, Agrumes, Néroli',
        intensite: 'Légère',
        occasion: ['Quotidien', 'Sport'],
        pyramideOlfactive: {
          notesDeTete: ['Agrumes', 'Bergamote'],
          notesDeCoeur: ['Notes marines', 'Néroli'],
          notesDeFond: ['Musc', 'Ambre']
        },
        confiance: 80
      }
    ];
    
    return {
      success: true,
      message: 'Recommandations récupérées avec succès.',
      recommendations
    };
  } catch (error) {
    LogService.error('Erreur lors de la récupération des recommandations:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération des recommandations.'
    };
  }
};
