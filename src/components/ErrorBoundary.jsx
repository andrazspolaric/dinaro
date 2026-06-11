import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 'calc(100vh / var(--viewport-zoom, 1))', gap: 24,
          fontFamily: "'Inter', sans-serif", padding: 32, textAlign: 'center',
        }}>
          <p style={{ fontSize: 48, fontWeight: 600, color: '#044352' }}>Something went wrong</p>
          <p style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)', maxWidth: 480 }}>
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#044352', color: 'white', border: 'none',
              padding: '16px 40px', borderRadius: 40, fontSize: 16,
              fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
