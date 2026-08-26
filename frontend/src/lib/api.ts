import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://mirka-pokorna-api.vercel.app/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// Přidej Bearer token ke každému requestu
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Při 401 automaticky přesměruj na login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/admin/login')
    ) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
