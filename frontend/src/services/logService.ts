import * as Sentry from '@sentry/browser';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Lecture du niveau de log depuis les variables d'environnement
const environmentLogLevel = process.env.NEXT_PUBLIC_LOG_LEVEL;
const currentLogLevel = environmentLogLevel 
  ? parseInt(environmentLogLevel, 10) 
  : process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG;

// Garder un historique des logs en mémoire pour le débogage (seulement en développement)
const logHistory: {level: LogLevel, message: string, data: any[], timestamp: Date}[] = [];
const MAX_LOG_HISTORY = process.env.NODE_ENV === 'production' ? 0 : 100;

// Initialisation de Sentry uniquement en production
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production'
  });
}

/**
 * Service centralisé de gestion des logs
 * Permet de contrôler l'affichage des logs selon l'environnement
 */
export const LogService = {
  debug: (message: string, ...data: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
    
    // Ajouter au journal interne
    addToLogHistory(LogLevel.DEBUG, message, data);
  },
  
  info: (message: string, ...data: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...data);
    }
    
    // Ajouter au journal interne
    addToLogHistory(LogLevel.INFO, message, data);
  },
  
  warn: (message: string, ...data: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...data);
    }
    
    // Ajouter au journal interne
    addToLogHistory(LogLevel.WARN, message, data);
  },
  
  error: (message: string, ...data: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...data);
    }
    
    // Ajouter au journal interne
    addToLogHistory(LogLevel.ERROR, message, data);
    
    // Envoyer à Sentry en production
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(data[0] instanceof Error ? data[0] : new Error(message));
    }
  }
};

// Fonction pour ajouter un log à l'historique
const addToLogHistory = (level: LogLevel, message: string, data: any[]) => {
  const logEntry = {level, message, data, timestamp: new Date()};
  logHistory.push(logEntry);
  if (logHistory.length > MAX_LOG_HISTORY) {
    logHistory.shift();
  }
};

// Fonction pour exporter les logs (utile pour le débogage)
export const exportLogs = () => {
  return JSON.stringify(logHistory);
};

export default LogService; 