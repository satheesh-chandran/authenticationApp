require('dotenv').config({ path: './.env' });
const { env } = process;
const { DbClient, DATABASE_URL } = env;

module.exports = {
  development: {
    client: DbClient,
    connection: DATABASE_URL,
    seeds: { directory: `${__dirname}/seeds` },
    migrations: { directory: `${__dirname}/migrations` }
  }
};
