# Module Structure Guide

Panduan untuk membuat module baru dalam boilerplate Express.js ini.

## Struktur Module

Setiap module harus mengikuti struktur berikut:

```
src/modules/your_module/
├── index.js              # Routes dan endpoint definitions
├── handler.js            # Business logic dan controllers
├── validation.js         # Input validation rules
├── postgre_repository.js # Database operations
└── column.js            # Database column definitions (opsional)
```

## Template Module

### 1. index.js (Routes)

```javascript
const { Router } = require('express')
const {
  getAll,
  getById,
  create,
  update,
  deleteById
} = require('./handler')
const {
  createValidation,
  updateValidation,
  idValidation
} = require('./validation')
const { verifyToken } = require('../../middlewares')

const router = Router()

// Public routes (jika ada)
router.get('/', getAll)

// Protected routes
router.get('/:id', verifyToken, idValidation, getById)
router.post('/', verifyToken, createValidation, create)
router.put('/:id', verifyToken, idValidation, updateValidation, update)
router.delete('/:id', verifyToken, idValidation, deleteById)

module.exports = router
```

### 2. handler.js (Business Logic)

```javascript
const repository = require('./postgre_repository')
const { baseResponse } = require('../../utils')

const getAll = async (req, res) => {
  try {
    const result = await repository.getAll(req.query)
    return baseResponse(res, result)
  } catch (error) {
    return baseResponse(res, { status: false, message: error.message })
  }
}

const getById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await repository.getById(id)
    return baseResponse(res, result)
  } catch (error) {
    return baseResponse(res, { status: false, message: error.message })
  }
}

const create = async (req, res) => {
  try {
    const result = await repository.create(req.body)
    return baseResponse(res, result)
  } catch (error) {
    return baseResponse(res, { status: false, message: error.message })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const result = await repository.update(id, req.body)
    return baseResponse(res, result)
  } catch (error) {
    return baseResponse(res, { status: false, message: error.message })
  }
}

const deleteById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await repository.deleteById(id)
    return baseResponse(res, result)
  } catch (error) {
    return baseResponse(res, { status: false, message: error.message })
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
}
```

### 3. validation.js (Input Validation)

```javascript
const { check } = require('express-validator')
const { validateMiddleware } = require('../../middlewares')
const { lang } = require('../../lang')

const createValidation = [
  check('name')
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Name' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Name' }))
    .isLength({ min: 3, max: 100 })
    .withMessage(lang.__('validator.length', { field: 'Name', min: 3, max: 100 })),
  check('email')
    .isEmail()
    .withMessage(lang.__('validator.email', { field: 'Email' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Email' })),
  (req, res, next) => validateMiddleware(req, res, next)
]

const updateValidation = [
  check('name')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Name' }))
    .isLength({ min: 3, max: 100 })
    .withMessage(lang.__('validator.length', { field: 'Name', min: 3, max: 100 })),
  check('email')
    .optional()
    .isEmail()
    .withMessage(lang.__('validator.email', { field: 'Email' })),
  (req, res, next) => validateMiddleware(req, res, next)
]

const idValidation = [
  check('id')
    .isUUID()
    .withMessage(lang.__('validator.uuid', { field: 'ID' })),
  (req, res, next) => validateMiddleware(req, res, next)
]

module.exports = {
  createValidation,
  updateValidation,
  idValidation
}
```

### 4. postgre_repository.js (Database Operations)

```javascript
const { corePostgres } = require('../../repository/postgres')

const getAll = async (query = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = query
    const offset = (page - 1) * limit

    let queryBuilder = corePostgres('your_table')
      .select('*')
      .where('deleted_at', null)

    if (search) {
      queryBuilder = queryBuilder.where(function() {
        this.where('name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
      })
    }

    const [data, countResult] = await Promise.all([
      queryBuilder.clone().limit(limit).offset(offset),
      queryBuilder.clone().count('* as count').first()
    ])

    return {
      status: true,
      data: {
        items: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.count),
          totalPages: Math.ceil(countResult.count / limit)
        }
      }
    }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const getById = async (id) => {
  try {
    const data = await corePostgres('your_table')
      .select('*')
      .where({ id, deleted_at: null })
      .first()

    if (!data) {
      return { status: false, message: 'Data not found' }
    }

    return { status: true, data }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const create = async (data) => {
  try {
    const [result] = await corePostgres('your_table')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*')

    return { status: true, data: result }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const update = async (id, data) => {
  try {
    const [result] = await corePostgres('your_table')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')

    if (!result) {
      return { status: false, message: 'Data not found' }
    }

    return { status: true, data: result }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

const deleteById = async (id) => {
  try {
    const result = await corePostgres('your_table')
      .where({ id })
      .update({ deleted_at: new Date() })

    if (!result) {
      return { status: false, message: 'Data not found' }
    }

    return { status: true, message: 'Data deleted successfully' }
  } catch (error) {
    return { status: false, message: error.message }
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
}
```

## Menambahkan Module ke Routes

Setelah membuat module, tambahkan ke `src/routes/V1/index.js`:

```javascript
const yourModule = require('../../modules/your_module')

// Public routes
routing.use(`${API_TAG}/your-module`, yourModule)

// Protected routes
routing.use(`${API_TAG}/your-module`, verifyToken, yourModule)
```

## Membuat Migration

```bash
knex migrate:make create_your_table --cwd=src
```

Contoh migration:

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('your_table', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('your_table')
}
```

## Swagger Documentation

### Schema (src/static/schema/your_module.json)

```json
{
  "YourModule": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "format": "uuid"
      },
      "name": {
        "type": "string",
        "example": "John Doe"
      },
      "email": {
        "type": "string",
        "format": "email",
        "example": "john@example.com"
      },
      "created_at": {
        "type": "string",
        "format": "date-time"
      },
      "updated_at": {
        "type": "string",
        "format": "date-time"
      }
    }
  }
}
```

### Path (src/static/path/your_module.json)

```json
{
  "/api/v1/your-module": {
    "get": {
      "tags": ["Your Module"],
      "summary": "Get all items",
      "responses": {
        "200": {
          "description": "Success",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/BaseResponse"
              }
            }
          }
        }
      }
    },
    "post": {
      "tags": ["Your Module"],
      "summary": "Create new item",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/YourModule"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Success",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/BaseResponse"
              }
            }
          }
        }
      }
    }
  }
}
```

## Best Practices

1. **Naming Convention**:
   - Module folder: `snake_case`
   - File names: `snake_case.js`
   - Function names: `camelCase`
   - Database tables: `snake_case`

2. **Error Handling**:
   - Selalu wrap database operations dengan try-catch
   - Return consistent response format
   - Log errors untuk debugging

3. **Validation**:
   - Validasi input di level route
   - Gunakan express-validator untuk validasi
   - Custom validation untuk business rules

4. **Database**:
   - Gunakan soft delete (deleted_at)
   - Tambahkan timestamps (created_at, updated_at)
   - Gunakan UUID untuk primary key

5. **Security**:
   - Selalu validasi input
   - Gunakan parameterized queries
   - Implementasi rate limiting untuk sensitive endpoints
