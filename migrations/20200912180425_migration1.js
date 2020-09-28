exports.up = function (knex) {
  return knex.transaction(async function (trx) {
    await trx.schema.dropTableIfExists('users');
    await trx.schema.dropTableIfExists('stories');
    await trx.schema.dropTableIfExists('responses');
    await trx.schema.dropTableIfExists('followers');
    await trx.schema.dropTableIfExists('applications');
    await trx.schema.dropTableIfExists('savedStories');

    await trx.schema.createTable('users', function (table) {
      table.increments();
      table.string('name', 30).notNullable();
      table.string('username', 30).notNullable().unique();
      table.string('password', 30).notNullable();
      table.string('company', 30).notNullable();
      table.string('email', 30).notNullable();
    });

    await trx.schema.createTable('applications', function (table) {
      table.increments();
      table.string('clientId', 100).notNullable();
      table.string('clientSecret', 100).notNullable();
      table.string('name', 100).notNullable();
      table.string('homePage', 100).notNullable();
      table.string('description', 100).notNullable();
      table.string('callbackUrl', 100).notNullable();
      table.timestamp('createdAt').defaultTo(trx.fn.now());
      table.integer('ownerId').notNullable();
      table.foreign('ownerId').references('users.id');
    });

    await trx.schema.createTable('stories', function (table) {
      table.increments();
      table.string('title', 100).notNullable();
      table.string('body', 1000).notNullable();
      table.integer('claps').defaultTo(0);
      table.timestamp('receivedAt').defaultTo(trx.fn.now());
      table.timestamp('modifiedAt').defaultTo(trx.fn.now());
      table.integer('ownerId').notNullable();
      table.foreign('ownerId').references('users.id');
    });

    await trx.schema.createTable('responses', function (table) {
      table.increments();
      table.string('message', 100).notNullable();
      table.timestamp('receivedAt').defaultTo(trx.fn.now());
      table.timestamp('modifiedAt').defaultTo(trx.fn.now());
      table.integer('ownerId').notNullable();
      table.integer('storyId').notNullable();
      table.foreign('ownerId').references('users.id');
      table.foreign('storyId').references('stories.id');
    });

    await trx.schema.createTable('followers', function (table) {
      table.integer('leaderId').notNullable();
      table.integer('followerId').notNullable();
      table.foreign('leaderId').references('users.id');
      table.foreign('followerId').references('users.id');
      table.primary(['leaderId', 'followerId']);
    });

    await trx.schema.createTable('savedStories', function (table) {
      table.integer('userId').notNullable();
      table.integer('storyId').notNullable();
      table.foreign('userId').references('users.id');
      table.foreign('storyId').references('stories.id');
      table.primary(['userId', 'storyId']);
    });
  });
};

exports.down = function (knex) {
  return knex.transaction(async function (trx) {
    await trx.schema.dropTableIfExists('users');
    await trx.schema.dropTableIfExists('stories');
    await trx.schema.dropTableIfExists('responses');
    await trx.schema.dropTableIfExists('followers');
    await trx.schema.dropTableIfExists('applications');
    await trx.schema.dropTableIfExists('savedStories');
  });
};
