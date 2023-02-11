/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("workspace_to_users", function (table) {
    table.increments("id").primary().unsigned();
    table.integer("user_id").notNullable();
    table.integer("workspace_id", 255).notNullable();
    table.timestamps(true, true); //Add created_at and also updated_at
    table.string("role", 255).notNullable(); //Make sure that the role is only one of the following currently: ADMIN, MEMBER
    table.primary(["user_id", "workspace_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("workspace_to_users")]);
};
