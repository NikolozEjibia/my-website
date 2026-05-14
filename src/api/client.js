const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('hd_token');

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` })
    },
    ...options
  });

  return res.json();
};

export const auth = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
};

export const tickets = {
  create: (data) =>
    request('/tickets', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  list: () => request('/tickets')
};