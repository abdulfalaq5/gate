# Updated Queue Payload Examples

Dokumentasi payload queue yang sudah diupdate dengan `primary_key_value` untuk database mirroring yang lebih baik.

## 📋 Struktur Payload Terbaru

```json
{
  "database": "gate_db",
  "table": "table_name",
  "method": "create|update|delete",
  "query_sql": "SQL_QUERY",
  "data": { /* data operasi */ },
  "result": { /* hasil dari database */ },
  "record_id": "primary_key_value",
  "primary_key": "primary_key_column_name",
  "primary_key_value": "primary_key_value", // ✅ NILAI ID untuk mirroring
  "timestamp": "2025-09-19T10:00:00.000Z",
  "operation_id": "unique_operation_id"
}
```

## 🏢 Companies Module - Payload Examples

### CREATE Company
```json
{
  "database": "gate_db",
  "table": "companies",
  "method": "create",
  "query_sql": "INSERT INTO companies (company_name, company_address, company_email, created_by) VALUES ('PT Maju Bersama', 'Jl. Sudirman No. 123, Jakarta', 'info@majubersama.com', 'user-uuid-123')",
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
  "query_sql": "UPDATE companies SET company_name = 'PT Maju Bersama Updated', updated_by = 'user-uuid-456', updated_at = '2025-09-19T11:00:00.000Z' WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'",
  "data": {
    "company_name": "PT Maju Bersama Updated",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:00:00.000Z"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
  "primary_key_value": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "company_name": "PT Maju Bersama Updated",
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

## 🏬 Departments Module - Payload Examples

### CREATE Department
```json
{
  "database": "gate_db",
  "table": "departments",
  "method": "create",
  "query_sql": "INSERT INTO departments (department_name, company_id, created_by) VALUES ('Human Resources', '550e8400-e29b-41d4-a716-446655440000', 'user-uuid-123')",
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

## 🎯 Titles Module - Payload Examples

### CREATE Title
```json
{
  "database": "gate_db",
  "table": "titles",
  "method": "create",
  "query_sql": "INSERT INTO titles (title_name, department_id, created_by) VALUES ('Senior HR Manager', '660e8400-e29b-41d4-a716-446655440001', 'user-uuid-123')",
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

## 👤 Employees Module - Payload Examples

### CREATE Employee
```json
{
  "database": "gate_db",
  "table": "employees",
  "method": "create",
  "query_sql": "INSERT INTO employees (employee_name, employee_email, title_id, created_by) VALUES ('John Doe', 'john.doe@majubersama.com', '770e8400-e29b-41d4-a716-446655440002', 'user-uuid-123')",
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

## 🔧 Consumer Implementation untuk Database Mirroring

```javascript
const amqp = require('amqplib');

const consumeQueueForMirroring = async () => {
  const connection = await amqp.connect('amqp://guest:guest@localhost:9505');
  const channel = await connection.createChannel();
  
  const exchangeName = 'database_operations';
  const queueName = 'database_changes_queue_sso';
  
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName);
  
  console.log('🔄 Consuming queue for database mirroring:', queueName);
  
  channel.consume(queueName, async (msg) => {
    const payload = JSON.parse(msg.content.toString());
    
    console.log(`📨 Processing ${payload.table} - ${payload.method.toUpperCase()}`);
    console.log(`🆔 ID: ${payload.primary_key_value} (${payload.primary_key})`);
    
    try {
      await mirrorDatabaseOperation(payload);
      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error mirroring data:', error);
      // Implement retry logic or dead letter queue
      channel.nack(msg, false, false);
    }
  });
};

const mirrorDatabaseOperation = async (payload) => {
  const { table, method, primary_key, primary_key_value, data, result } = payload;
  
  switch (method) {
    case 'create':
      // Mirror CREATE operation - gunakan result untuk data lengkap
      console.log(`🔄 Mirroring CREATE: ${table} with ID ${primary_key_value}`);
      await mirrorDB.insert(table, {
        ...result, // Gunakan result yang lengkap dari database
        [primary_key]: primary_key_value // Pastikan ID sama
      });
      break;
      
    case 'update':
      // Mirror UPDATE operation
      console.log(`🔄 Mirroring UPDATE: ${table} ID ${primary_key_value}`);
      await mirrorDB.update(table, primary_key_value, data);
      break;
      
    case 'delete':
      // Mirror soft DELETE operation
      console.log(`🔄 Mirroring DELETE: ${table} ID ${primary_key_value}`);
      await mirrorDB.softDelete(table, primary_key_value, data);
      break;
  }
  
  console.log(`✅ Successfully mirrored ${method.toUpperCase()} operation for ${table}`);
};

// Mock mirror database operations
const mirrorDB = {
  async insert(table, data) {
    console.log(`INSERT INTO ${table}:`, data);
    // Implement actual database insert to mirror DB
  },
  
  async update(table, id, data) {
    console.log(`UPDATE ${table} WHERE id = ${id}:`, data);
    // Implement actual database update to mirror DB
  },
  
  async softDelete(table, id, data) {
    console.log(`SOFT DELETE ${table} WHERE id = ${id}:`, data);
    // Implement actual soft delete to mirror DB
  }
};

// Start consumer
consumeQueueForMirroring().catch(console.error);
```

## 🎯 Key Benefits

1. **ID Consistency**: `primary_key_value` memastikan ID yang sama di mirror database
2. **Complete Data**: Field `result` berisi data lengkap dari database setelah operasi
3. **SQL Reference**: Field `query_sql` untuk reference exact query yang dieksekusi
4. **Flexible Mirroring**: Bisa pilih menggunakan `data` (input) atau `result` (output) tergantung kebutuhan
5. **Operation Tracking**: `operation_id` untuk tracking dan debugging

## 📊 Summary

- **Queue Name**: `database_changes_queue_sso`
- **Exchange**: `database_operations`
- **New Field**: `primary_key_value` berisi nilai ID untuk database mirroring
- **Timing**: Queue dikirim **setelah** operasi database berhasil
- **Data**: Payload berisi data input, result output, dan SQL query

---

**Updated**: September 19, 2025  
**Version**: 1.2.0
