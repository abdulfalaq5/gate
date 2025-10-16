/**
 * Utility untuk update URL Minio yang sudah tersimpan di database
 * Mengganti URL lama dengan URL baru menggunakan custom base URL
 */

const { autoReplaceMinioUrlInString } = require('./url-replacer');

/**
 * Update URL dalam field database yang berisi URL Minio
 * @param {string} fieldValue - Value dari field database
 * @returns {string} - Value yang sudah diupdate dengan URL baru
 */
const updateDatabaseUrl = (fieldValue) => {
  if (!fieldValue || typeof fieldValue !== 'string') {
    return fieldValue;
  }

  // Replace URL dalam string
  return autoReplaceMinioUrlInString(fieldValue);
};

/**
 * Update multiple fields dalam object yang mungkin berisi URL Minio
 * @param {Object} data - Object data yang akan diupdate
 * @param {Array} urlFields - Array nama field yang berisi URL
 * @returns {Object} - Object data yang sudah diupdate
 */
const updateMultipleDatabaseUrls = (data, urlFields = []) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const updatedData = { ...data };

  // Default fields yang biasanya berisi URL
  const defaultUrlFields = [
    'image', 'images', 'photo', 'photos', 'avatar', 'logo', 
    'banner', 'file', 'files', 'attachment', 'attachments',
    'url', 'urls', 'path', 'paths'
  ];

  const fieldsToCheck = urlFields.length > 0 ? urlFields : defaultUrlFields;

  fieldsToCheck.forEach(field => {
    if (updatedData[field] && typeof updatedData[field] === 'string') {
      updatedData[field] = updateDatabaseUrl(updatedData[field]);
    }
  });

  return updatedData;
};

/**
 * Update URL dalam array of objects
 * @param {Array} dataArray - Array of objects
 * @param {Array} urlFields - Array nama field yang berisi URL
 * @returns {Array} - Array yang sudah diupdate
 */
const updateArrayDatabaseUrls = (dataArray, urlFields = []) => {
  if (!Array.isArray(dataArray)) {
    return dataArray;
  }

  return dataArray.map(item => updateMultipleDatabaseUrls(item, urlFields));
};

/**
 * Middleware untuk otomatis update URL dalam response
 * @param {Array} urlFields - Array nama field yang berisi URL
 * @returns {Function} - Express middleware function
 */
const urlUpdateMiddleware = (urlFields = []) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      let updatedData = data;
      
      try {
        // Parse JSON response
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Update URLs dalam response
        if (Array.isArray(parsedData)) {
          updatedData = JSON.stringify(updateArrayDatabaseUrls(parsedData, urlFields));
        } else if (parsedData && typeof parsedData === 'object') {
          updatedData = JSON.stringify(updateMultipleDatabaseUrls(parsedData, urlFields));
        }
      } catch (error) {
        // Jika gagal parse, return data asli
        updatedData = data;
      }
      
      originalSend.call(this, updatedData);
    };
    
    next();
  };
};

module.exports = {
  updateDatabaseUrl,
  updateMultipleDatabaseUrls,
  updateArrayDatabaseUrls,
  urlUpdateMiddleware
};
