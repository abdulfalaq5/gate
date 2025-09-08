/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  
  // Inserts seed entries
  await knex('products').insert([
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'iPhone 14 Pro',
      description: 'Latest iPhone with advanced camera system and A16 Bionic chip',
      price: 999.99,
      stock: 50,
      sku: 'IPH14P-256-BLK',
      category: 'Electronics',
      brand: 'Apple',
      images: JSON.stringify(['https://example.com/iphone14pro1.jpg', 'https://example.com/iphone14pro2.jpg']),
      specifications: JSON.stringify({
        color: 'Space Black',
        storage: '256GB',
        screen_size: '6.1 inches',
        camera: '48MP Main Camera',
        processor: 'A16 Bionic'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Samsung Galaxy S23',
      description: 'Premium Android smartphone with advanced photography features',
      price: 799.99,
      stock: 30,
      sku: 'SGS23-128-PH',
      category: 'Electronics',
      brand: 'Samsung',
      images: JSON.stringify(['https://example.com/galaxys23-1.jpg']),
      specifications: JSON.stringify({
        color: 'Phantom Black',
        storage: '128GB',
        screen_size: '6.1 inches',
        camera: '50MP Main Camera',
        processor: 'Snapdragon 8 Gen 2'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'MacBook Pro 14"',
      description: 'Professional laptop with M2 Pro chip for creators and developers',
      price: 1999.99,
      stock: 15,
      sku: 'MBP14-M2P-512',
      category: 'Electronics',
      brand: 'Apple',
      images: JSON.stringify(['https://example.com/macbookpro14-1.jpg', 'https://example.com/macbookpro14-2.jpg']),
      specifications: JSON.stringify({
        color: 'Space Gray',
        storage: '512GB SSD',
        screen_size: '14 inches',
        processor: 'M2 Pro',
        memory: '16GB RAM'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Max Air cushioning',
      price: 150.00,
      stock: 100,
      sku: 'NAM270-BLK-10',
      category: 'Footwear',
      brand: 'Nike',
      images: JSON.stringify(['https://example.com/airmax270-1.jpg']),
      specifications: JSON.stringify({
        color: 'Black',
        size: '10',
        material: 'Mesh and Synthetic',
        sole: 'Rubber'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Adidas Ultraboost 22',
      description: 'High-performance running shoes with Boost technology',
      price: 180.00,
      stock: 75,
      sku: 'AUB22-WHT-9',
      category: 'Footwear',
      brand: 'Adidas',
      images: JSON.stringify(['https://example.com/ultraboost22-1.jpg', 'https://example.com/ultraboost22-2.jpg']),
      specifications: JSON.stringify({
        color: 'White',
        size: '9',
        material: 'Primeknit',
        sole: 'Boost'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald',
      price: 12.99,
      stock: 200,
      sku: 'TGG-PB-EN',
      category: 'Books',
      brand: 'Penguin Classics',
      images: JSON.stringify(['https://example.com/greatgatsby-1.jpg']),
      specifications: JSON.stringify({
        language: 'English',
        pages: 180,
        format: 'Paperback',
        isbn: '9780141182636'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Sony WH-1000XM4',
      description: 'Industry-leading noise canceling wireless headphones',
      price: 349.99,
      stock: 25,
      sku: 'SWH1000XM4-BLK',
      category: 'Electronics',
      brand: 'Sony',
      images: JSON.stringify(['https://example.com/sonyxm4-1.jpg']),
      specifications: JSON.stringify({
        color: 'Black',
        battery_life: '30 hours',
        connectivity: 'Bluetooth 5.0',
        noise_canceling: 'Yes'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Dell XPS 13',
      description: 'Ultrabook with InfinityEdge display and 11th Gen Intel processor',
      price: 1299.99,
      stock: 20,
      sku: 'DXPS13-I7-512',
      category: 'Electronics',
      brand: 'Dell',
      images: JSON.stringify(['https://example.com/dellxps13-1.jpg']),
      specifications: JSON.stringify({
        color: 'Platinum Silver',
        storage: '512GB SSD',
        screen_size: '13.4 inches',
        processor: 'Intel Core i7',
        memory: '16GB RAM'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Levi\'s 501 Original Jeans',
      description: 'Classic straight-fit jeans in authentic denim',
      price: 89.99,
      stock: 150,
      sku: 'L501-BLU-32',
      category: 'Clothing',
      brand: 'Levi\'s',
      images: JSON.stringify(['https://example.com/levis501-1.jpg']),
      specifications: JSON.stringify({
        color: 'Blue',
        size: '32',
        fit: 'Straight',
        material: '100% Cotton Denim'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Canon EOS R5',
      description: 'Professional mirrorless camera with 45MP full-frame sensor',
      price: 3899.99,
      stock: 5,
      sku: 'CER5-BDY-ONLY',
      category: 'Electronics',
      brand: 'Canon',
      images: JSON.stringify(['https://example.com/canoneosr5-1.jpg', 'https://example.com/canoneosr5-2.jpg']),
      specifications: JSON.stringify({
        color: 'Black',
        sensor: '45MP Full-Frame',
        video: '8K RAW',
        stabilization: 'In-Body IS',
        connectivity: 'WiFi, Bluetooth'
      }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: knex.raw('uuid_generate_v4()'),
      updated_by: knex.raw('uuid_generate_v4()')
    }
  ])
}