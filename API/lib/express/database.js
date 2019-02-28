const pgp = require('pg-promise')( /*options*/ )

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }

require('dotenv').config()
//   require('dotenv').config({
//     path: './../.env'
//   })
const sanitize = (value) => {
  return value.replace(/\'/g, '');
}

const cn = {
  type: 'postgres',
  host: sanitize(process.env.DB_HOST),
  database: sanitize(process.env.DB_NAME),
  port: parseInt(process.env.DB_PORT, 10),
  user: sanitize(process.env.DB_USER),
  password: sanitize(process.env.DB_PASSWORD),
  // host: '0.0.0.0',
  // // host: 'ipim-intsys.lab.if.haw-landshut.de',
  // port: 5432,
  // database: 'ipim',
  // user: 'postgres',
  // password: '12341234'
};
// console.log("cn: ", cn)
// console.log("proces env", process.env)
const db = pgp(cn);


module.exports = db;