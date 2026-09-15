/**
 * Helper to convert relative upload URLs to full backend URLs
 * e.g. "/uploads/images/xyz.jpg" -> "https://idea-news-backend.onrender.com/uploads/images/xyz.jpg"
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const backend = import.meta.env.VITE_API_BASE_URL || 'https://idea-news-backend.onrender.com';
  return `${backend.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
};
