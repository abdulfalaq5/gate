require('dotenv').config();

const Minio = require('minio');

// Check if MinIO is enabled
const isMinioEnabled = process.env.MINIO_ENABLED === 'true'

// Initialize MinIO client only if enabled
let minioClient = null;
let minioClientPrivate = null;

if (isMinioEnabled) {
  // Initialize MinIO client
  minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || process.env.AWS_BUCKET_KEY_ID,
    secretKey: process.env.MINIO_SECRET_KEY || process.env.AWS_BUCKET_KEY
  });

  minioClientPrivate = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY_PRIVATE || process.env.AWS_BUCKET_KEY_ID_PRIVATE,
    secretKey: process.env.MINIO_SECRET_KEY_PRIVATE || process.env.AWS_BUCKET_KEY_PRIVATE
  });
}

// Upload file to MinIO
const uploadToMinio = async (bucketName, objectName, buffer, contentType = 'application/octet-stream') => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return { success: false, url: '' };
  }

  try {
    // Check if bucket exists, if not create it
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
      console.log(`Bucket '${bucketName}' created successfully.`);
    }

    // Set bucket policy untuk public read (selalu set, tidak peduli bucket baru atau lama)
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };

    try {
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy));
      console.log(`Bucket policy set for '${bucketName}'`);
    } catch (policyError) {
      console.warn(`Could not set bucket policy for '${bucketName}':`, policyError.message);
    }

    // Upload the file with public-read ACL
    await minioClient.putObject(bucketName, objectName, buffer, {
      'Content-Type': contentType
    }, {
      'x-amz-acl': 'public-read'
    });

    // Generate public URL (tidak perlu presigned karena public-read)
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const minioPort = process.env.MINIO_PORT || '9000';
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const publicUrl = `${protocol}://${minioEndpoint}:${minioPort}/${bucketName}/${objectName}`;

    return {
      success: true,
      url: publicUrl,
      bucket: bucketName,
      object: objectName
    };
  } catch (error) {
    console.error('Error uploading to MinIO:', error);
    return {
      success: false,
      error: error.message,
      url: ''
    };
  }
};

// Upload file to private MinIO bucket
const uploadToMinioPrivate = async (bucketName, objectName, buffer, contentType = 'application/octet-stream') => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return { success: false, url: '' };
  }

  try {
    // Check if bucket exists, if not create it
    const bucketExists = await minioClientPrivate.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClientPrivate.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
      console.log(`Private bucket '${bucketName}' created successfully.`);
    }

    // Upload the file
    await minioClientPrivate.putObject(bucketName, objectName, buffer, {
      'Content-Type': contentType
    });

    // Generate URL with 5 months expiration (5 * 30 * 24 * 60 * 60 seconds)
    const fiveMonthsInSeconds = 5 * 30 * 24 * 60 * 60;
    const url = await minioClientPrivate.presignedGetObject(
      bucketName,
      objectName,
      fiveMonthsInSeconds
    );

    return {
      success: true,
      url,
      bucket: bucketName,
      object: objectName
    };
  } catch (error) {
    console.error('Error uploading to MinIO Private:', error);
    return {
      success: false,
      error: error.message,
      url: ''
    };
  }
};

// Delete file from MinIO
const deleteFromMinio = async (bucketName, objectName, isPrivate = false) => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return { success: false };
  }

  try {
    const client = isPrivate ? minioClientPrivate : minioClient;
    await client.removeObject(bucketName, objectName);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from MinIO:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get signed URL for file access
const defaultExpiry = 5 * 30 * 24 * 60 * 60; // 5 months in seconds
const getSignedUrl = async (bucketName, objectName, expiry = defaultExpiry, isPrivate = false) => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return '';
  }

  try {
    const client = isPrivate ? minioClientPrivate : minioClient;
    const url = await client.presignedGetObject(bucketName, objectName, expiry);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return '';
  }
};

// Set bucket policy untuk public access
const setBucketPublicPolicy = async (bucketName) => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return false;
  }

  try {
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };

    await minioClient.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy));
    console.log(`Bucket policy set for '${bucketName}' - Public access enabled`);
    return true;
  } catch (error) {
    console.error(`Error setting bucket policy for '${bucketName}':`, error);
    return false;
  }
};

// Check bucket policy
const getBucketPolicy = async (bucketName) => {
  if (!isMinioEnabled) {
    console.log('MinIO is disabled');
    return null;
  }

  try {
    const policy = await minioClient.getBucketPolicy(bucketName);
    console.log(`Bucket policy for '${bucketName}':`, policy);
    return policy;
  } catch (error) {
    console.error(`Error getting bucket policy for '${bucketName}':`, error);
    return null;
  }
};

module.exports = {
  minioClient,
  minioClientPrivate,
  isMinioEnabled,
  uploadToMinio,
  uploadToMinioPrivate,
  deleteFromMinio,
  getSignedUrl,
  setBucketPublicPolicy,
  getBucketPolicy
};
