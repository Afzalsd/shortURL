const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return body.data;
}

export const api = {
  createUrl: (payload) => request('/urls', { method: 'POST', body: JSON.stringify(payload) }),
  listUrls: (limit = 10) => request(`/urls?limit=${limit}`),
  getStats: (shortcode) => request(`/urls/${shortcode}/stats`)
};
