const path = require('path');
const fs = require('fs');
const {
  uploadToMinio,
  uploadToMinioPrivate,
  isMinioEnabled
} = require('../config/minio');
const { generateFolder } = require('./folder');
const { logger } = require('./logger');
const { logDateFormat } = require('./date');
const { addWatermark } = require('./custom');
const resizeImage = require('./image');

const generateMinioUpload = async (req, num, paths, naming, defaults = '', additional = {
  isWatermark: false, isPrivate: false, isContentType: false, fileNames: '', compressImage: false, maxFileSize: 10 * 1024 * 1024 // 10MB default
}) => {
  const filePath = `user-upload-minio-${logDateFormat()}.txt`;

  try {
    // If MinIO is disabled, return default values
    if (!isMinioEnabled) {
      console.log('MinIO is disabled, returning default values for upload');
      return {
        pathForDatabase: defaults,
        fileNames: defaults,
        status: false,
        error: 'MinIO is disabled'
      };
    }

    // Validate file exists
    if (!req.files || !req.files[num]) {
      console.log('No file found at index:', num);
      return {
        pathForDatabase: defaults,
        fileNames: defaults,
        status: false,
        error: 'No file found'
      };
    }

    let { buffer } = req.files[num];
    const mime = req?.files[num]?.mimetype;
    const originalName = req?.files[num]?.originalname;
    
    // Validate file size
    if (buffer.length > additional.maxFileSize) {
      console.log(`File size ${buffer.length} exceeds maximum allowed size ${additional.maxFileSize}`);
      return {
        pathForDatabase: defaults,
        fileNames: defaults,
        status: false,
        error: `File size exceeds maximum allowed size of ${Math.round(additional.maxFileSize / 1024 / 1024)}MB`
      };
    }

    // Validate file type for images
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (additional.isContentType && mime && !allowedImageTypes.includes(mime.toLowerCase())) {
      console.log(`Invalid file type: ${mime}`);
      return {
        pathForDatabase: defaults,
        fileNames: defaults,
        status: false,
        error: 'Invalid file type. Only image files are allowed.'
      };
    }

    let fileNames = req?.files[num]?.originalname
      ? `${naming !== '' ? `${naming}-` : ''}${Date.now()}${path.extname(originalName)}`
      : defaults;

    let watermarkImage;
    if (additional.isWatermark) {
      const pathWatermarked = path.join(__dirname, `../../storages/tmp/${fileNames}`);
      watermarkImage = await addWatermark(buffer, pathWatermarked);
      buffer = fs.readFileSync(watermarkImage);
      fileNames = additional.fileNames ? `watermark-${additional.fileNames}` : `watermark-${fileNames}`;
    }

    const bucketName = additional.isPrivate
      ? process.env.S3_BUCKET_PRIVATE || process.env.MINIO_BUCKET_PRIVATE || process.env.AWS_BUCKET_PRIVATE
      : process.env.S3_BUCKET || process.env.MINIO_BUCKET || process.env.AWS_BUCKET;

    const { pathForDatabase } = generateFolder(paths);

    if (additional.compressImage) {
      buffer = await resizeImage(buffer, mime, naming);
    }

    const objectName = `${pathForDatabase}${fileNames}`;
    const contentType = additional.isContentType ? mime : 'application/octet-stream';

    // Upload to MinIO
    const uploadResult = additional.isPrivate
      ? await uploadToMinioPrivate(bucketName, objectName, buffer, contentType)
      : await uploadToMinio(bucketName, objectName, buffer, contentType);

    // Remove temporary watermarked image
    if (additional.isWatermark && watermarkImage) {
      fs.unlink(watermarkImage, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    if (uploadResult.success) {
      logger(filePath, 'upload').write(`Success uploading file ${fileNames} to MinIO bucket ${bucketName} ${logDateFormat()}\n`);
    } else {
      logger(filePath, 'upload').write(`Error uploading file ${fileNames} to MinIO bucket ${bucketName} ${logDateFormat()}\n`);
    }

    return {
      pathForDatabase: uploadResult.success ? uploadResult.url : defaults,
      fileNames,
      status: uploadResult.success,
      error: uploadResult.error || null,
      fileSize: buffer.length,
      contentType: mime
    };
  } catch (error) {
    console.error('Error MinIO Upload : ', error);
    logger(filePath, 'upload').write(`Error uploading file: ${error.message} ${logDateFormat()}\n`);
    return {
      pathForDatabase: defaults,
      fileNames: defaults,
      status: false,
      error: error.message
    };
  }
};

const generateMinioUploadUpdated = async (req, file, row, defaults = '', additional = {
  isWatermark: false, isPrivate: false, isContentType: false, fileNames: '', compressImage: false
}) => {
  try {
    // If MinIO is disabled, return row payload as is
    if (!isMinioEnabled) {
      console.log('MinIO is disabled, returning row payload for upload update');
      return row?.payload;
    }

    const filePath = `user-upload-minio-put-${logDateFormat()}.txt`;
    let fileName = req?.files[file?.num]?.fieldname
      ? `${file?.name !== '' ? `${file?.name}-` : ''}${Date.now()}${path.extname(req?.files[file?.num]?.originalname)}`
      : defaults;

    const bucketName = additional.isPrivate
      ? process.env.S3_BUCKET_PRIVATE || process.env.MINIO_BUCKET_PRIVATE || process.env.AWS_BUCKET_PRIVATE
      : process.env.S3_BUCKET || process.env.MINIO_BUCKET || process.env.AWS_BUCKET;

    const { pathForDatabase } = generateFolder(file?.path);
    let { buffer } = req.files[file?.num];
    const mime = req?.files[file?.num]?.mimetype;

    let watermarkImage;
    if (additional.isWatermark) {
      const pathWatermarked = path.join(__dirname, `../../storages/tmp/${fileName}`);
      watermarkImage = await addWatermark(buffer, pathWatermarked);
      buffer = fs.readFileSync(watermarkImage);
      fileName = additional.fileNames ? `watermark-${additional.fileNames}` : `watermark-${fileName}`;
    }

    if (additional.compressImage) {
      buffer = await resizeImage(buffer, mime, fileName);
    }

    const objectName = `${pathForDatabase}${fileName}`;
    const contentType = additional.isContentType ? mime : 'application/octet-stream';

    // Upload to MinIO
    const uploadResult = additional.isPrivate
      ? await uploadToMinioPrivate(bucketName, objectName, buffer, contentType)
      : await uploadToMinio(bucketName, objectName, buffer, contentType);

    // Remove temporary watermarked image
    if (additional.isWatermark && watermarkImage) {
      fs.unlink(watermarkImage, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    if (uploadResult.success) {
      logger(filePath, 'upload').write(`Success uploading file ${fileName} to MinIO bucket ${bucketName} ${logDateFormat()}\n`);
      row.payload[row?.payloadName] = uploadResult.url;
    } else {
      logger(filePath, 'upload').write(`Error uploading file ${fileName} to MinIO bucket ${bucketName} ${logDateFormat()}\n`);
    }

    return row?.payload;
  } catch (error) {
    console.error('Error MinIO Upload Put: ', error);
    return row?.payload;
  }
};

module.exports = {
  generateMinioUpload,
  generateMinioUploadUpdated
};
