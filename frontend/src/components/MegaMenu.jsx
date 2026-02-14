import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

export function MegaMenu({ open, onClose, navigation }) {
  const { locale, t } = useLocale();

  if (!open) {
    return null;
  }

  const getName = (item) => (locale === 'ka' ? item.nameKa : item.nameEn);

  return (
    <div className="mega-menu-overlay" onClick={onClose}>
      <aside className="mega-menu" onClick={(event) => event.stopPropagation()}>
        <div className="mega-menu-header">
          <h2>{t('menu')}</h2>
          <button type="button" onClick={onClose}>
            {t('close')}
          </button>
        </div>

        <div className="mega-menu-grid">
          <div>
            <h3>{t('products')}</h3>
            {(navigation?.domains || []).map((domainBlock) => (
              <div key={domainBlock.domain} className="menu-domain-block">
                <h4>{domainBlock.domain === 'indoor' ? t('indoor') : t('outdoor')}</h4>
                <ul>
                  {domainBlock.categories.map((category) => (
                    <li key={category.slug}>
                      <Link to={`/products?category=${category.slug}`} onClick={onClose}>
                        {getName(category)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3>{t('materials')}</h3>
            <p>Fabric Library</p>
            <p>Leather Library</p>

            <h3>{t('collections')}</h3>
            <p>Essentials 2026</p>
            <p>Signature 2026</p>

            <h3>{t('about')}</h3>
            <p>Bowen Story</p>

            <h3>{t('news')}</h3>
            <Link to="/news" onClick={onClose}>
              {t('latestNews')}
            </Link>

            <h3>{t('salesNetwork')}</h3>
            <p>Tbilisi</p>
            <p>Batumi</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
