/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("query_schedule", function (table) {
    table.increments("id").primary().unsigned();
    table.integer("query_id").notNullable();
    table.string("g_sheet_id").notNullable();
    table.string("interval", 255).notNullable();
    table.string("status", 255).notNullable();
    table.timestamps(true, true); //Add created_at and also updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("query_schedule")]);
};
