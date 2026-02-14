import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const { locale, switchLocale, t } = useLocale();
  const { user, logout } = useAuth();

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <Link to="/login">{t('login')}</Link>
        <Link to="/designers">{t('designers')}</Link>
        <Link to="/download-area">{t('downloadArea')}</Link>
        <Link to="/catalogues">{t('catalogues')}</Link>
        <a href="#contact">{t('contact')}</a>
      </div>

      <div className="top-bar-right">
        <label htmlFor="lang-select">{t('language')}</label>
        <select
          id="lang-select"
          value={locale}
          onChange={(event) => switchLocale(event.target.value)}
        >
          <option value="ka">{t('georgian')}</option>
          <option value="en">{t('english')}</option>
        </select>

        {user ? (
          <>
            <span className="top-user">{user.fullName}</span>
            <button type="button" className="link-like" onClick={logout}>
              {t('logout')}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
