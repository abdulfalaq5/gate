/**
 * Test untuk URL replacer utility
 */

const { 
  replaceMinioBaseUrl, 
  replaceMinioBaseUrlInString, 
  getCustomBaseUrl,
  autoReplaceMinioUrl,
  autoReplaceMinioUrlInString 
} = require('../src/utils/url-replacer');

// Run tests jika file dipanggil langsung
if (require.main === module) {
  console.log('Running URL Replacer Tests...');
  
  // Simple test runner
  const tests = [
    {
      name: 'replaceMinioBaseUrl - basic replacement',
      test: () => {
        const result = replaceMinioBaseUrl(
          'http://127.0.0.1:9508/bucket/file.jpg',
          'https://minio-bucket.motorsights.com'
        );
        return result === 'https://minio-bucket.motorsights.com/bucket/file.jpg';
      }
    },
    {
      name: 'replaceMinioBaseUrlInString - multiple URLs',
      test: () => {
        const result = replaceMinioBaseUrlInString(
          'http://127.0.0.1:9508/bucket/img1.jpg,http://127.0.0.1:9508/bucket/img2.jpg',
          'https://minio-bucket.motorsights.com'
        );
        return result === 'https://minio-bucket.motorsights.com/bucket/img1.jpg,https://minio-bucket.motorsights.com/bucket/img2.jpg';
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    try {
      if (test.test()) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
}
