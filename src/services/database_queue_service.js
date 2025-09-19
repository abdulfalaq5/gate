const { publishToRabbitMqQueueSingle } = require('../config/rabbitmq');

/**
 * Service untuk mengirim queue ke RabbitMQ untuk semua operasi database
 * Digunakan untuk tracking perubahan data di sistem
 */
class DatabaseQueueService {
  constructor() {
    this.exchangeName = 'database_operations';
    this.queueName = 'database_changes_queue_sso'; // sesuaikan dengan nama queue yang ada di rabbitmq
  }

  /**
   * Generate SQL query untuk operasi CREATE
   * @param {string} tableName - Nama tabel
   * @param {object} data - Data yang akan diinsert
   * @returns {string} - SQL query
   */
  generateInsertQuery(tableName, data) {
    const columns = Object.keys(data);
    const values = Object.values(data).map(val => 
      val === null ? 'NULL' : 
      typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` :
      typeof val === 'boolean' ? val :
      typeof val === 'object' && val instanceof Date ? `'${val.toISOString()}'` :
      val
    );
    
    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
  }

  /**
   * Generate SQL query untuk operasi UPDATE
   * @param {string} tableName - Nama tabel
   * @param {string} primaryKey - Nama kolom primary key
   * @param {string|number} id - ID record yang diupdate
   * @param {object} data - Data yang akan diupdate
   * @returns {string} - SQL query
   */
  generateUpdateQuery(tableName, primaryKey, id, data) {
    const setParts = Object.entries(data).map(([key, val]) => {
      const value = val === null ? 'NULL' : 
        typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` :
        typeof val === 'boolean' ? val :
        typeof val === 'object' && val instanceof Date ? `'${val.toISOString()}'` :
        val;
      return `${key} = ${value}`;
    });
    
    return `UPDATE ${tableName} SET ${setParts.join(', ')} WHERE ${primaryKey} = '${id}'`;
  }

  /**
   * Generate SQL query untuk operasi DELETE (soft delete)
   * @param {string} tableName - Nama tabel
   * @param {string} primaryKey - Nama kolom primary key
   * @param {string|number} id - ID record yang didelete
   * @param {object} deleteData - Data untuk soft delete
   * @returns {string} - SQL query
   */
  generateDeleteQuery(tableName, primaryKey, id, deleteData) {
    return this.generateUpdateQuery(tableName, primaryKey, id, deleteData);
  }

  /**
   * Kirim queue untuk operasi CREATE
   * @param {string} tableName - Nama tabel
   * @param {object} data - Data yang dibuat
   * @param {object} result - Result dari operasi database
   */
  async sendCreateQueue(tableName, data, result = null) {
    try {
      const querySQL = this.generateInsertQuery(tableName, data);
      
      const payload = {
        database: process.env.DB_NAME || 'gate_db',
        table: tableName,
        method: 'create',
        query_sql: querySQL,
        data: data,
        result: result,
        timestamp: new Date().toISOString(),
        operation_id: this.generateOperationId()
      };

      await publishToRabbitMqQueueSingle(this.exchangeName, this.queueName, payload);
      console.log(`✅ Queue sent for CREATE operation on table: ${tableName}`);
    } catch (error) {
      console.error(`❌ Failed to send CREATE queue for table ${tableName}:`, error);
    }
  }

  /**
   * Kirim queue untuk operasi UPDATE
   * @param {string} tableName - Nama tabel
   * @param {string} primaryKey - Nama kolom primary key
   * @param {string|number} id - ID record yang diupdate
   * @param {object} data - Data yang diupdate
   * @param {object} result - Result dari operasi database
   */
  async sendUpdateQueue(tableName, primaryKey, id, data, result = null) {
    try {
      const querySQL = this.generateUpdateQuery(tableName, primaryKey, id, data);
      
      const payload = {
        database: process.env.DB_NAME || 'gate_db',
        table: tableName,
        method: 'update',
        query_sql: querySQL,
        data: data,
        record_id: id,
        primary_key: primaryKey,
        result: result,
        timestamp: new Date().toISOString(),
        operation_id: this.generateOperationId()
      };

      await publishToRabbitMqQueueSingle(this.exchangeName, this.queueName, payload);
      console.log(`✅ Queue sent for UPDATE operation on table: ${tableName}, ID: ${id}`);
    } catch (error) {
      console.error(`❌ Failed to send UPDATE queue for table ${tableName}:`, error);
    }
  }

  /**
   * Kirim queue untuk operasi DELETE (soft delete)
   * @param {string} tableName - Nama tabel
   * @param {string} primaryKey - Nama kolom primary key
   * @param {string|number} id - ID record yang didelete
   * @param {object} deleteData - Data untuk soft delete
   * @param {object} result - Result dari operasi database
   */
  async sendDeleteQueue(tableName, primaryKey, id, deleteData, result = null) {
    try {
      const querySQL = this.generateDeleteQuery(tableName, primaryKey, id, deleteData);
      
      const payload = {
        database: process.env.DB_NAME || 'gate_db',
        table: tableName,
        method: 'delete',
        query_sql: querySQL,
        data: deleteData,
        record_id: id,
        primary_key: primaryKey,
        result: result,
        timestamp: new Date().toISOString(),
        operation_id: this.generateOperationId()
      };

      await publishToRabbitMqQueueSingle(this.exchangeName, this.queueName, payload);
      console.log(`✅ Queue sent for DELETE operation on table: ${tableName}, ID: ${id}`);
    } catch (error) {
      console.error(`❌ Failed to send DELETE queue for table ${tableName}:`, error);
    }
  }

  /**
   * Generate unique operation ID untuk tracking
   * @returns {string} - Unique operation ID
   */
  generateOperationId() {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Kirim queue khusus untuk companies
   */
  async sendCompaniesCreateQueue(data, result) {
    return this.sendCreateQueue('companies', data, result);
  }

  async sendCompaniesUpdateQueue(id, data, result) {
    return this.sendUpdateQueue('companies', 'company_id', id, data, result);
  }

  async sendCompaniesDeleteQueue(id, deleteData, result) {
    return this.sendDeleteQueue('companies', 'company_id', id, deleteData, result);
  }

  /**
   * Kirim queue khusus untuk departments
   */
  async sendDepartmentsCreateQueue(data, result) {
    return this.sendCreateQueue('departments', data, result);
  }

  async sendDepartmentsUpdateQueue(id, data, result) {
    return this.sendUpdateQueue('departments', 'department_id', id, data, result);
  }

  async sendDepartmentsDeleteQueue(id, deleteData, result) {
    return this.sendDeleteQueue('departments', 'department_id', id, deleteData, result);
  }

  /**
   * Kirim queue khusus untuk titles
   */
  async sendTitlesCreateQueue(data, result) {
    return this.sendCreateQueue('titles', data, result);
  }

  async sendTitlesUpdateQueue(id, data, result) {
    return this.sendUpdateQueue('titles', 'title_id', id, data, result);
  }

  async sendTitlesDeleteQueue(id, deleteData, result) {
    return this.sendDeleteQueue('titles', 'title_id', id, deleteData, result);
  }

  /**
   * Kirim queue khusus untuk employees
   */
  async sendEmployeesCreateQueue(data, result) {
    return this.sendCreateQueue('employees', data, result);
  }

  async sendEmployeesUpdateQueue(id, data, result) {
    return this.sendUpdateQueue('employees', 'employee_id', id, data, result);
  }

  async sendEmployeesDeleteQueue(id, deleteData, result) {
    return this.sendDeleteQueue('employees', 'employee_id', id, deleteData, result);
  }
}

module.exports = new DatabaseQueueService();
