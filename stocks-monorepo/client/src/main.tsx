import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/App';
import { AuthStoreProvider } from './stores/AuthStore';
import { PortfolioStoreProvider } from './stores/PortfolioStore';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthStoreProvider>
      <PortfolioStoreProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PortfolioStoreProvider>
    </AuthStoreProvider>
  </React.StrictMode>
);
