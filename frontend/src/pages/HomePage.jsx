import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { localizeField } from '../utils/localize';

export function HomePage() {
  const { locale, t } = useLocale();
  const [news, setNews] = useState([]);

  useEffect(() => {
    apiRequest('/news')
      .then((items) => setNews(items.slice(0, 3)))
      .catch(() => setNews([]));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">BOWEN GEORGIA</p>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">
              {t('exploreProducts')}
            </Link>
            <Link to="/catalogues" className="btn-secondary">
              {t('browseCatalogues')}
            </Link>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <h2>{t('latestNews')}</h2>
        <div className="grid-3">
          {news.map((item) => (
            <article key={item.id} className="card">
              <img
                src={resolveAssetUrl(item.heroImage)}
                alt={localizeField(item, 'title', locale)}
              />
              <h3>{localizeField(item, 'title', locale)}</h3>
              <p>{localizeField(item, 'excerpt', locale)}</p>
              <Link to={`/news/${item.slug}`}>{t('readMore')}</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
