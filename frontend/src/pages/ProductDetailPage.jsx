import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { localizeField } from '../utils/localize';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { locale, t } = useLocale();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    apiRequest(`/catalog/products/${slug}`)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [slug]);

  if (!product) {
    return <section className="container section-spacing">{t('noResults')}</section>;
  }

  return (
    <section className="container section-spacing detail-layout">
      <img
        src={resolveAssetUrl(product.heroImage)}
        alt={localizeField(product, 'name', locale)}
        className="detail-image"
      />

      <div>
        <h1>{localizeField(product, 'name', locale)}</h1>
        <p>{localizeField(product, 'description', locale)}</p>
        <p>{product.collection}</p>

        <h3>{t('designer')}</h3>
        <p>{product.designers?.map((designer) => designer.name).join(', ')}</p>

        <h3>{t('category')}</h3>
        <p>{product.categories?.map((category) => localizeField(category, 'name', locale)).join(', ')}</p>

        <h3>{t('downloadArea')}</h3>
        <ul className="simple-list">
          {(product.files || []).map((file) => (
            <li key={file.id}>
              <a href={resolveAssetUrl(file.localPath)} target="_blank" rel="noreferrer">
                {localizeField(file, 'title', locale)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
