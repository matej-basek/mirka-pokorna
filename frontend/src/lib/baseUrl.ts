export const getApiBaseUrl = () => {
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

export const getBaseUrl = () => {
  return getApiBaseUrl().replace('/api', '');
};

export const getImageSrc = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${getBaseUrl()}${url}`;
};
