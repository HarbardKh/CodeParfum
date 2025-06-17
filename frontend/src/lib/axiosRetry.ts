import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration par défaut pour les nouvelles tentatives
export interface RetryConfig {
  // Nombre maximal de tentatives
  maxRetries: number;
  // Délai initial entre les tentatives (ms)
  initialRetryDelay: number;
  // Facteur de backoff exponentiel
  backoffFactor: number;
  // Jitter maximal (variation aléatoire pour éviter les requêtes synchronisées)
  maxJitter: number;
  // Timeout de la requête (ms)
  timeout: number;
  // Codes HTTP qui déclenchent une nouvelle tentative
  retryStatusCodes: number[];
  // Liste d'endpoints à ne pas réessayer
  doNotRetryEndpoints?: string[];
}

// Configuration par défaut
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialRetryDelay: 1000,
  backoffFactor: 2,
  maxJitter: 500,
  timeout: 20000, // 20 secondes
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  doNotRetryEndpoints: []
};

// Fonction pour ajouter un délai
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour calculer le délai de backoff avec jitter
const calculateBackoff = (retryCount: number, config: RetryConfig): number => {
  const backoffTime = config.initialRetryDelay * Math.pow(config.backoffFactor, retryCount);
  const jitter = Math.random() * config.maxJitter;
  return backoffTime + jitter;
};

// Création d'une instance axios avec logique de retry
export const createRetryClient = (
  baseURL: string, 
  customConfig: Partial<RetryConfig> = {}
): AxiosInstance => {
  // Fusionner la configuration par défaut et la configuration personnalisée
  const config: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...customConfig };
  
  // Créer l'instance axios
  const instance = axios.create({
    baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Ajouter l'intercepteur de requête pour la logique de retry
  instance.interceptors.response.use(
    // Cas de succès - retourner directement la réponse
    (response: AxiosResponse) => response,
    // Cas d'erreur - gérer la logique de retry
    async (error: AxiosError) => {
      const { config: axiosConfig, response } = error;
      
      // Si la configuration de la requête n'existe pas, rejeter l'erreur
      if (!axiosConfig) {
        return Promise.reject(error);
      }

      // Variables pour gérer la logique de retry
      const url = axiosConfig.url || '';
      const retryCount = axiosConfig.headers['x-retry-count'] ? 
        parseInt(axiosConfig.headers['x-retry-count'] as string, 10) : 0;
      
      // Vérifier si on doit réessayer cette requête
      const shouldNotRetryEndpoint = config.doNotRetryEndpoints?.some(endpoint => url.includes(endpoint));
      const isRetryableStatusCode = response && config.retryStatusCodes.includes(response.status);
      const isNetworkError = !response && error.message.includes('Network Error');
      const isTimeoutError = !response && error.code === 'ECONNABORTED';
      
      const canRetry = 
        !shouldNotRetryEndpoint && 
        retryCount < config.maxRetries && 
        (isRetryableStatusCode || isNetworkError || isTimeoutError);

      // Si on peut réessayer
      if (canRetry) {
        const nextRetryCount = retryCount + 1;
        const backoffTime = calculateBackoff(retryCount, config);
        
        console.log(
          `🔄 Réessai ${nextRetryCount}/${config.maxRetries} pour ${url} ` +
          `dans ${Math.round(backoffTime/1000)}s. ` +
          `Code: ${response?.status || 'Network Error'}`
        );
        
        // Attendre le temps calculé avant de réessayer
        await delay(backoffTime);
        
        // Préparer la nouvelle requête avec le compteur incrémenté
        const newConfig = {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'x-retry-count': nextRetryCount.toString()
          }
        };
        
        // Réessayer la requête
        return instance(newConfig);
      }
      
      // Si on ne peut pas réessayer, rejeter avec l'erreur originale
      console.error(
        `❌ Échec définitif après ${retryCount} réessai(s) pour ${url}. ` +
        `Code: ${response?.status || error.message || 'Unknown error'}`
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

// Créer une instance par défaut pour l'API du backend
export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
export const resilientApiClient = createRetryClient(API_URL);

// Fonction utilitaire pour récupérer des données avec l'API résiliente
export async function fetchWithRetry<T>(
  endpoint: string, 
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {}
): Promise<T | null> {
  try {
    const response = await resilientApiClient.get<T>(endpoint, { 
      params,
      ...config
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur après plusieurs tentatives sur ${endpoint}:`, error);
    return null;
  }
}

// Fonction utilitaire pour poster des données avec l'API résiliente
export async function postWithRetry<T>(
  endpoint: string, 
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T | null> {
  try {
    const response = await resilientApiClient.post<T>(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur après plusieurs tentatives sur ${endpoint}:`, error);
    return null;
  }
}
