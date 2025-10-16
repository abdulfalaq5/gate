/**
 * Utility untuk replace base URL Minio
 * Mengganti URL default dengan custom base URL dari environment
 */

/**
 * Replace base URL dari Minio URL dengan custom base URL
 * @param {string} originalUrl - URL asli dari Minio
 * @param {string} customBaseUrl - Base URL custom dari environment
 * @returns {string} - URL yang sudah direplace
 */
const replaceMinioBaseUrl = (originalUrl, customBaseUrl) => {
  if (!originalUrl || !customBaseUrl) {
    return originalUrl;
  }

  // Check apakah originalUrl adalah string yang valid
  if (typeof originalUrl !== 'string' || originalUrl.trim() === '') {
    return originalUrl;
  }

  try {
    // Parse URL asli untuk mendapatkan path dan query
    const url = new URL(originalUrl);
    
    // Parse custom base URL
    const baseUrl = new URL(customBaseUrl);
    
    // Buat URL baru dengan custom base URL tapi tetap menggunakan path dari URL asli
    const newUrl = `${baseUrl.protocol}//${baseUrl.host}${url.pathname}${url.search}`;
    
    return newUrl;
  } catch (error) {
    // Jika URL tidak valid, return original URL tanpa error logging
    return originalUrl;
  }
};

/**
 * Replace base URL untuk multiple URLs dalam string
 * Berguna untuk field database yang berisi multiple URLs
 * @param {string} urlString - String yang berisi URL(s)
 * @param {string} customBaseUrl - Base URL custom dari environment
 * @returns {string} - String dengan URL yang sudah direplace
 */
const replaceMinioBaseUrlInString = (urlString, customBaseUrl) => {
  if (!urlString || !customBaseUrl) {
    return urlString;
  }

  // Regex untuk mencari URL yang mengandung endpoint Minio
  const minioUrlRegex = /https?:\/\/[^\/]+\/[^\/]+\/[^\s,]+/g;
  
  return urlString.replace(minioUrlRegex, (match) => {
    return replaceMinioBaseUrl(match, customBaseUrl);
  });
};

/**
 * Get custom base URL dari environment variables
 * @returns {string|null} - Custom base URL atau null jika tidak ada
 */
const getCustomBaseUrl = () => {
  return process.env.S3_BASE_URL || process.env.MINIO_BASE_URL || null;
};

/**
 * Replace URL otomatis menggunakan environment variable
 * @param {string} originalUrl - URL asli dari Minio
 * @returns {string} - URL yang sudah direplace jika ada custom base URL
 */
const autoReplaceMinioUrl = (originalUrl) => {
  const customBaseUrl = getCustomBaseUrl();
  if (!customBaseUrl) {
    return originalUrl;
  }
  
  return replaceMinioBaseUrl(originalUrl, customBaseUrl);
};

/**
 * Replace URL dalam string otomatis menggunakan environment variable
 * @param {string} urlString - String yang berisi URL(s)
 * @returns {string} - String dengan URL yang sudah direplace
 */
const autoReplaceMinioUrlInString = (urlString) => {
  const customBaseUrl = getCustomBaseUrl();
  if (!customBaseUrl) {
    return urlString;
  }
  
  return replaceMinioBaseUrlInString(urlString, customBaseUrl);
};

module.exports = {
  replaceMinioBaseUrl,
  replaceMinioBaseUrlInString,
  getCustomBaseUrl,
  autoReplaceMinioUrl,
  autoReplaceMinioUrlInString
};
