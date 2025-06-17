import React from 'react';
import { ApiError } from '../../services/apiService';

interface ErrorAlertProps {
  error: ApiError | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, className = '' }) => {
  if (!error) return null;
  
  // Convertir l'erreur en objet si c'est une chaîne
  const errorObj = typeof error === 'string' 
    ? { status: 0, message: error } 
    : error;
  
  return (
    <div className={`bg-red-50 border border-red-200 text-red-800 rounded-md p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{errorObj.message}</h3>
          {errorObj.isNetworkError && (
            <div className="mt-2 text-sm">
              <p>Vérifiez votre connexion internet ou réessayez plus tard.</p>
            </div>
          )}
          {errorObj.isTimeoutError && (
            <div className="mt-2 text-sm">
              <p>Le serveur met trop de temps à répondre. Veuillez réessayer ultérieurement.</p>
            </div>
          )}
          {errorObj.isServerError && (
            <div className="mt-2 text-sm">
              <p>Une erreur est survenue sur notre serveur. Notre équipe technique a été notifiée.</p>
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
