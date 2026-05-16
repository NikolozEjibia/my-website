const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('hd_token');

async function request(method, path, body, requireAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const get   = (path)       => request('GET',    path);
const post  = (path, body) => request('POST',   path, body);
const patch = (path, body) => request('PATCH',  path, body);
const del   = (path)       => request('DELETE', path);

export const auth = {
  login:    (email, password) => post('/auth/login',    { email, password }),
  register: (name, email, password, role) => post('/auth/register', { name, email, password, role }),
  me:       () => get('/auth/me'),
};

export const tickets = {
  // Guest ticket (no auth needed)
  createGuest: (body) => fetch(`${BASE}/tickets/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; }),

  list:   (params = {}) => get('/tickets?' + new URLSearchParams(params).toString()),
  stats:  ()            => get('/tickets/stats'),
  get:    (id)          => get(`/tickets/${id}`),
  create: (body)        => post('/tickets', body),
  update: (id, body)    => patch(`/tickets/${id}`, body),
  delete: (id)          => del(`/tickets/${id}`),
};

export const comments = {
  list:   (ticketId)       => get(`/tickets/${ticketId}/comments`),
  add:    (ticketId, body) => post(`/tickets/${ticketId}/comments`, { body }),
  delete: (ticketId, cId)  => del(`/tickets/${ticketId}/comments/${cId}`),
};

export const users = {
  agents:   ()          => get('/users'),
  get:      (id)        => get(`/users/${id}`),
  update:   (id, body)  => patch(`/users/${id}`, body),
  create:   (body)      => post('/users/create', body),
  delete:   (id)        => del(`/users/${id}`),
};
