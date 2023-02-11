/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("workspace", function (table) {
    table.increments("id").primary().unsigned();
    table.string("name").notNullable();
    table.string("owner_user_id").notNullable();
    table.timestamps(true, true); //Add created_at and also updated_at
    table.index(["owner_user_id"], "index_workspace_on_owner_user_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("workspace")]);
};
