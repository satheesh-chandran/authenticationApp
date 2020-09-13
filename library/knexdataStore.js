const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();

const addApplication = appDetails => applications.clone().insert(appDetails);

const getPersonDetails = id => users.clone().where({ id });

module.exports = { addApplication, getPersonDetails };
