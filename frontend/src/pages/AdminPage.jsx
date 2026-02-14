/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import { localizeField } from '../utils/localize';

export function AdminPage() {
  const { token } = useAuth();
  const { t, locale } = useLocale();

  const [approvals, setApprovals] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');

  const [newsForm, setNewsForm] = useState({
    titleKa: '',
    titleEn: '',
    excerptKa: '',
    excerptEn: '',
    contentKa: '',
    contentEn: '',
    category: 'general',
    heroImage: '/static/images/news-showroom.svg',
    publishImmediately: true,
  });

  const loadData = useCallback(async () => {
    try {
      const [pendingApprovals, userList, newsList] = await Promise.all([
        apiRequest('/admin/approvals?status=pending', { token }),
        apiRequest('/admin/users', { token }),
        apiRequest('/admin/news', { token }),
      ]);

      setApprovals(pendingApprovals);
      setUsers(userList);
      setNews(newsList);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const review = async (id, action) => {
    await apiRequest(`/admin/approvals/${id}/review`, {
      token,
      method: 'POST',
      body: { action },
    });

    await loadData();
  };

  const publishToggle = async (id, published) => {
    await apiRequest(`/admin/news/${id}/${published ? 'unpublish' : 'publish'}`, {
      token,
      method: 'PATCH',
    });

    await loadData();
  };

  const createNews = async (event) => {
    event.preventDefault();

    await apiRequest('/admin/news', {
      token,
      method: 'POST',
      body: newsForm,
    });

    setNewsForm((prev) => ({
      ...prev,
      titleKa: '',
      titleEn: '',
      excerptKa: '',
      excerptEn: '',
      contentKa: '',
      contentEn: '',
    }));

    await loadData();
  };

  return (
    <section className="container section-spacing admin-grid">
      <h1>{t('adminPanel')}</h1>
      {error ? <p className="error-text">{error}</p> : null}

      <article className="panel">
        <h2>{t('approvals')}</h2>
        <ul className="simple-list">
          {approvals.map((approval) => (
            <li key={approval.id} className="approval-item">
              <div>
                <strong>{approval.user.fullName}</strong>
                <p>
                  {approval.user.email} / {approval.requestedRoleCode}
                </p>
              </div>
              <div className="action-row">
                <button type="button" onClick={() => review(approval.id, 'approve')}>
                  {t('approve')}
                </button>
                <button type="button" onClick={() => review(approval.id, 'reject')}>
                  {t('reject')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="panel">
        <h2>{t('users')}</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('fullName')}</th>
              <th>{t('email')}</th>
              <th>{t('role')}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="panel">
        <h2>{t('createNews')}</h2>
        <form className="form-card" onSubmit={createNews}>
          <label>
            {t('titleKa')}
            <input
              value={newsForm.titleKa}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, titleKa: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('titleEn')}
            <input
              value={newsForm.titleEn}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, titleEn: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('excerptKa')}
            <textarea
              value={newsForm.excerptKa}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, excerptKa: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('excerptEn')}
            <textarea
              value={newsForm.excerptEn}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, excerptEn: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('contentKa')}
            <textarea
              value={newsForm.contentKa}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, contentKa: event.target.value }))
              }
              required
            />
          </label>

          <label>
            {t('contentEn')}
            <textarea
              value={newsForm.contentEn}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, contentEn: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Category
            <input
              value={newsForm.category}
              onChange={(event) =>
                setNewsForm((prev) => ({ ...prev, category: event.target.value }))
              }
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={newsForm.publishImmediately}
              onChange={(event) =>
                setNewsForm((prev) => ({
                  ...prev,
                  publishImmediately: event.target.checked,
                }))
              }
            />
            {t('publishNow')}
          </label>

          <button type="submit" className="btn-primary">
            {t('save')}
          </button>
        </form>
      </article>

      <article className="panel">
        <h2>{t('news')}</h2>
        <ul className="simple-list">
          {news.map((item) => (
            <li key={item.id} className="approval-item">
              <div>
                <strong>{localizeField(item, 'title', locale)}</strong>
                <p>
                  {item.category} / {item.published ? t('published') : t('unpublished')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => publishToggle(item.id, item.published)}
              >
                {item.published ? t('unpublish') : t('publish')}
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
