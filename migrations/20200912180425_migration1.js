exports.up = function (knex) {
  return knex.transaction(async function (trx) {
    await trx.schema.dropTableIfExists('users');
    await trx.schema.dropTableIfExists('applications');

    await trx.schema.createTable('users', function (table) {
      table.integer('id').notNullable();
      table.string('name', 30).notNullable();
      table.string('username', 30).notNullable();
      table.string('password', 30).notNullable();
      table.integer('age').notNullable();
      table.string('houseName', 30).notNullable();
      table.string('district', 30);
      table.string('state', 30);
    });

    await trx.schema.createTable('applications', function (table) {
      table.increments();
      table.string('clientId', 50).notNullable();
      table.string('clientSecret', 50).notNullable();
      table.string('name', 30).notNullable();
      table.string('homePage', 30).notNullable();
      table.string('description', 30).notNullable();
      table.string('callbackUrl', 30).notNullable();
    });
  });
};

exports.down = function (knex) {
  return knex.transaction(async function (trx) {
    await trx.schema.dropTableIfExists('users');
    await trx.schema.dropTableIfExists('applications');
  });
};
