const pgp = require('pg-promise')(/*options*/)

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'ipim',
  user: 'postgres',
  password: 'postgres'
};

const db = pgp(cn);

module.exports = db;
