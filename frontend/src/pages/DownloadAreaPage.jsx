import { useEffect, useState } from 'react';
import { apiRequest, resolveAssetUrl } from '../api/client';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { localizeField } from '../utils/localize';

export function DownloadAreaPage() {
  const { t, locale } = useLocale();
  const { token } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/files/downloads', { token })
      .then((items) => {
        setDownloads(items);
        setError('');
      })
      .catch((err) => {
        setDownloads([]);
        setError(err.message);
      });
  }, [token]);

  return (
    <section className="container section-spacing">
      <h1>{t('downloadArea')}</h1>
      {error ? <p>{error}</p> : null}

      <ul className="download-list">
        {downloads.map((file) => (
          <li key={file.id}>
            <div>
              <strong>{localizeField(file, 'title', locale)}</strong>
              <p>{file.fileType}</p>
            </div>
            <a href={resolveAssetUrl(file.localPath)} target="_blank" rel="noreferrer">
              {t('downloadAuthorized')}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
