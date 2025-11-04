// Script untuk test dan fix database connection
const knex = require('knex');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

// Cek database yang tersedia
const databasesToTry = [
  process.env.DB_NAME_DEV || 'gate_sso',
  'gate_db',
  'gate_sso',
];

async function findWorkingDatabase() {
  for (const dbName of databasesToTry) {
    const config = {
      client: process.env.DB_CLIENT_DEV || 'pg',
      connection: {
        host: process.env.DB_HOST_DEV || 'localhost',
        port: process.env.DB_PORT_DEV || 5432,
        user: process.env.DB_USER_DEV || 'postgres',
        password: process.env.DB_PASS_DEV || 'password',
        database: dbName,
      },
    };

    const db = knex(config);
    
    try {
      await db.raw('SELECT 1');
      
      // Check if employees table exists
      const hasEmployees = await db.schema.hasTable('employees');
      
      await db.destroy();
      
      if (hasEmployees) {
        console.log(`✅ Found working database: ${dbName} (with employees table)`);
        return { database: dbName, hasTables: true };
      } else {
        console.log(`⚠️  Found database: ${dbName} (but no employees table - need migration)`);
        return { database: dbName, hasTables: false };
      }
    } catch (error) {
      await db.destroy();
      continue;
    }
  }
  
  return null;
}

async function main() {
  console.log('🔍 Finding working database...\n');
  
  const result = await findWorkingDatabase();
  
  if (!result) {
    console.log('❌ No working database found!');
    console.log('\n📝 SOLUSI:');
    console.log('1. Pastikan PostgreSQL running di host machine');
    console.log('2. Buat database secara manual atau gunakan database yang sudah ada');
    console.log('3. Update DB_NAME_DEV di .env file');
    process.exit(1);
  }
  
  console.log(`\n✅ Database yang akan digunakan: ${result.database}`);
  
  if (!result.hasTables) {
    console.log('\n⚠️  Database kosong - perlu jalankan migrasi!');
    console.log('\n📝 JALANKAN PERINTAH INI:');
    console.log(`   docker-compose exec app npm run migrate`);
    console.log('\n   Atau pastikan DB_NAME_DEV di .env mengarah ke database yang sudah ada tabel');
  } else {
    console.log('\n✅ Database sudah siap digunakan!');
  }
  
  process.exit(0);
}

main();

