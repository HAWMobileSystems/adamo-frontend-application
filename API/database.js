const pgp = require('pg-promise')(/*options*/)

const cn = {
  host: 'ipim-intsys.lab.if.haw-landshut.de',
  port: 5432,
  database: 'ipim',
  user: 'postgres',
  password: '12341234'
};

const db = pgp(cn);

module.exports = db;