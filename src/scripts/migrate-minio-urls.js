#!/usr/bin/env node

/**
 * Script untuk migrate URL Minio existing di database
 * Mengganti URL lama dengan URL baru menggunakan S3_BASE_URL
 */

require('dotenv').config();
const knex = require('../knexfile');
const { updateDatabaseUrl } = require('../utils/database-url-updater');

// Konfigurasi tabel dan field yang akan diupdate
const TABLE_CONFIGS = [
  {
    table: 'employees',
    urlFields: ['photo', 'avatar', 'profile_picture', 'document', 'files']
  },
  {
    table: 'catalogs',
    urlFields: ['image', 'images', 'thumbnail', 'gallery', 'files']
  },
  {
    table: 'products',
    urlFields: ['image', 'images', 'thumbnail', 'gallery', 'files', 'specification_file']
  },
  {
    table: 'users',
    urlFields: ['avatar', 'photo', 'profile_picture']
  },
  {
    table: 'companies',
    urlFields: ['logo', 'banner', 'image', 'files']
  },
  {
    table: 'attachments',
    urlFields: ['file_path', 'url', 'file_url']
  }
];

// Fungsi untuk check apakah string berisi URL Minio
const containsMinioUrl = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  // Pattern untuk mendeteksi URL Minio (bisa disesuaikan)
  const minioPatterns = [
    /http:\/\/127\.0\.0\.1:\d+/,
    /http:\/\/localhost:\d+/,
    /https?:\/\/[^\/]+:\d+/
  ];
  
  return minioPatterns.some(pattern => pattern.test(str));
};

// Fungsi untuk update single record
const updateRecord = async (table, record, urlFields) => {
  const updatedFields = {};
  let hasChanges = false;
  
  urlFields.forEach(field => {
    if (record[field] && containsMinioUrl(record[field])) {
      const newUrl = updateDatabaseUrl(record[field]);
      if (newUrl !== record[field]) {
        updatedFields[field] = newUrl;
        hasChanges = true;
      }
    }
  });
  
  if (hasChanges) {
    try {
      await knex(table)
        .where('id', record.id)
        .update(updatedFields);
      
      console.log(`✅ Updated ${table} record ${record.id}`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating ${table} record ${record.id}:`, error.message);
      return false;
    }
  }
  
  return false;
};

// Fungsi untuk migrate single table
const migrateTable = async (tableConfig) => {
  const { table, urlFields } = tableConfig;
  
  console.log(`\n🔄 Migrating table: ${table}`);
  
  try {
    // Check apakah tabel ada
    const tableExists = await knex.schema.hasTable(table);
    if (!tableExists) {
      console.log(`⚠️  Table ${table} does not exist, skipping...`);
      return { success: 0, failed: 0, skipped: 0 };
    }
    
    // Get semua records
    const records = await knex(table).select('*');
    console.log(`📊 Found ${records.length} records in ${table}`);
    
    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    
    for (const record of records) {
      const hasUrlFields = urlFields.some(field => 
        record[field] && containsMinioUrl(record[field])
      );
      
      if (!hasUrlFields) {
        skippedCount++;
        continue;
      }
      
      const updated = await updateRecord(table, record, urlFields);
      if (updated) {
        successCount++;
      } else {
        failedCount++;
      }
    }
    
    console.log(`✅ ${table}: ${successCount} updated, ${failedCount} failed, ${skippedCount} skipped`);
    return { success: successCount, failed: failedCount, skipped: skippedCount };
    
  } catch (error) {
    console.error(`❌ Error migrating table ${table}:`, error.message);
    return { success: 0, failed: 0, skipped: 0 };
  }
};

// Fungsi untuk backup database (optional)
const backupDatabase = async () => {
  console.log('💾 Creating database backup...');
  // Implementasi backup sesuai dengan database yang digunakan
  // Untuk PostgreSQL bisa menggunakan pg_dump
  console.log('⚠️  Backup functionality not implemented. Please backup manually before running migration.');
};

// Main function
const migrateUrls = async () => {
  console.log('🚀 Starting Minio URL migration...');
  console.log(`📍 Custom base URL: ${process.env.S3_BASE_URL || 'Not configured'}`);
  
  if (!process.env.S3_BASE_URL) {
    console.log('❌ S3_BASE_URL not configured in environment variables');
    process.exit(1);
  }
  
  try {
    // Test database connection
    await knex.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    let totalSuccess = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    
    // Migrate semua tabel
    for (const tableConfig of TABLE_CONFIGS) {
      const result = await migrateTable(tableConfig);
      totalSuccess += result.success;
      totalFailed += result.failed;
      totalSkipped += result.skipped;
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully updated: ${totalSuccess} records`);
    console.log(`❌ Failed updates: ${totalFailed} records`);
    console.log(`⏭️  Skipped records: ${totalSkipped} records`);
    
    if (totalFailed > 0) {
      console.log('\n⚠️  Some records failed to update. Check the logs above for details.');
    }
    
    console.log('\n🎉 Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
};

// Run migration jika script dipanggil langsung
if (require.main === module) {
  migrateUrls();
}

module.exports = {
  migrateUrls,
  migrateTable,
  updateRecord,
  containsMinioUrl
};
