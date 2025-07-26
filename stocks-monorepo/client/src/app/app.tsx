import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../stores/AuthStore';
import LoginPage from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Sidebar } from '../components/Sidebar';
import PortfolioPage from '../pages/PortfolioPage';
import { StockDetailPage } from '../pages/StockDetailPage';
import { Spinner } from '../components/Spinner/Spinner';

export const AppRoutes = observer(() => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      {!authStore.user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route
            path="/portfolio"
            element={
              <Sidebar>
                <PortfolioPage />
              </Sidebar>
            }
          />
          <Route
            path="/stock/:symbol"
            element={
              <Sidebar>
                <StockDetailPage />
              </Sidebar>
            }
          />
          <Route path="*" element={<Navigate to="/portfolio" replace />} />
        </>
      )}
    </Routes>
  );
});
