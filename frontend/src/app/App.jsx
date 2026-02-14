import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { DesignersPage } from '../pages/DesignersPage';
import { NewsPage } from '../pages/NewsPage';
import { CataloguesPage } from '../pages/CataloguesPage';
import { LoginPage } from '../pages/LoginPage';
import { DownloadAreaPage } from '../pages/DownloadAreaPage';
import { AdminPage } from '../pages/AdminPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="designers" element={<DesignersPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsPage />} />
          <Route path="catalogues" element={<CataloguesPage />} />
          <Route path="login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={['authorized_dealer', 'architect', 'press', 'admin']}
              />
            }
          >
            <Route path="download-area" element={<DownloadAreaPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
