import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import LogService from './logService';

// Configuration et validation des variables d'environnement
// Validation de l'URL de l'API avec URL par défaut en développement seulement
const validateApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!envUrl) {
    LogService.warn('NEXT_PUBLIC_SERVER_URL n\'est pas défini, utilisation de l\'URL par défaut');
    return 'http://localhost:3002';
  }
  try {
    // Test simple de validation d'URL
    new URL(envUrl);
    return envUrl;
  } catch (e) {
    LogService.error('NEXT_PUBLIC_SERVER_URL contient une URL invalide:', envUrl);
    return 'http://localhost:3002';
  }
};

// URL de base de l'API validée
export const API_URL = validateApiUrl();

// Récupération des paramètres depuis les variables d'environnement ou valeurs par défaut
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 15000; // 15 secondes
const MAX_RETRIES = Number(process.env.NEXT_PUBLIC_MAX_API_RETRIES) || 2;
const RETRY_DELAY_BASE = 1000; // 1 seconde de délai de base

// Types pour les erreurs API
export interface ApiError {
  status: number;
  message: string;
  details?: any;
  isServerError?: boolean;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
  retryCount?: number;
}

// Liste des mots-clés sensibles à masquer dans les logs et erreurs
export const SENSITIVE_KEYWORDS = [
  'password', 'mot_de_passe', 'secret', 'apikey', 'api_key', 
  'token', 'auth', 'key', 'credential'
];

// Configuration Axios avec les paramètres validés
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction utilitaire pour le délai exponentiel adapté au type d'erreur
const exponentialDelay = (retryCount: number, error?: any): number => {
  // Délai de base augmenté pour les erreurs 429 (rate limiting)
  let baseDelay = RETRY_DELAY_BASE;
  
  // Si l'erreur est 429 (Too Many Requests), augmenter significativement le délai
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    // Récupérer le temps d'attente conseillé dans les headers si disponible
    const retryAfter = error.response.headers['retry-after'];
    if (retryAfter && !isNaN(Number(retryAfter))) {
      return Number(retryAfter) * 1000; // Convertir en millisecondes
    }
    
    // Sinon utiliser un délai de base plus long pour les 429
    baseDelay = 3000; // 3 secondes minimum pour les erreurs de rate limiting
  }
  
  // Delay augmente exponentiellement: 3s, 6s, 12s, etc. pour les 429
  // ou 1s, 2s, 4s, etc. pour les autres erreurs
  return Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 secondes
};

// Vérifier si une erreur est liée au réseau ou timeout et peut être retentée
const isRetryableError = (error: any): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Erreurs de connexion ou timeout
    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      return true;
    }
    
    // Pas de réponse du serveur
    if (!axiosError.response) {
      return true;
    }
    
    // Erreurs serveur (5xx) qui peuvent être temporaires
    if (axiosError.response && axiosError.response.status >= 500 && axiosError.response.status < 600) {
      return true;
    }
    
    // Erreur 429 (trop de requêtes) - ajouté pour gérer le rate limiting
    if (axiosError.response && axiosError.response.status === 429) {
      return true;
    }
  }
  
  return false;
};

// Fonction pour masquer les informations sensibles
const sanitizeErrorDetails = (details: any): any => {
  if (!details || typeof details !== 'object') return details;
  
  const sanitized = Array.isArray(details) ? [...details] : { ...details };
  
  // Parcourir les clés pour masquer les valeurs sensibles
  if (!Array.isArray(sanitized)) {
    for (const key of Object.keys(sanitized)) {
      // Si la clé contient un mot sensible
      if (SENSITIVE_KEYWORDS.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey.toLowerCase()))
      ) {
        sanitized[key] = '[REDACTED]';
      } 
      // Récursion pour les objets imbriqués
      else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = sanitizeErrorDetails(sanitized[key]);
      }
    }
  }
  
  return sanitized;
};

// Fonction de gestion des erreurs standardisée avec masquage des données sensibles
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Erreur de réseau (pas de connexion à l'API)
    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      LogService.error('Erreur de timeout ou de connexion à l\'API:', axiosError.message);
      return {
        status: 0,
        message: 'Le serveur met trop de temps à répondre. Veuillez réessayer plus tard.',
        isTimeoutError: true,
      };
    }
    
    if (!axiosError.response) {
      LogService.error('Erreur réseau lors de la connexion à l\'API:', axiosError.message);
      return {
        status: 0,
        message: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.',
        isNetworkError: true,
      };
    }
    
    // Erreur côté serveur (5xx)
    if (axiosError.response.status >= 500) {
      LogService.error('Erreur serveur:', axiosError.response.status);
      return {
        status: axiosError.response.status,
        message: 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
        details: sanitizeErrorDetails(axiosError.response.data),
        isServerError: true,
      };
    }
    
    // Erreur de requête (4xx)
    LogService.warn('Erreur de requête:', axiosError.response.status);
    return {
      status: axiosError.response.status,
      message: axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data 
        ? (axiosError.response.data as { message: string }).message 
        : 'Une erreur est survenue lors de la requête.',
      details: sanitizeErrorDetails(axiosError.response.data),
    };
  }
  
  // Autres types d'erreurs
  LogService.error('Erreur non-Axios:', error);
  return {
    status: 0,
    message: typeof error === 'object' && error !== null && 'message' in error 
      ? (error as { message: string }).message 
      : 'Une erreur inconnue est survenue.',
    details: sanitizeErrorDetails(error),
  };
};

// Fonction utilitaire pour ajouter un délai entre les requêtes pour éviter rate limiting
const STAGGER_DELAY = 200; // 200ms entre les requêtes pour éviter le rate limiting
let lastRequestTime = 0;

async function staggerRequest() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // Si la dernière requête était récente, ajouter un délai
  if (timeSinceLastRequest < STAGGER_DELAY && lastRequestTime !== 0) {
    const delayNeeded = STAGGER_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delayNeeded));
  }
  
  // Mettre à jour le timestamp de la dernière requête
  lastRequestTime = Date.now();
}

// Fonction générique pour les requêtes avec retry automatique
async function makeRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  data?: any,
  config: AxiosRequestConfig = {},
  retryCount = 0
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    // Ajouter un délai entre les requêtes pour éviter le rate limiting
    await staggerRequest();
    
    let response: AxiosResponse<T>;
    
    switch (method) {
      case 'get':
        response = await api.get<T>(endpoint, config);
        break;
      case 'post':
        response = await api.post<T>(endpoint, data, config);
        break;
      case 'put':
        response = await api.put<T>(endpoint, data, config);
        break;
      case 'delete':
        response = await api.delete<T>(endpoint, config);
        break;
      default:
        throw new Error(`Méthode non supportée: ${method}`);
    }
    
    return { data: response.data, error: null };
  } catch (error) {
    // Vérifier si l'erreur peut être retentée
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      // Log différent pour les erreurs 429
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        LogService.warn(`Rate Limiting (429) pour ${endpoint}, attente avant nouvelle tentative ${retryCount + 1}/${MAX_RETRIES}...`);
      } else {
        LogService.warn(`Tentative ${retryCount + 1}/${MAX_RETRIES} échouée pour ${endpoint}, nouvelle tentative...`);
      }
      
      // Attendre avec backoff exponentiel adapté au type d'erreur
      await new Promise(resolve => setTimeout(resolve, exponentialDelay(retryCount, error)));
      
      // Nouvelle tentative avec compteur incrémenté
      return makeRequest<T>(method, endpoint, data, config, retryCount + 1);
    }
    
    // Gestion de l'erreur finale
    const apiError = handleApiError(error);
    apiError.retryCount = retryCount;
    return { data: null, error: apiError };
  }
}

// Fonction générique pour les requêtes GET avec gestion d'erreur et valeur par défaut
export async function fetchData<T>(
  endpoint: string, 
  config?: AxiosRequestConfig,
  defaultValue?: T
): Promise<{ data: T | null; error: ApiError | null }> {
  const result = await makeRequest<T>('get', endpoint, undefined, config);
  
  // Si une valeur par défaut est fournie et qu'il y a une erreur, on utilise la valeur par défaut
  if (result.error && defaultValue !== undefined) {
    LogService.warn(`Erreur récupérée, utilisation des données par défaut pour ${endpoint}`, result.error);
    return { data: defaultValue, error: result.error };
  }
  
  return result;
}

// Fonction pour POST avec retry automatique
export async function postData<T, D>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<{ data: T | null; error: ApiError | null }> {
  return makeRequest<T>('post', endpoint, data, config);
}

// Fonction pour PUT avec retry automatique
export async function updateData<T, D>(
  endpoint: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<{ data: T | null; error: ApiError | null }> {
  return makeRequest<T>('put', endpoint, data, config);
}

// Fonction pour DELETE avec retry automatique
export async function deleteData<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<{ data: T | null; error: ApiError | null }> {
  return makeRequest<T>('delete', endpoint, undefined, config);
}

// Fonction pour vérifier l'état de l'API
export async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await api.get('/api/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    LogService.error('Erreur lors de la vérification de l\'état de l\'API:', error);
    return false;
  }
}

export default api;
