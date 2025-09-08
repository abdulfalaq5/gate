/**
 * Column definitions for products table
 * Used for validation, documentation, and form generation
 */

const productsColumns = {
  id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the product',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 2,
    description: 'Product name',
    example: 'iPhone 14 Pro'
  },
  description: {
    type: 'text',
    required: false,
    maxLength: 500,
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system'
  },
  price: {
    type: 'decimal',
    required: true,
    precision: 15,
    scale: 2,
    minValue: 0,
    description: 'Product price',
    example: 999.99
  },
  stock: {
    type: 'integer',
    required: false,
    defaultValue: 0,
    minValue: 0,
    description: 'Available stock quantity',
    example: 50
  },
  sku: {
    type: 'string',
    required: false,
    unique: true,
    maxLength: 50,
    minLength: 3,
    description: 'Stock Keeping Unit - unique product identifier',
    example: 'IPH14P-256-BLK'
  },
  category: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Product category',
    example: 'Electronics'
  },
  brand: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Product brand',
    example: 'Apple'
  },
  images: {
    type: 'json',
    required: false,
    defaultValue: '[]',
    description: 'Array of product image URLs',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  },
  specifications: {
    type: 'json',
    required: false,
    defaultValue: '{}',
    description: 'Product specifications as key-value pairs',
    example: {
      color: 'Space Black',
      storage: '256GB',
      screen_size: '6.1 inches'
    }
  },
  is_active: {
    type: 'boolean',
    required: false,
    defaultValue: true,
    description: 'Whether the product is active/available',
    example: true
  },
  created_at: {
    type: 'timestamp',
    required: false,
    autoGenerate: true,
    description: 'Record creation timestamp',
    example: '2023-01-01T00:00:00Z'
  },
  updated_at: {
    type: 'timestamp',
    required: false,
    autoGenerate: true,
    description: 'Record last update timestamp',
    example: '2023-01-01T00:00:00Z'
  },
  created_by: {
    type: 'uuid',
    required: false,
    description: 'User ID who created the record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  updated_by: {
    type: 'uuid',
    required: false,
    description: 'User ID who last updated the record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  }
}

// Index definitions
const productsIndexes = [
  {
    name: 'idx_products_name',
    columns: ['name'],
    type: 'btree'
  },
  {
    name: 'idx_products_category',
    columns: ['category'],
    type: 'btree'
  },
  {
    name: 'idx_products_brand',
    columns: ['brand'],
    type: 'btree'
  },
  {
    name: 'idx_products_is_active',
    columns: ['is_active'],
    type: 'btree'
  },
  {
    name: 'idx_products_created_at',
    columns: ['created_at'],
    type: 'btree'
  },
  {
    name: 'idx_products_sku',
    columns: ['sku'],
    type: 'btree',
    unique: true
  }
]

// Validation rules for different operations
const validationRules = {
  create: {
    required: ['name', 'price'],
    optional: ['description', 'stock', 'sku', 'category', 'brand', 'images', 'specifications', 'is_active']
  },
  update: {
    required: [],
    optional: ['name', 'description', 'price', 'stock', 'sku', 'category', 'brand', 'images', 'specifications', 'is_active']
  },
  search: {
    fields: ['name', 'description', 'sku'],
    operators: ['ilike', 'like', 'eq']
  },
  filter: {
    fields: ['category', 'brand', 'is_active'],
    operators: ['eq', 'in']
  },
  sort: {
    fields: ['name', 'price', 'stock', 'created_at', 'updated_at'],
    orders: ['asc', 'desc']
  }
}

// Excel export/import configuration
const excelConfig = {
  export: {
    columns: [
      { key: 'id', header: 'ID', width: 20 },
      { key: 'name', header: 'Name', width: 30 },
      { key: 'description', header: 'Description', width: 50 },
      { key: 'price', header: 'Price', width: 15 },
      { key: 'stock', header: 'Stock', width: 10 },
      { key: 'sku', header: 'SKU', width: 20 },
      { key: 'category', header: 'Category', width: 20 },
      { key: 'brand', header: 'Brand', width: 20 },
      { key: 'images', header: 'Images Count', width: 15 },
      { key: 'is_active', header: 'Is Active', width: 15 },
      { key: 'created_at', header: 'Created At', width: 20 },
      { key: 'updated_at', header: 'Updated At', width: 20 }
    ]
  },
  import: {
    requiredColumns: ['Name', 'Price'],
    optionalColumns: ['Description', 'Stock', 'SKU', 'Category', 'Brand', 'Is Active'],
    mappings: {
      'Name': 'name',
      'Description': 'description',
      'Price': 'price',
      'Stock': 'stock',
      'SKU': 'sku',
      'Category': 'category',
      'Brand': 'brand',
      'Is Active': 'is_active'
    }
  }
}

module.exports = {
  productsColumns,
  productsIndexes,
  validationRules,
  excelConfig
}
