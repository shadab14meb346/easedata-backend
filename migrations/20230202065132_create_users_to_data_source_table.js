/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("users_to_data_source", function (table) {
    table.increments("id").primary().unsigned();
    table.integer("user_id").notNullable();
    table.integer("data_source_id", 255).notNullable();
    table.primary(["user_id", "data_source_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("users")]);
};
