import { useEffect, useState } from 'react';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';

export function DesignersPage() {
  const { locale, t } = useLocale();
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    apiRequest('/designers')
      .then(setDesigners)
      .catch(() => setDesigners([]));
  }, []);

  return (
    <section className="container section-spacing">
      <h1>{t('designers')}</h1>
      <div className="grid-3">
        {designers.map((designer) => (
          <article key={designer.id} className="card">
            <img src={resolveAssetUrl(designer.photoPath)} alt={designer.name} />
            <h3>{designer.name}</h3>
            <p>{locale === 'ka' ? designer.bioKa : designer.bioEn}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
