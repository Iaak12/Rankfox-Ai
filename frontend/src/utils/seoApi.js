const BASE = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem('token');
}

export async function seoApi(endpoint, body) {
  const res = await fetch(`${BASE}/seo/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}
