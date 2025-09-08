const { usersColumns } = require('./column');
const { CorePostgres } = require('../../../repository/postgres/core_postgres');
const bcrypt = require('bcrypt');

class UsersRepository extends CorePostgres {
  constructor() {
    super('users', usersColumns);
  }

  async findById(userId) {
    return await this.findOne({ user_id: userId, is_delete: false });
  }

  async findByEmail(email) {
    return await this.findOne({ user_email: email, is_delete: false });
  }

  async findByUsername(username) {
    return await this.findOne({ user_name: username, is_delete: false });
  }

  async findAllActive() {
    return await this.findMany({ is_delete: false });
  }

  async createUser(data) {
    // Hash password if provided
    if (data.user_password) {
      data.user_password = await bcrypt.hash(data.user_password, 10);
    }
    return await this.create(data);
  }

  async updateUser(userId, data) {
    // Hash password if provided
    if (data.user_password) {
      data.user_password = await bcrypt.hash(data.user_password, 10);
    }
    return await this.update({ user_id: userId }, data);
  }

  async deleteUser(userId, deletedBy) {
    return await this.update(
      { user_id: userId },
      { 
        is_delete: true, 
        deleted_at: new Date(), 
        deleted_by: deletedBy 
      }
    );
  }

  async restoreUser(userId, updatedBy) {
    return await this.update(
      { user_id: userId },
      { 
        is_delete: false, 
        deleted_at: null, 
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      }
    );
  }

  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async getUserWithDetails(userId) {
    const query = `
      SELECT 
        u.*,
        e.employee_name,
        e.employee_email,
        r.role_name,
        t.title_name,
        d.department_name,
        c.company_name
      FROM users u
      JOIN employees e ON u.employee_id = e.employee_id
      JOIN roles r ON u.role_id = r.role_id
      JOIN titles t ON e.title_id = t.title_id
      JOIN departments d ON t.department_id = d.department_id
      JOIN companies c ON d.company_id = c.company_id
      WHERE u.user_id = ? AND u.is_delete = false
    `;
    
    const result = await this.db.raw(query, [userId]);
    return result.rows ? result.rows[0] : result[0];
  }

  async getUserPermissions(userId) {
    const query = `
      SELECT 
        p.permission_id,
        p.permission_name,
        m.menu_id,
        m.menu_name,
        m.menu_url
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      JOIN roleHasMenuPermissions rhmp ON r.role_id = rhmp.role_id
      JOIN permissions p ON rhmp.permission_id = p.permission_id
      JOIN menus m ON rhmp.menu_id = m.menu_id
      WHERE u.user_id = ? 
        AND u.is_delete = false 
        AND r.is_delete = false
        AND p.is_delete = false 
        AND m.is_delete = false
    `;
    
    const result = await this.db.raw(query, [userId]);
    return result.rows || result;
  }
}

module.exports = UsersRepository;
