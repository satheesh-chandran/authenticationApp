const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();

const addApplication = appDetails => applications.clone().insert(appDetails);

const getUserDetails = id => users.clone().where({ id });

const getAppDetails = entries => applications.clone().where(entries);

module.exports = { addApplication, getUserDetails, getAppDetails };
