/**
 * Logger spécialisé pour l'automatisation Chogan
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN', 
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: string;
}

export class ChoganLogger {
  private static instance: ChoganLogger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Limite de logs en mémoire

  private constructor() {}

  public static getInstance(): ChoganLogger {
    if (!ChoganLogger.instance) {
      ChoganLogger.instance = new ChoganLogger();
    }
    return ChoganLogger.instance;
  }

  private formatMessage(level: LogLevel, module: string, message: string, data?: any, error?: Error): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined,
      error: error ? error.stack : undefined
    };

    // Ajouter à la collection
    this.logs.push(logEntry);
    
    // Maintenir la limite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    return logEntry;
  }

  private log(level: LogLevel, module: string, message: string, data?: any, error?: Error): void {
    const logEntry = this.formatMessage(level, module, message, data, error);
    
    // Console output avec émojis pour plus de lisibilité
    const emoji = this.getEmoji(level);
    const formattedMessage = `${emoji} [${level}] [${module}] ${message}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, data ? '\n' + JSON.stringify(data, null, 2) : '', error ? '\n' + error.stack : '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data ? '\n' + JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data ? '\n' + JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data ? '\n' + JSON.stringify(data, null, 2) : '');
        break;
    }
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return '❌';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.DEBUG: return '🔍';
      default: return '📝';
    }
  }

  // Méthodes publiques
  public error(module: string, message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, module, message, data, error);
  }

  public warn(module: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, module, message, data);
  }

  public info(module: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, module, message, data);
  }

  public debug(module: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, module, message, data);
  }

  // Méthodes spécialisées pour Chogan
  public sessionStart(orderId?: string): void {
    this.info('CHOGAN_SESSION', 'Début de session d\'automatisation', { orderId });
  }

  public sessionEnd(success: boolean, orderId?: string, link?: string): void {
    if (success) {
      this.info('CHOGAN_SESSION', 'Session terminée avec succès', { orderId, link });
    } else {
      this.error('CHOGAN_SESSION', 'Session échouée', { orderId });
    }
  }

  public httpRequest(method: string, url: string, status?: number, data?: any): void {
    this.debug('CHOGAN_HTTP', `${method} ${url}`, { status, data });
  }

  public httpError(method: string, url: string, error: Error, status?: number): void {
    this.error('CHOGAN_HTTP', `Erreur ${method} ${url}`, { status }, error);
  }

  public productAdded(productRef: string, quantity: number, success: boolean): void {
    if (success) {
      this.info('CHOGAN_PRODUCT', `Produit ajouté: ${productRef} x${quantity}`);
    } else {
      this.error('CHOGAN_PRODUCT', `Échec ajout produit: ${productRef} x${quantity}`);
    }
  }

  public clientSubmitted(clientEmail: string, success: boolean): void {
    if (success) {
      this.info('CHOGAN_CLIENT', `Client soumis: ${clientEmail}`);
    } else {
      this.error('CHOGAN_CLIENT', `Échec soumission client: ${clientEmail}`);
    }
  }

  // Récupérer les logs récents
  public getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Récupérer les logs par niveau
  public getLogsByLevel(level: LogLevel, count: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.level === level)
      .slice(-count);
  }

  // Récupérer les logs par module
  public getLogsByModule(module: string, count: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.module === module)
      .slice(-count);
  }

  // Nettoyer les logs
  public clearLogs(): void {
    this.logs = [];
    this.info('LOGGER', 'Logs nettoyés');
  }

  // Statistiques des logs
  public getStats(): { [key in LogLevel]: number } & { total: number } {
    const stats = {
      [LogLevel.ERROR]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.DEBUG]: 0,
      total: this.logs.length
    };

    this.logs.forEach(log => {
      stats[log.level]++;
    });

    return stats;
  }
}

// Instance singleton
export const choganLogger = ChoganLogger.getInstance(); 