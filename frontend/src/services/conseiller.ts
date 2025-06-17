interface QuestionnaireReponses {
  famillesOlfactives: string[];
  notesAimees: string[];
  notesDetestees: string[];
  genre: string;
}

interface ParfumRecommande {
  parfum: {
    id: string;
    numeroParf: string;
    inspiration: string;
    genre: string;
    familleOlfactive: any;
    famillePrincipale: string;
    familleSecondaire: string;
    intensite: string;
    occasion: string;
    noteTete: string;
    noteCoeur: string;
    noteFond: string;
    description1: string;
    prix: number;
    slug: string;
    image: any;
  };
  score: number;
  niveau: 'parfait' | 'bon' | 'acceptable' | 'faible';
  details: {
    scoreFamilles: number;
    scoreNotesAimees: number;
    scoreNotesEvitees: number;
    scoreUsage: number;
    genreCompatible: boolean;
  };
}

interface RecommandationsResponse {
  success: boolean;
  message: string;
  data: {
    totalAnalyses: number;
    totalCompatibles: number;
    recommendations: ParfumRecommande[];
    statistiques: {
      categories: {
        parfaites: number;
        bonnes: number;
        faibles: number;
        inadaptees: number;
      };
      scoreMoyen: number;
      scoreMax: number;
      totalAnalyses: number;
      totalCompatibles: number;
    };
  };
}

export class ConseillerService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  /**
   * Envoie les réponses du questionnaire au backend pour obtenir des recommandations
   */
  static async obtenirRecommandations(reponses: QuestionnaireReponses): Promise<RecommandationsResponse> {
    try {
      console.log('🎯 Envoi des réponses au système de scoring:', reponses);

      // Récupérer le token CSRF
      const csrfResponse = await fetch(`${this.BASE_URL}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!csrfResponse.ok) {
        throw new Error('Impossible d\'obtenir le token CSRF');
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;

      // Appel à l'API de scoring
      const response = await fetch(`${this.BASE_URL}/api/conseiller/recommandations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(reponses)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data: RecommandationsResponse = await response.json();
      
      console.log('✅ Recommandations reçues:', {
        totalRecommandations: data.data.recommendations.length,
        scoreMoyen: data.data.statistiques.scoreMoyen,
        scoreMax: data.data.statistiques.scoreMax
      });

      return data;

    } catch (error) {
      console.error('Erreur lors de l\'obtention des recommandations:', error);
      throw error;
    }
  }

  /**
   * Teste le système de scoring avec des données d'exemple
   */
  static async testerScoring(): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/conseiller/test-scoring`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Erreur lors du test de scoring:', error);
      throw error;
    }
  }

  /**
   * Formate les niveaux de recommandation pour l'affichage
   */
  static formaterNiveauRecommandation(niveau: string): {
    label: string;
    color: string;
    icon: string;
    description: string;
  } {
    switch (niveau) {
      case 'parfait':
        return {
          label: 'Parfait pour vous',
          color: 'bg-green-100 text-green-800',
          icon: '🎯',
          description: 'Correspond parfaitement à vos goûts'
        };
      case 'bon':
        return {
          label: 'Très bon choix',
          color: 'bg-blue-100 text-blue-800',
          icon: '👍',
          description: 'Excellente compatibilité avec vos préférences'
        };
      case 'acceptable':
        return {
          label: 'Choix acceptable',
          color: 'bg-yellow-100 text-yellow-800',
          icon: '👌',
          description: 'Pourrait vous convenir'
        };
      case 'faible':
        return {
          label: 'Moins adapté',
          color: 'bg-gray-100 text-gray-800',
          icon: '🤔',
          description: 'Compatibilité limitée'
        };
      default:
        return {
          label: 'Non évalué',
          color: 'bg-gray-100 text-gray-600',
          icon: '❓',
          description: 'Évaluation non disponible'
        };
    }
  }

  /**
   * Convertit les identifiants de familles olfactives en noms lisibles
   */
  static mapperFamillesOlfactives(familleIds: string[]): string[] {
    const mapping: {[key: string]: string} = {
      'hesperidee': 'Hespéridée',
      'floral': 'Florale', 
      'fougere': 'Fougère',
      'chypree': 'Chyprée',
      'boisee': 'Boisée',
      'aromatique': 'Aromatique',
      'orientale': 'Orientale'
    };

    return familleIds.map(id => mapping[id] || id);
  }



  /**
   * Convertit l'identifiant de genre en nom lisible
   */
  static mapperGenre(genreId: string): string {
    const mapping: {[key: string]: string} = {
      'homme': 'Homme',
      'femme': 'Femme',
      'mixte': 'Mixte'
    };

    return mapping[genreId] || genreId;
  }
}

export type { QuestionnaireReponses, ParfumRecommande, RecommandationsResponse }; 