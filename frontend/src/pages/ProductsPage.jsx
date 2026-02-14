import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { localizeField } from '../utils/localize';

export function ProductsPage() {
  const { locale, t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [designers, setDesigners] = useState([]);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      designer: searchParams.get('designer') || '',
      domain: searchParams.get('domain') || '',
    }),
    [searchParams],
  );

  useEffect(() => {
    apiRequest('/catalog/categories')
      .then(setCategories)
      .catch(() => setCategories([]));

    apiRequest('/catalog/designers-filter')
      .then(setDesigners)
      .catch(() => setDesigners([]));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.search) {
      query.set('search', filters.search);
    }
    if (filters.category) {
      query.set('category', filters.category);
    }
    if (filters.designer) {
      query.set('designer', filters.designer);
    }
    if (filters.domain) {
      query.set('domain', filters.domain);
    }

    apiRequest(`/catalog/products?${query.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [filters]);

  const onFilterChange = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  return (
    <section className="container section-spacing">
      <h1>{t('products')}</h1>

      <div className="filter-panel">
        <h2>{t('filters')}</h2>
        <div className="filter-grid">
          <label>
            {t('search')}
            <input
              value={filters.search}
              onChange={(event) => onFilterChange('search', event.target.value)}
              placeholder={t('searchPlaceholder')}
            />
          </label>

          <label>
            {t('domain')}
            <select
              value={filters.domain}
              onChange={(event) => onFilterChange('domain', event.target.value)}
            >
              <option value="">{t('allDomains')}</option>
              <option value="indoor">{t('indoor')}</option>
              <option value="outdoor">{t('outdoor')}</option>
            </select>
          </label>

          <label>
            {t('category')}
            <select
              value={filters.category}
              onChange={(event) => onFilterChange('category', event.target.value)}
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {localizeField(category, 'name', locale)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t('designer')}
            <select
              value={filters.designer}
              onChange={(event) => onFilterChange('designer', event.target.value)}
            >
              <option value="">{t('allDesigners')}</option>
              {designers.map((designer) => (
                <option key={designer.id} value={designer.slug}>
                  {designer.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {products.length === 0 ? <p>{t('noResults')}</p> : null}

      <div className="grid-3">
        {products.map((product) => (
          <article key={product.id} className="card product-card">
            <img
              src={resolveAssetUrl(product.heroImage)}
              alt={localizeField(product, 'name', locale)}
            />
            <h3>{localizeField(product, 'name', locale)}</h3>
            <p>{localizeField(product, 'description', locale)}</p>
            <div className="meta-row">
              <span>{product.collection}</span>
            </div>
            <Link to={`/products/${product.slug}`}>{t('readMore')}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
