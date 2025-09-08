const { systemsColumns } = require('./column');
const { CorePostgres } = require('../../../repository/postgres/core_postgres');

class SystemsRepository extends CorePostgres {
  constructor() {
    super('systems', systemsColumns);
  }

  async findById(systemId) {
    return await this.findOne({ system_id: systemId, is_delete: false });
  }

  async findAllActive() {
    return await this.findMany({ is_delete: false });
  }

  async createSystem(data) {
    return await this.create(data);
  }

  async updateSystem(systemId, data) {
    return await this.update({ system_id: systemId }, data);
  }

  async deleteSystem(systemId, deletedBy) {
    return await this.update(
      { system_id: systemId },
      { 
        is_delete: true, 
        deleted_at: new Date(), 
        deleted_by: deletedBy 
      }
    );
  }

  async restoreSystem(systemId, updatedBy) {
    return await this.update(
      { system_id: systemId },
      { 
        is_delete: false, 
        deleted_at: null, 
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      }
    );
  }
}

module.exports = SystemsRepository;
