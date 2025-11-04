// Script untuk create database jika belum ada
const knex = require('knex');
require('dotenv').config();

const dbName = process.env.DB_NAME_DEV || 'gate_sso';
const config = {
  client: process.env.DB_CLIENT_DEV || 'pg',
  connection: {
    host: process.env.DB_HOST_DEV || 'localhost',
    port: process.env.DB_PORT_DEV || 5432,
    user: process.env.DB_USER_DEV || 'postgres',
    password: process.env.DB_PASS_DEV || 'password',
    database: 'postgres', // Connect ke default database untuk create database baru
  },
};

async function createDatabase() {
  const db = knex(config);
  
  try {
    console.log(`🔍 Checking if database "${dbName}" exists...`);
    
    // Check if database exists
    const result = await db.raw(`
      SELECT 1 FROM pg_database WHERE datname = ?
    `, [dbName]);
    
    if (result.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists!`);
      await db.destroy();
      return true;
    }
    
    // Create database
    console.log(`📦 Creating database "${dbName}"...`);
    await db.raw(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Database "${dbName}" created successfully!`);
    
    await db.destroy();
    return true;
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`✅ Database "${dbName}" already exists!`);
      await db.destroy();
      return true;
    }
    console.error(`❌ Error creating database:`, error.message);
    await db.destroy();
    return false;
  }
}

createDatabase().then(success => {
  process.exit(success ? 0 : 1);
});

