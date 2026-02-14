import { useEffect, useState } from 'react';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { localizeField } from '../utils/localize';

export function CataloguesPage() {
  const { locale, t } = useLocale();
  const { token, isAuthenticated } = useAuth();
  const [catalogues, setCatalogues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const request = isAuthenticated
      ? apiRequest('/files/catalogues', { token })
      : apiRequest('/catalog/catalogues');

    request
      .then((data) => {
        setCatalogues(data);
        setError('');
      })
      .catch((err) => {
        setCatalogues([]);
        setError(err.message);
      });
  }, [isAuthenticated, token]);

  return (
    <section className="container section-spacing">
      <h1>{t('catalogues')}</h1>
      {error ? <p>{error}</p> : null}

      <div className="grid-3">
        {catalogues.map((catalogue) => (
          <article key={catalogue.id} className="card">
            <img
              src={resolveAssetUrl(catalogue.coverImage)}
              alt={localizeField(catalogue, 'title', locale)}
            />
            <h3>{localizeField(catalogue, 'title', locale)}</h3>
            <p>
              {catalogue.type} / {catalogue.year}
            </p>
            <span className="badge">
              {catalogue.visibility === 'public' ? t('publicAccess') : t('restrictedAccess')}
            </span>
            <a
              href={resolveAssetUrl(catalogue.pdf.localPath)}
              target="_blank"
              rel="noreferrer"
            >
              {localizeField(catalogue.pdf, 'title', locale)}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
