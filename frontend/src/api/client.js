const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_ORIGIN = new URL(API_BASE, window.location.origin).origin;

export async function apiRequest(path, options = {}) {
  const { token, method = 'GET', body } = options;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = data?.message
      ? Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message
      : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function getApiBase() {
  return API_BASE;
}

export function resolveAssetUrl(path) {
  if (!path) {
    return '';
  }

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${API_ORIGIN}${path}`;
  }

  return `${API_ORIGIN}/${path}`;
}
