/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('candidates', (table) => {
    table.uuid('candidate_id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('company_id').nullable();
    table.uuid('department_id').nullable();
    table.uuid('title_id').nullable();
    table.string('candidate_name', 255).nullable();
    table.string('candidate_email', 255).nullable();
    table.string('candidate_phone', 255).nullable();
    table.string('candidate_religion', 255).nullable();
    table.string('candidate_gender', 255).nullable();
    table.string('candidate_marital_status', 255).nullable();
    table.integer('candidate_age').nullable();
    table.date('candidate_date_birth').nullable();
    table.string('candidate_nationality', 255).nullable();
    table.string('candidate_city', 255).nullable();
    table.string('candidate_state', 255).nullable();
    table.string('candidate_country', 255).nullable();
    table.text('candidate_address').nullable();
    table.text('candidate_foto').nullable();
    table.text('candidate_resume').nullable();
    table.string('candidate_number', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at');
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at');
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('candidates');
};

