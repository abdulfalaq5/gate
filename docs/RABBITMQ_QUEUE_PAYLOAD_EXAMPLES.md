# RabbitMQ Queue Payload Examples

Dokumentasi lengkap contoh payload yang dikirim ke RabbitMQ untuk semua operasi database. Setiap payload **selalu menyertakan ID (primary key)** untuk mendukung database mirroring.

## Queue Configuration

- **Exchange Name**: `database_operations`
- **Queue Name**: `database_changes_queue_sso`
- **Exchange Type**: `fanout`

## Payload Structure

Setiap payload memiliki struktur dasar sebagai berikut:

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
  "timestamp": "2025-09-19T10:00:00.000Z",
  "operation_id": "unique_operation_id"
}
```

## 🏢 Companies Module Examples

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
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "company_name": "PT Maju Bersama Updated",
    "company_address": "Jl. Thamrin No. 456, Jakarta",
    "company_email": "info@majubersama.com",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:00:00.000Z"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
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
  "result": {
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "is_delete": true,
    "deleted_at": "2025-09-19T12:00:00.000Z",
    "deleted_by": "user-uuid-789"
  },
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "primary_key": "company_id",
  "timestamp": "2025-09-19T12:00:00.000Z",
  "operation_id": "op_1695124800000_ghi789jkl"
}
```

## 🏬 Departments Module Examples

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
  "result": {
    "department_id": "660e8400-e29b-41d4-a716-446655440001",
    "department_name": "Human Resources & Development",
    "company_id": "550e8400-e29b-41d4-a716-446655440000",
    "updated_by": "user-uuid-456",
    "updated_at": "2025-09-19T11:05:00.000Z"
  },
  "record_id": "660e8400-e29b-41d4-a716-446655440001",
  "primary_key": "department_id",
  "timestamp": "2025-09-19T11:05:00.000Z",
  "operation_id": "op_1695121500000_stu456vwx"
}
```

## 🎯 Titles Module Examples

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
  "timestamp": "2025-09-19T10:10:00.000Z",
  "operation_id": "op_1695118200000_yz123abc"
}
```

## 👤 Employees Module Examples

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
  "timestamp": "2025-09-19T10:15:00.000Z",
  "operation_id": "op_1695118500000_def789ghi"
}
```

## 🔧 Consumer Implementation

### Node.js Consumer Example
```javascript
const amqp = require('amqplib');

const consumeQueue = async () => {
  const connection = await amqp.connect('amqp://guest:guest@localhost:9505');
  const channel = await connection.createChannel();
  
  const exchangeName = 'database_operations';
  const queueName = 'database_changes_queue_sso';
  
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName);
  
  console.log('🔄 Consuming queue:', queueName);
  
  channel.consume(queueName, (msg) => {
    const payload = JSON.parse(msg.content.toString());
    
    console.log(`📨 ${payload.table} - ${payload.method.toUpperCase()}`);
    console.log(`🆔 ID: ${payload.record_id} (${payload.primary_key})`);
    console.log(`📅 Timestamp: ${payload.timestamp}`);
    
    // Process untuk database mirroring
    processForMirroring(payload);
    
    channel.ack(msg);
  });
};

const processForMirroring = (payload) => {
  // Implementasi database mirroring
  switch (payload.method) {
    case 'create':
      // Replicate INSERT ke mirror database
      // Pastikan menggunakan record_id yang sama
      mirrorDatabase.insert(payload.table, {
        ...payload.data,
        [payload.primary_key]: payload.record_id
      });
      break;
      
    case 'update':
      // Replicate UPDATE ke mirror database
      mirrorDatabase.update(payload.table, payload.record_id, payload.data);
      break;
      
    case 'delete':
      // Replicate soft DELETE ke mirror database
      mirrorDatabase.softDelete(payload.table, payload.record_id, payload.data);
      break;
  }
};
```

## 🎯 Key Points untuk Database Mirroring

1. **ID Consistency**: Setiap payload selalu menyertakan `record_id` dan `primary_key`
2. **SQL Query**: Field `query_sql` berisi exact SQL yang dieksekusi
3. **Complete Data**: Field `data` berisi data yang dioperasikan
4. **Result Data**: Field `result` berisi hasil lengkap dari database
5. **Timestamp**: Semua operasi memiliki timestamp untuk sequencing
6. **Operation ID**: Unique operation ID untuk tracking dan debugging

## 📊 Monitoring

### Queue Stats
```bash
# Check queue stats via RabbitMQ Management API
curl -u guest:guest http://localhost:9506/api/queues/%2f/database_changes_queue_sso

# Check exchange stats
curl -u guest:guest http://localhost:9506/api/exchanges/%2f/database_operations
```

### Application Logs
```bash
# Monitor queue operations in application logs
tail -f logs/application/$(date +%Y)/$(date +%-m)/$(date +%-d).log | grep -E "(✅|❌).*Queue"
```

---

**Queue Name**: `database_changes_queue_sso`  
**Exchange**: `database_operations`  
**Updated**: September 19, 2025  
**Version**: 1.1.0
