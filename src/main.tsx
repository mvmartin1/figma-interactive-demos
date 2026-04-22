import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './design/base-tokens.css';
import './design/semantic-tokens.css';
import './design/typography.css';
import './design/breakpoints.css';
import './design/reset.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red', fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'white', position: 'fixed', inset: '0', overflow: 'auto', zIndex: 99999 }}>
          <strong>App crash:</strong>{'\n'}{String(error)}{'\n\n'}{(error as Error & { stack?: string }).stack ?? ''}
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
