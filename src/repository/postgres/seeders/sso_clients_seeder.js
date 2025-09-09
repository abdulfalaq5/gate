const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing SSO client entries
  await knex('sso_clients').del();

  // Hash password untuk client secret
  const hashedPassword = await bcrypt.hash('password', 10);

  // Insert SSO client entries untuk sistem lain
  await knex('sso_clients').insert([
    {
      client_id: 'external-system-client',
      client_secret: hashedPassword,
      name: 'External System Client',
      description: 'SSO Client untuk sistem eksternal yang berjalan di port 9581',
      redirect_uris: JSON.stringify([
        'http://localhost:9581/auth/callback',
        'http://localhost:9581/sso/callback',
        'http://localhost:9581/callback'
      ]),
      scopes: JSON.stringify([
        'read',
        'write',
        'profile',
        'email',
        'openid'
      ]),
      contact_email: 'admin@external-system.com',
      website: 'http://localhost:9581',
      security_level: 'standard',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      client_id: 'test-client',
      client_secret: hashedPassword,
      name: 'Test Client',
      description: 'SSO Client untuk testing dan development',
      redirect_uris: JSON.stringify([
        'http://localhost:3000/auth/callback',
        'http://localhost:3001/auth/callback',
        'http://localhost:9581/auth/callback'
      ]),
      scopes: JSON.stringify([
        'read',
        'write',
        'profile',
        'email'
      ]),
      contact_email: 'test@example.com',
      website: 'http://localhost:3000',
      security_level: 'basic',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      client_id: 'mobile-app-client',
      client_secret: hashedPassword,
      name: 'Mobile App Client',
      description: 'SSO Client untuk aplikasi mobile',
      redirect_uris: JSON.stringify([
        'com.example.mobileapp://auth/callback',
        'com.example.mobileapp://sso/callback'
      ]),
      scopes: JSON.stringify([
        'read',
        'profile',
        'email',
        'openid'
      ]),
      contact_email: 'mobile@example.com',
      website: 'https://example.com/mobile',
      security_level: 'high',
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);

  console.log('✅ SSO Clients seeded successfully!');
  console.log('📋 Available SSO Clients:');
  console.log('   - external-system-client (for port 9581)');
  console.log('   - test-client (for testing)');
  console.log('   - mobile-app-client (for mobile apps)');
  console.log('🔑 Default password for all clients: "password"');
};
