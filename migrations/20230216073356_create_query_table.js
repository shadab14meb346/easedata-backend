/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("query", function (table) {
    table.increments("id").primary().unsigned();
    table.string("name", 255).notNullable();
    table.string("description", 255).defaultTo("");
    table.integer("data_source_id").notNullable();
    table.string("table_name", 255).notNullable();
    table.integer("workspace_id").notNullable();
    table.specificType("fields", "text[]");
    table.timestamps(true, true); //Add created_at and also updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("query")]);
};
