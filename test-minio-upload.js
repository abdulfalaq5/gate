/**
 * Test script untuk MinIO Upload functionality
 * Jalankan dengan: node test-minio-upload.js
 */

const fs = require('fs');
const path = require('path');
const {
  uploadToMinio,
  uploadToMinioPrivate,
  deleteFromMinio,
  getSignedUrl,
  getFileInfo,
  listFiles,
  fileExists,
  isMinioEnabled
} = require('./src/config/minio');

async function testMinioUpload() {
  console.log('=== MinIO Upload Test ===\n');
  
  // Check if MinIO is enabled
  console.log(`MinIO Enabled: ${isMinioEnabled}`);
  if (!isMinioEnabled) {
    console.log('MinIO is disabled. Please check your environment configuration.');
    return;
  }

  try {
    const bucketName = process.env.S3_BUCKET || 'msi-interview';
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testContent = 'This is a test file for MinIO upload functionality.';
    const buffer = Buffer.from(testContent, 'utf8');

    console.log(`Testing upload to bucket: ${bucketName}`);
    console.log(`Test file name: ${testFileName}\n`);

    // Test 1: Upload to public bucket
    console.log('1. Testing public upload...');
    const publicUploadResult = await uploadToMinio(
      bucketName,
      `test/public/${testFileName}`,
      buffer,
      'text/plain'
    );

    if (publicUploadResult.success) {
      console.log('✅ Public upload successful');
      console.log(`   URL: ${publicUploadResult.url}`);
      console.log(`   Bucket: ${publicUploadResult.bucket}`);
      console.log(`   Object: ${publicUploadResult.object}`);
    } else {
      console.log('❌ Public upload failed:', publicUploadResult.error);
    }

    // Test 2: Upload to private bucket
    console.log('\n2. Testing private upload...');
    const privateUploadResult = await uploadToMinioPrivate(
      bucketName,
      `test/private/${testFileName}`,
      buffer,
      'text/plain'
    );

    if (privateUploadResult.success) {
      console.log('✅ Private upload successful');
      console.log(`   URL: ${privateUploadResult.url}`);
      console.log(`   Bucket: ${privateUploadResult.bucket}`);
      console.log(`   Object: ${privateUploadResult.object}`);
    } else {
      console.log('❌ Private upload failed:', privateUploadResult.error);
    }

    // Test 3: Get file info
    console.log('\n3. Testing file info...');
    const fileInfo = await getFileInfo(bucketName, `test/public/${testFileName}`);
    if (fileInfo) {
      console.log('✅ File info retrieved');
      console.log(`   Size: ${fileInfo.size} bytes`);
      console.log(`   Content Type: ${fileInfo.contentType}`);
      console.log(`   Last Modified: ${fileInfo.lastModified}`);
    } else {
      console.log('❌ Failed to get file info');
    }

    // Test 4: Check if file exists
    console.log('\n4. Testing file exists check...');
    const exists = await fileExists(bucketName, `test/public/${testFileName}`);
    console.log(`File exists: ${exists ? '✅ Yes' : '❌ No'}`);

    // Test 5: Generate signed URL for private file
    console.log('\n5. Testing signed URL generation...');
    const signedUrl = await getSignedUrl(bucketName, `test/private/${testFileName}`, 3600, true);
    if (signedUrl) {
      console.log('✅ Signed URL generated');
      console.log(`   URL: ${signedUrl}`);
    } else {
      console.log('❌ Failed to generate signed URL');
    }

    // Test 6: List files
    console.log('\n6. Testing list files...');
    const files = await listFiles(bucketName, 'test/');
    console.log(`✅ Found ${files.length} files in test/ directory`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name} (${file.size} bytes)`);
    });

    // Test 7: Delete test files
    console.log('\n7. Testing file deletion...');
    const deletePublic = await deleteFromMinio(bucketName, `test/public/${testFileName}`);
    const deletePrivate = await deleteFromMinio(bucketName, `test/private/${testFileName}`, true);
    
    console.log(`Public file deleted: ${deletePublic.success ? '✅ Yes' : '❌ No'}`);
    console.log(`Private file deleted: ${deletePrivate.success ? '✅ Yes' : '❌ No'}`);

    console.log('\n=== Test Completed ===');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Test dengan file gambar
async function testImageUpload() {
  console.log('\n=== Image Upload Test ===\n');
  
  if (!isMinioEnabled) {
    console.log('MinIO is disabled. Skipping image test.');
    return;
  }

  try {
    const bucketName = process.env.S3_BUCKET || 'msi-interview';
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const testImageName = `test-image-${Date.now()}.png`;

    console.log(`Testing image upload to bucket: ${bucketName}`);
    console.log(`Test image name: ${testImageName}\n`);

    const imageUploadResult = await uploadToMinio(
      bucketName,
      `test/images/${testImageName}`,
      testImageBuffer,
      'image/png'
    );

    if (imageUploadResult.success) {
      console.log('✅ Image upload successful');
      console.log(`   URL: ${imageUploadResult.url}`);
    } else {
      console.log('❌ Image upload failed:', imageUploadResult.error);
    }

    // Clean up
    await deleteFromMinio(bucketName, `test/images/${testImageName}`);
    console.log('✅ Test image cleaned up');

  } catch (error) {
    console.error('❌ Image test failed with error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testMinioUpload();
  await testImageUpload();
}

// Load environment variables
require('dotenv').config();

// Run the tests
runTests().catch(console.error);
