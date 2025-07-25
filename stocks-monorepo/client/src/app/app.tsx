import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../stores/AuthStore';
import LoginPage from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import Sidebar from '../components/Sidebar';
import PortfolioPage from '../pages/PortfolioPage';
import StockDetailPage from '../pages/StockDetailPage';
import { Spinner } from '../components/Spinner/Spinner';

export const AppRoutes = observer(() => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    return <Spinner />;
  }

  if (!authStore.user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
          <Route path="*" element={<Navigate to="/portfolio" replace />} />
        </Routes>
      </div>
    </div>
  );
});
