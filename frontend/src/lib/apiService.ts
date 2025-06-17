/**
 * Service API sécurisé pour le frontend
 * 
 * Gère les appels au backend en incluant automatiquement le token CSRF
 * et en validant les entrées/sorties avec Zod
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { z } from 'zod';
import { csrfTokenSchema } from './validations';

// Configuration de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Création d'une instance Axios avec configuration par défaut
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies (y compris CSRF)
});

// Stockage du token CSRF
let csrfToken: string | null = null;

/**
 * Récupère un token CSRF depuis le serveur
 * @returns Le token CSRF
 */
export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await apiClient.get('/csrf-token');
    const parsed = csrfTokenSchema.safeParse(response.data);
    
    if (!parsed.success) {
      console.error('Format de token CSRF invalide', parsed.error);
      throw new Error('Échec de récupération du token CSRF');
    }
    
    csrfToken = parsed.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error);
    throw new Error('Échec de récupération du token CSRF');
  }
};

/**
 * Effectue une requête API sécurisée avec validation des données
 * @param method Méthode HTTP
 * @param endpoint Point d'entrée de l'API
 * @param data Données à envoyer (optionnel)
 * @param schema Schéma Zod pour valider les données d'entrée (optionnel)
 * @param responseSchema Schéma Zod pour valider la réponse (optionnel)
 * @param config Configuration Axios additionnelle
 * @returns Réponse validée
 */
export async function apiRequest<TInput, TOutput>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  schema?: z.ZodType<TInput>,
  responseSchema?: z.ZodType<TOutput>,
  config: AxiosRequestConfig = {}
): Promise<TOutput> {
  try {
    // Validation des données d'entrée si un schéma est fourni
    if (schema && data) {
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        throw new Error(`Validation des données échouée: ${validationResult.error.message}`);
      }
    }
    
    // Configuration de la requête
    const requestConfig: AxiosRequestConfig = {
      ...config,
      method,
      url: endpoint,
    };
    
    // Pour les requêtes qui modifient des données, on ajoute le token CSRF
    if (method !== 'GET') {
      // Récupère un token CSRF si nécessaire
      const token = await getCsrfToken();
      
      // Ajoute le token CSRF à la configuration
      requestConfig.headers = {
        ...requestConfig.headers,
        'CSRF-Token': token,
        'X-CSRF-Token': token,
      };
      
      // Ajoute les données à la requête
      if (data) {
        requestConfig.data = data;
      }
    } else if (data) {
      // Pour les requêtes GET, on met les données dans les params
      requestConfig.params = data;
    }
    
    // Exécute la requête
    const response: AxiosResponse = await apiClient(requestConfig);
    
    // Validation de la réponse si un schéma est fourni
    if (responseSchema) {
      const validationResult = responseSchema.safeParse(response.data);
      if (!validationResult.success) {
        console.error('Réponse API invalide:', validationResult.error);
        throw new Error('Format de réponse API invalide');
      }
      return validationResult.data;
    }
    
    return response.data;
  } catch (error: any) {
    // Gestion spécifique des erreurs d'autorisation
    if (error.response && error.response.status === 403) {
      console.error('Erreur CSRF ou autorisation:', error.response.data);
      // Force la récupération d'un nouveau token CSRF
      csrfToken = null;
      throw new Error('Session expirée ou invalide. Veuillez réessayer.');
    }
    
    console.error(`Erreur API (${endpoint}):`, error);
    
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
}

// Méthodes d'aide
export const get = <TInput, TOutput>(
  endpoint: string,
  params?: any,
  schema?: z.ZodType<TInput>,
  responseSchema?: z.ZodType<TOutput>
) => apiRequest<TInput, TOutput>('GET', endpoint, params, schema, responseSchema);

export const post = <TInput, TOutput>(
  endpoint: string,
  data: any,
  schema?: z.ZodType<TInput>,
  responseSchema?: z.ZodType<TOutput>
) => apiRequest<TInput, TOutput>('POST', endpoint, data, schema, responseSchema);

export const put = <TInput, TOutput>(
  endpoint: string,
  data: any,
  schema?: z.ZodType<TInput>,
  responseSchema?: z.ZodType<TOutput>
) => apiRequest<TInput, TOutput>('PUT', endpoint, data, schema, responseSchema);

export const del = <TInput, TOutput>(
  endpoint: string,
  data?: any,
  schema?: z.ZodType<TInput>,
  responseSchema?: z.ZodType<TOutput>
) => apiRequest<TInput, TOutput>('DELETE', endpoint, data, schema, responseSchema);
