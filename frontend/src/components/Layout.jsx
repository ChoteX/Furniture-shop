import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { MegaMenu } from './MegaMenu';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../api/client';

export function Layout() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState(null);

  useEffect(() => {
    apiRequest('/catalog/navigation')
      .then(setNavigation)
      .catch(() => setNavigation(null));
  }, []);

  return (
    <div className="app-shell">
      <TopBar />

      <header className="main-header">
        <Link to="/" className="brand-mark">
          {t('brand')}
        </Link>

        <nav className="main-nav">
          <NavLink to="/products">{t('products')}</NavLink>
          <NavLink to="/designers">{t('designers')}</NavLink>
          <NavLink to="/news">{t('news')}</NavLink>
          <NavLink to="/catalogues">{t('catalogues')}</NavLink>
          <NavLink to="/download-area">{t('downloadArea')}</NavLink>
          {user?.role === 'admin' ? <NavLink to="/admin">{t('admin')}</NavLink> : null}
        </nav>

        <button type="button" className="menu-button" onClick={() => setMenuOpen(true)}>
          {t('menu')}
        </button>
      </header>

      <MegaMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigation={navigation}
      />

      <main>
        <Outlet />
      </main>

      <footer id="contact" className="site-footer">
        <p>{t('footer')}</p>
        <p>Email: hello@bowen.ge</p>
      </footer>
    </div>
  );
}
