/**
 * Contoh penggunaan S3 Base URL Replacement
 * 
 * File ini menunjukkan bagaimana menggunakan fitur replace URL Minio
 * untuk mengganti base URL dengan custom URL dari environment variable
 */

const { 
  replaceMinioBaseUrl, 
  replaceMinioBaseUrlInString, 
  getCustomBaseUrl,
  autoReplaceMinioUrl,
  autoReplaceMinioUrlInString 
} = require('../src/utils/url-replacer');

const { updateDatabaseUrl, updateMultipleDatabaseUrls } = require('../src/utils/database-url-updater');

// Set environment variable untuk testing
process.env.S3_BASE_URL = 'https://minio-bucket.motorsights.com';

console.log('=== Contoh Penggunaan S3 Base URL Replacement ===\n');

// 1. Manual URL Replacement
console.log('1. Manual URL Replacement:');
const originalUrl = 'http://127.0.0.1:9508/msi-e-catalogue/catalog-images/1760592348165_7410a5ca-c43c-47b4-acec-512c20e975e5_testdebug2.jpg';
const customBaseUrl = 'https://minio-bucket.motorsights.com';

const newUrl = replaceMinioBaseUrl(originalUrl, customBaseUrl);
console.log('Original URL:', originalUrl);
console.log('New URL:', newUrl);
console.log('');

// 2. Auto URL Replacement menggunakan Environment
console.log('2. Auto URL Replacement menggunakan Environment:');
const autoReplacedUrl = autoReplaceMinioUrl(originalUrl);
console.log('Auto replaced URL:', autoReplacedUrl);
console.log('');

// 3. Replace multiple URLs dalam string
console.log('3. Replace multiple URLs dalam string:');
const urlString = 'Image 1: http://127.0.0.1:9508/bucket/image1.jpg, Image 2: http://127.0.0.1:9508/bucket/image2.jpg';
const replacedString = autoReplaceMinioUrlInString(urlString);
console.log('Original string:', urlString);
console.log('Replaced string:', replacedString);
console.log('');

// 4. Update Database URL
console.log('4. Update Database URL:');
const databaseUrl = 'http://127.0.0.1:9508/msi-e-catalogue/user-photos/avatar.jpg';
const updatedDatabaseUrl = updateDatabaseUrl(databaseUrl);
console.log('Database URL:', databaseUrl);
console.log('Updated URL:', updatedDatabaseUrl);
console.log('');

// 5. Update Multiple Fields dalam Object
console.log('5. Update Multiple Fields dalam Object:');
const productData = {
  id: 1,
  name: 'Product Name',
  image: 'http://127.0.0.1:9508/msi-e-catalogue/products/product.jpg',
  thumbnail: 'http://127.0.0.1:9508/msi-e-catalogue/products/thumb.jpg',
  gallery: 'http://127.0.0.1:9508/msi-e-catalogue/products/gallery1.jpg,http://127.0.0.1:9508/msi-e-catalogue/products/gallery2.jpg'
};

const updatedProductData = updateMultipleDatabaseUrls(productData, ['image', 'thumbnail', 'gallery']);
console.log('Original data:', JSON.stringify(productData, null, 2));
console.log('Updated data:', JSON.stringify(updatedProductData, null, 2));
console.log('');

// 6. Get Custom Base URL dari Environment
console.log('6. Get Custom Base URL dari Environment:');
const customBaseUrlFromEnv = getCustomBaseUrl();
console.log('Custom base URL from environment:', customBaseUrlFromEnv);
console.log('');

// 7. Contoh dengan URL yang berbeda format
console.log('7. Contoh dengan URL yang berbeda format:');
const urls = [
  'http://127.0.0.1:9508/bucket/file.jpg',
  'https://127.0.0.1:9508/bucket/file.jpg',
  'http://localhost:9508/bucket/file.jpg',
  'https://localhost:9508/bucket/file.jpg',
  'http://127.0.0.1:9508/bucket/file.jpg?param=value&other=123',
  'http://127.0.0.1:9508/bucket/file.jpg#section'
];

urls.forEach((url, index) => {
  const replaced = autoReplaceMinioUrl(url);
  console.log(`${index + 1}. ${url} -> ${replaced}`);
});
console.log('');

// 8. Contoh Error Handling
console.log('8. Contoh Error Handling:');
const invalidUrls = [
  'invalid-url',
  '',
  null,
  undefined,
  'not-a-minio-url.com/file.jpg'
];

invalidUrls.forEach((url, index) => {
  const replaced = autoReplaceMinioUrl(url);
  console.log(`${index + 1}. "${url}" -> "${replaced}"`);
});
console.log('');

console.log('=== Contoh Penggunaan Selesai ===');

// Clean up environment variable
delete process.env.S3_BASE_URL;
