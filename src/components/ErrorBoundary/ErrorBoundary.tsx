import React from 'react';
import './ErrorBoundary.css';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <h2>Algo deu errado</h2>
            <p>Ocorreu um erro inesperado. Verifique o console para detalhes.</p>
            <div className="error-boundary__actions">
              <button onClick={this.handleReload}>Recarregar página</button>
            </div>
            {this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
                <summary>Detalhes do erro</summary>
                {String(this.state.error.stack || this.state.error.message)}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
