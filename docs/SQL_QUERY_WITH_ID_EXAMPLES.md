# SQL Query dengan ID - Payload Examples

Dokumentasi payload queue yang sudah diperbarui dengan `query_sql` yang menyertakan ID untuk semua operasi database.

## 🎯 **Key Update**

Field `query_sql` sekarang **selalu menyertakan ID** untuk semua operasi:
- **CREATE**: SQL INSERT dengan ID yang di-generate
- **UPDATE**: SQL UPDATE dengan WHERE clause menggunakan ID  
- **DELETE**: SQL UPDATE (soft delete) dengan WHERE clause menggunakan ID

## 🏢 Companies Module - SQL Examples

### CREATE Company
```json
{
  "database": "gate_db",
  "table": "companies",
  "method": "create",
  "query_sql": "INSERT INTO companies (company_id, company_name, company_address, company_email, created_by) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'PT Maju Bersama', 'Jl. Sudirman No. 123, Jakarta', 'info@majubersama.com', 'user-uuid-123')",
  "data": {
    "company_name": "PT Maju Bersama",
    "company_address": "Jl. Sudirman No. 123, Jakarta",
    "company_email": "info@majubersama.com",
    "created_by": "user-uuid-123"
  },
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "company_name": "PT Maju Bersama",
    "company_address": "Jl. Sudirman No. 123, Jakarta",
    "company_email": "info@majubersama.com",
    "created_by": "user-uuid-123",
    "created_at": "2025-09-19T10:00:00.000Z"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
  "primary_key_value": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-09-19T10:00:00.000Z",
  "operation_id": "op_1695117600000_abc123def"
}
```

### UPDATE Company  
```json
{
  "database": "gate_db",
  "table": "companies",
  "method": "update",
  "query_sql": "UPDATE companies SET company_name = 'PT Maju Bersama Updated', company_address = 'Jl. Thamrin No. 456, Jakarta', updated_by = 'user-uuid-456', updated_at = '2025-09-19T11:00:00.000Z' WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'",
  "data": {
    "company_name": "PT Maju Bersama Updated",
    "company_address": "Jl. Thamrin No. 456, Jakarta",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:00:00.000Z"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
  "primary_key_value": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "company_name": "PT Maju Bersama Updated",
    "company_address": "Jl. Thamrin No. 456, Jakarta",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:00:00.000Z"
  },
  "timestamp": "2025-09-19T11:00:00.000Z",
  "operation_id": "op_1695121200000_def456ghi"
}
```

### DELETE Company (Soft Delete)
```json
{
  "database": "gate_db",
  "table": "companies", 
  "method": "delete",
  "query_sql": "UPDATE companies SET is_delete = true, deleted_at = '2025-09-19T12:00:00.000Z', deleted_by = 'user-uuid-789' WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'",
  "data": {
    "is_delete": true,
    "deleted_at": "2025-09-19T12:00:00.000Z",
    "deleted_by": "user-uuid-789"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
  "primary_key_value": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "is_delete": true,
    "deleted_at": "2025-09-19T12:00:00.000Z",
    "deleted_by": "user-uuid-789"
  },
  "timestamp": "2025-09-19T12:00:00.000Z",
  "operation_id": "op_1695124800000_ghi789jkl"
}
```

## 🏬 Departments Module - SQL Examples

### CREATE Department
```json
{
  "database": "gate_db",
  "table": "departments",
  "method": "create", 
  "query_sql": "INSERT INTO departments (department_id, department_name, company_id, created_by) VALUES ('660e8400-e29b-41d4-a716-446655440001', 'Human Resources', '550e8400-e29b-41d4-a716-446655440000', 'user-uuid-123')",
  "data": {
    "department_name": "Human Resources",
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_by": "user-uuid-123"
  },
  "result": {
    "department_id": "660e8400-e29b-41d4-a716-446655440001",
    "department_name": "Human Resources",
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_by": "user-uuid-123",
    "created_at": "2025-09-19T10:05:00.000Z"
  },
  "record_id": "660e8400-e29b-41d4-a716-446655440001",
  "primary_key": "department_id",
  "primary_key_value": "660e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2025-09-19T10:05:00.000Z",
  "operation_id": "op_1695117900000_mno123pqr"
}
```

### UPDATE Department
```json
{
  "database": "gate_db",
  "table": "departments",
  "method": "update",
  "query_sql": "UPDATE departments SET department_name = 'Human Resources & Development', updated_by = 'user-uuid-456', updated_at = '2025-09-19T11:05:00.000Z' WHERE department_id = '660e8400-e29b-41d4-a716-446655440001'",
  "data": {
    "department_name": "Human Resources & Development",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:05:00.000Z"
  },
  "record_id": "660e8400-e29b-41d4-a716-446655440001",
  "primary_key": "department_id",
  "primary_key_value": "660e8400-e29b-41d4-a716-446655440001",
  "result": {
    "department_id": "660e8400-e29b-41d4-a716-446655440001",
    "department_name": "Human Resources & Development",
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:05:00.000Z"
  },
  "timestamp": "2025-09-19T11:05:00.000Z",
  "operation_id": "op_1695121500000_stu456vwx"
}
```

## 🎯 Titles Module - SQL Examples

### CREATE Title
```json
{
  "database": "gate_db",
  "table": "titles",
  "method": "create",
  "query_sql": "INSERT INTO titles (title_id, title_name, department_id, created_by) VALUES ('770e8400-e29b-41d4-a716-446655440002', 'Senior HR Manager', '660e8400-e29b-41d4-a716-446655440001', 'user-uuid-123')",
  "data": {
    "title_name": "Senior HR Manager",
    "department_id": "660e8400-e29b-41d4-a716-446655440001",
    "created_by": "user-uuid-123"
  },
  "result": {
    "title_id": "770e8400-e29b-41d4-a716-446655440002",
    "title_name": "Senior HR Manager",
    "department_id": "660e8400-e29b-41d4-a716-446655440001",
    "created_by": "user-uuid-123",
    "created_at": "2025-09-19T10:10:00.000Z"
  },
  "record_id": "770e8400-e29b-41d4-a716-446655440002",
  "primary_key": "title_id",
  "primary_key_value": "770e8400-e29b-41d4-a716-446655440002",
  "timestamp": "2025-09-19T10:10:00.000Z",
  "operation_id": "op_1695118200000_yz123abc"
}
```

## 👤 Employees Module - SQL Examples

### CREATE Employee
```json
{
  "database": "gate_db",
  "table": "employees",
  "method": "create",
  "query_sql": "INSERT INTO employees (employee_id, employee_name, employee_email, title_id, created_by) VALUES ('880e8400-e29b-41d4-a716-446655440003', 'John Doe', 'john.doe@majubersama.com', '770e8400-e29b-41d4-a716-446655440002', 'user-uuid-123')",
  "data": {
    "employee_name": "John Doe",
    "employee_email": "john.doe@majubersama.com",
    "title_id": "770e8400-e29b-41d4-a716-446655440002",
    "created_by": "user-uuid-123"
  },
  "result": {
    "employee_id": "880e8400-e29b-41d4-a716-446655440003",
    "employee_name": "John Doe",
    "employee_email": "john.doe@majubersama.com",
    "title_id": "770e8400-e29b-41d4-a716-446655440002",
    "created_by": "user-uuid-123",
    "created_at": "2025-09-19T10:15:00.000Z"
  },
  "record_id": "880e8400-e29b-41d4-a716-446655440003",
  "primary_key": "employee_id",
  "primary_key_value": "880e8400-e29b-41d4-a716-446655440003",
  "timestamp": "2025-09-19T10:15:00.000Z",
  "operation_id": "op_1695118500000_def789ghi"
}
```

## 🔧 Consumer Implementation dengan SQL Query

```javascript
const amqp = require('amqplib');

const consumeQueueWithSQL = async () => {
  const connection = await amqp.connect('amqp://guest:guest@localhost:9505');
  const channel = await connection.createChannel();
  
  const exchangeName = 'database_operations';
  const queueName = 'database_changes_queue_sso';
  
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName);
  
  console.log('🔄 Consuming queue with SQL queries:', queueName);
  
  channel.consume(queueName, async (msg) => {
    const payload = JSON.parse(msg.content.toString());
    
    console.log(`📨 ${payload.table} - ${payload.method.toUpperCase()}`);
    console.log(`🆔 ID: ${payload.primary_key_value}`);
    console.log(`📝 SQL: ${payload.query_sql}`);
    
    try {
      // Opsi 1: Execute SQL query langsung ke mirror database
      await executeSQLToMirrorDB(payload.query_sql);
      
      // Opsi 2: Parse payload untuk operasi yang lebih specific
      await processMirroringByMethod(payload);
      
      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error processing queue:', error);
      channel.nack(msg, false, false);
    }
  });
};

const executeSQLToMirrorDB = async (sqlQuery) => {
  // Execute SQL query langsung ke mirror database
  console.log('🔄 Executing SQL to mirror DB:', sqlQuery);
  
  // Contoh dengan database client
  // await mirrorDBClient.query(sqlQuery);
};

const processMirroringByMethod = async (payload) => {
  const { table, method, primary_key_value, data, result } = payload;
  
  switch (method) {
    case 'create':
      // Untuk CREATE, gunakan result data yang lengkap
      console.log(`📝 Mirror CREATE: ${table} with complete data`);
      await mirrorDB.insert(table, result);
      break;
      
    case 'update':
      // Untuk UPDATE, gunakan data yang diupdate
      console.log(`📝 Mirror UPDATE: ${table} ID ${primary_key_value}`);
      await mirrorDB.update(table, primary_key_value, data);
      break;
      
    case 'delete':
      // Untuk DELETE, gunakan soft delete data
      console.log(`📝 Mirror DELETE: ${table} ID ${primary_key_value}`);
      await mirrorDB.update(table, primary_key_value, data);
      break;
  }
};

// Mock mirror database operations
const mirrorDB = {
  async insert(table, data) {
    console.log(`INSERT INTO ${table}:`, data);
  },
  
  async update(table, id, data) {
    console.log(`UPDATE ${table} WHERE id = ${id}:`, data);
  }
};

// Start consumer
consumeQueueWithSQL().catch(console.error);
```

## 🎯 Benefits dari SQL Query dengan ID

1. **Ready-to-Execute**: SQL query bisa langsung dieksekusi ke mirror database
2. **Complete Information**: Query sudah include semua data termasuk ID
3. **Audit Trail**: SQL query bisa disimpan untuk audit dan debugging
4. **Flexibility**: Bisa pilih execute SQL langsung atau parse payload
5. **Consistency**: ID selalu konsisten dalam SQL query dan payload

## 📊 Summary

- **CREATE SQL**: `INSERT INTO table (id, col1, col2) VALUES ('uuid', 'val1', 'val2')`
- **UPDATE SQL**: `UPDATE table SET col1 = 'val1' WHERE id = 'uuid'`
- **DELETE SQL**: `UPDATE table SET is_delete = true WHERE id = 'uuid'`
- **Queue Name**: `database_changes_queue_sso`
- **Key Feature**: SQL query selalu menyertakan ID untuk database mirroring

---

**Updated**: September 19, 2025  
**Version**: 1.3.0
