const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();

const addApplication = appDetails => applications.clone().insert(appDetails);

const getUserDetails = entries => users.clone().where(entries);

const getAppDetails = entries => applications.clone().where(entries);

module.exports = { addApplication, getUserDetails, getAppDetails };
