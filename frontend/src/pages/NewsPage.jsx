import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { localizeField } from '../utils/localize';

function NewsListing() {
  const { locale, t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);

  const category = searchParams.get('category') || '';
  const year = searchParams.get('year') || '';

  useEffect(() => {
    const query = new URLSearchParams();
    if (category) {
      query.set('category', category);
    }
    if (year) {
      query.set('year', year);
    }

    apiRequest(`/news?${query.toString()}`)
      .then(setItems)
      .catch(() => setItems([]));
  }, [category, year]);

  const years = useMemo(() => {
    const values = new Set(
      items
        .map((item) => item.publishedAt)
        .filter(Boolean)
        .map((date) => new Date(date).getFullYear()),
    );
    return [...values].sort((a, b) => b - a);
  }, [items]);

  const categories = [...new Set(items.map((item) => item.category))];

  const updateParam = (key, value) => {
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
      <h1>{t('news')}</h1>

      <div className="filter-panel compact">
        <label>
          {t('category')}
          <select value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="">{t('allCategories')}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select value={year} onChange={(event) => updateParam('year', event.target.value)}>
            <option value="">All</option>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid-3">
        {items.map((item) => (
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
  );
}

function NewsDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const [item, setItem] = useState(null);

  useEffect(() => {
    apiRequest(`/news/${slug}`)
      .then(setItem)
      .catch(() => setItem(null));
  }, [slug]);

  if (!item) {
    return <section className="container section-spacing">Not found.</section>;
  }

  return (
    <section className="container section-spacing detail-layout">
      <img
        src={resolveAssetUrl(item.heroImage)}
        alt={localizeField(item, 'title', locale)}
        className="detail-image"
      />
      <article>
        <h1>{localizeField(item, 'title', locale)}</h1>
        <p>{new Date(item.publishedAt || item.updatedAt).toLocaleDateString()}</p>
        <p>{localizeField(item, 'content', locale)}</p>
      </article>
    </section>
  );
}

export function NewsPage() {
  const { slug } = useParams();
  if (slug) {
    return <NewsDetail />;
  }
  return <NewsListing />;
}
