/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async knex => {
  await knex.schema.createTable('form_sessions', table => {
    table.uuid('id').primary();
    table
      .uuid('form_id')
      .notNullable()
      .references('id')
      .inTable('forms')
      .onDelete('CASCADE');
    table.text('data').notNullable();
    table.timestamps(true, true);
    table.unique(['id', 'form_id'], {
      indexName: 'form_sessions_id_form_id_unique',
      useConstraint: true,
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async knex => {
  await knex.schema.dropTableIfExists('form_sessions');
};
