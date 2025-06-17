import { postData, ApiError } from './apiService';
import LogService from './logService';

/**
 * Service pour générer des conseils personnalisés via l'API OpenAI sécurisée
 */

export interface UserPreferences {
  parfumHabitude?: string;
  familles?: string[];
  intensite?: string;
  occasions?: string[];
}

export interface Perfume {
  id: string;
  name: string;
  reference: string;
  gender: string;
  famille_olfactive: string;
  intensite: string;
  description?: string;
}

export interface ConseilResponse {
  conseil: string;
}

/**
 * Valide les entrées utilisateur avant de les envoyer à l'API
 */
const validateInputs = (
  filteredPerfumes: Perfume[],
  userPrefs: UserPreferences
): { valid: boolean; error?: string } => {
  // Vérifier que nous avons des parfums
  if (!filteredPerfumes || !Array.isArray(filteredPerfumes) || filteredPerfumes.length === 0) {
    return { valid: false, error: 'Aucun parfum sélectionné pour la recommandation' };
  }
  
  // Maximum 8 parfums pour éviter les abus de l'API
  if (filteredPerfumes.length > 8) {
    return { valid: false, error: 'Trop de parfums sélectionnés (maximum: 8)' };
  }
  
  // Vérifier que les préférences utilisateur sont un objet
  if (!userPrefs || typeof userPrefs !== 'object') {
    return { valid: false, error: 'Préférences utilisateur invalides' };
  }
  
  // Vérification des champs sensibles
  for (const perfume of filteredPerfumes) {
    if (!perfume.reference || !perfume.name) {
      return { valid: false, error: 'Informations de parfum incomplètes' };
    }
  }
  
  return { valid: true };
};

/**
 * Génère un conseil personnalisé via le proxy API sécurisé (backend)
 * @param filteredPerfumes Les parfums sélectionnés pour la recommandation
 * @param userPrefs Les préférences utilisateur
 * @returns Le conseil personnalisé généré
 */
export const generateConseil = async (
  filteredPerfumes: Perfume[],
  userPrefs: UserPreferences,
  maxRetries = 2
): Promise<{ conseil?: string; error?: string }> => {
  // Validation des entrées
  const validation = validateInputs(filteredPerfumes, userPrefs);
  if (!validation.valid) {
    LogService.warn('Validation échouée pour la génération de conseil:', validation.error);
    return { error: validation.error || 'Données invalides pour la génération du conseil' };
  }

  // Préparation des données pour le backend (uniquement les champs nécessaires)
  const perfumesToSend = filteredPerfumes.map(p => ({
    reference: p.reference,
    name: p.name,
    gender: p.gender,
    famille_olfactive: p.famille_olfactive,
    intensite: p.intensite,
    description: p.description?.substring(0, 100) || ''
  }));
  
  LogService.debug('Envoi de la demande de conseil au backend', {
    parfumsCount: perfumesToSend.length,
    userPrefs
  });
  
  // URL de l'API backend
  const apiUrl = '/api/generate-conseil';
  
  let currentTry = 0;
  let lastError = '';
  
  // Tentatives avec retry
  while (currentTry <= maxRetries) {
    try {
      const response = await postData<ConseilResponse, { 
        filteredPerfumes: any; 
        userPrefs: UserPreferences 
      }>(
        apiUrl,
        {
          filteredPerfumes: perfumesToSend,
          userPrefs
        },
        {
          timeout: 15000, // 15 secondes pour permettre au modèle IA de générer la réponse
        }
      );
      
      // Si pas d'erreur, retourner le conseil
      if (!response.error && response.data) {
        LogService.info('Conseil personnalisé généré avec succès');
        return { conseil: response.data.conseil };
      }
      
      // Enregistrer l'erreur pour le retry
      lastError = response.error?.message || 'Erreur lors de la génération du conseil';
      
      // Si c'est une erreur de timeout ou réseau, on retente
      if (response.error?.isTimeoutError || response.error?.isNetworkError) {
        currentTry++;
        
        // Attendre avant la prochaine tentative (exponential backoff)
        if (currentTry <= maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, currentTry - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          LogService.warn(`Tentative ${currentTry}/${maxRetries} pour générer un conseil...`);
          continue;
        }
      } else {
        // Si c'est une autre erreur (comme 400, 500), ne pas retenter
        LogService.error('Erreur lors de la génération du conseil:', response.error);
        return { error: lastError };
      }
    } catch (error) {
      // Erreur inattendue
      lastError = error instanceof Error ? error.message : 'Erreur inconnue';
      LogService.error('Erreur inattendue lors de la génération du conseil:', error);
      
      currentTry++;
      
      // Attendre avant la prochaine tentative
      if (currentTry <= maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, currentTry - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        LogService.warn(`Tentative ${currentTry}/${maxRetries} pour générer un conseil...`);
        continue;
      }
    }
  }
  
  // Si toutes les tentatives ont échoué
  return { error: `Échec de la génération du conseil après ${maxRetries + 1} tentatives: ${lastError}` };
}; 