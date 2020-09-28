require('dotenv').config({ path: './.env' });
const { env } = process;
const { DbClient, DatabaseUrlT, DatabaseUrl, PG_database, DATABASE_URL } = env;

// module.exports = {
//   development: {
//     client: DbClient,
//     connection: {
//       filename: DatabaseUrl
//     },
//     useNullAsDefault: true
//   },

//   test: {
//     client: DbClient,
//     connection: {
//       filename: DatabaseUrlT
//     },
//     useNullAsDefault: true
//   }
// };

module.exports = {
  development: {
    client: 'pg',
    connection: { database: PG_database, host: DATABASE_URL },
    seeds: { directory: `${__dirname}/seeds` }
  }
};
