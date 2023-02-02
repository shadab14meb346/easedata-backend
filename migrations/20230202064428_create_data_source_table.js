/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("data_source", function (table) {
    table.increments("id").primary().unsigned();
    table.string("type", 255).notNullable();
    table.string("access_token", 255).defaultTo("");
    table.string("refresh_token", 255).defaultTo("");
    table.index(["type"], "index_type_on_data_source");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("users")]);
};
