import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigGuard } from './components/ConfigGuard';
import { App } from './App';
import { AuthProvider } from './context/AuthProvider';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <ConfigGuard>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigGuard>
    </BrowserRouter>
  </StrictMode>,
);
