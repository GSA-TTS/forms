/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('form_documents', table => {
    table.uuid('id').primary();
    table.string('type').notNullable();
    table.string('file_name').notNullable();
    table.binary('data').notNullable();
    table.text('extract').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('form_documents');
}
