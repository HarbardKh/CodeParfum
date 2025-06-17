import React from 'react';
import LogService from '../../services/logService';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Mettre à jour l'état pour afficher l'interface de secours
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // En production, consigner l'erreur de façon minimaliste
    // En développement, consigner des informations détaillées pour le débogage
    if (process.env.NODE_ENV === 'production') {
      LogService.error(`ErrorBoundary: ${error.message}`);
    } else {
      LogService.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez personnaliser l'interface de secours
      return (
        <div className="error-boundary">
          <h2>Une erreur s'est produite</h2>
          <p>Nous sommes désolés, quelque chose s'est mal passé.</p>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="btn btn-primary"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
