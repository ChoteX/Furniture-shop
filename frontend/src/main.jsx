import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { LocaleProvider } from './contexts/LocaleContext';
import { AuthProvider } from './contexts/AuthContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocaleProvider>
  </StrictMode>,
);
