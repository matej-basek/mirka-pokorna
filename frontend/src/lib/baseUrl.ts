export const getApiBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }
  // Vždy natvrdo směřujeme na funkční Vercel backend API v produkci
  return 'https://mirka-pokorna-api.vercel.app/api';
};

export const getBaseUrl = () => {
  return getApiBaseUrl().replace('/api', '');
};

export const getImageSrc = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${getBaseUrl()}${url}`;
};
