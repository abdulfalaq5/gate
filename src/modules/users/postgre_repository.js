const { usersColumns } = require('./column');

/**
 * Users Repository - Database operations for users table
 */
class UsersRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'users'
  }

  async findById(userId) {
    const [user] = await this.knex(this.tableName)
      .select('*')
      .where('user_id', userId)
      .where('is_delete', false)
    
    return user
  }

  async findByEmail(email) {
    const [user] = await this.knex(this.tableName)
      .select('*')
      .where('user_email', email)
      .where('is_delete', false)
    
    return user
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  async createUser(data) {
    const [user] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return user
  }

  async updateUser(userId, data) {
    const [user] = await this.knex(this.tableName)
      .where('user_id', userId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return user
  }

  async deleteUser(userId, deletedBy) {
    const [user] = await this.knex(this.tableName)
      .where('user_id', userId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return user
  }
}

module.exports = UsersRepository;