import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Middleware de journalisation des événements de sécurité
 * Enregistre les tentatives d'accès non autorisées et autres événements de sécurité
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Capture la réponse originale
  const originalSend = res.send;
  const originalStatus = res.status;
  let statusCode: number;

  // Intercepte la méthode status
  res.status = function(code: number) {
    statusCode = code;
    return originalStatus.apply(res, [code]);
  };

  // Intercepte la méthode send pour logger les erreurs de sécurité
  res.send = function(body) {
    // On ne s'intéresse qu'aux codes d'erreur de sécurité (401, 403, 429)
    if (statusCode === 401 || statusCode === 403 || statusCode === 429) {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      const method = req.method;
      const url = req.originalUrl || req.url;
      
      // Prépare l'entrée de log
      const logEntry = {
        timestamp,
        ip,
        userAgent,
        method,
        url,
        statusCode,
        userId: (req as any)?.user?.id || 'anonymous',
        message: typeof body === 'string' ? body : 
                JSON.stringify(body).substring(0, 200) // Limite la taille des logs
      };

      // Détermine le type d'événement de sécurité
      let eventType = 'ACCESS_DENIED';
      if (statusCode === 401) eventType = 'UNAUTHORIZED';
      else if (statusCode === 429) eventType = 'RATE_LIMIT';

      // Formate l'entrée de log
      const logMessage = `[SECURITY][${eventType}] ${timestamp} | IP: ${ip} | User: ${logEntry.userId} | ${method} ${url} | Status: ${statusCode}\n`;
      
      // Chemin du fichier de log
      const logDir = path.resolve(__dirname, '../../logs');
      const logFile = path.join(logDir, 'security.log');
      
      // Crée le dossier logs s'il n'existe pas
      if (!fs.existsSync(logDir)) {
        try {
          fs.mkdirSync(logDir, { recursive: true });
        } catch (err) {
          console.error('Impossible de créer le dossier de logs:', err);
        }
      }
      
      // Écrit dans le fichier de log
      fs.appendFile(logFile, logMessage, (err) => {
        if (err) console.error('Erreur d\'écriture dans le fichier de log:', err);
      });
      
      // Log également dans la console en développement
      if (process.env.NODE_ENV !== 'production') {
        console.warn(logMessage);
      }
    }
    
    // Renvoie la réponse originale avec typage correct
    return originalSend.call(res, body);
  };
  
  next();
};

/**
 * Fonction utilitaire pour logger manuellement un événement de sécurité
 */
export const logSecurityEvent = (eventType: string, message: string, userId: string = 'system') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[SECURITY][${eventType}] ${timestamp} | User: ${userId} | ${message}\n`;
  
  // Chemin du fichier de log
  const logDir = path.resolve(__dirname, '../../logs');
  const logFile = path.join(logDir, 'security.log');
  
  // Crée le dossier logs s'il n'existe pas
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (err) {
      console.error('Impossible de créer le dossier de logs:', err);
      return;
    }
  }
  
  // Écrit dans le fichier de log
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Erreur d\'écriture dans le fichier de log:', err);
  });
  
  // Log également dans la console en développement
  if (process.env.NODE_ENV !== 'production') {
    console.warn(logMessage);
  }
};
