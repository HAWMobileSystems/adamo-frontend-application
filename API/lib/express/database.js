const pgp = require('pg-promise')( /*options*/ )

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }
require('dotenv').config({
  path: './../.env'
})
const cn = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // host: '0.0.0.0',
  // // host: 'ipim-intsys.lab.if.haw-landshut.de',
  // port: 5432,
  // database: 'ipim',
  // user: 'postgres',
  // password: '12341234'
};
// console.log("user", cn.host, cn.user, cn.type)
// console.log("proces env", process.env)
const db = pgp(cn);

module.exports = db;