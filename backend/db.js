require("dotenv").config();
const { Pool } = require("pg");

console.log('Connecting to DB with:');
console.log('Connecting to DB with:');
console.log({
  user: process.env.DB_USER,
  password: process.env.DB_PASS, // just for debugging — remove later
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

module.exports = pool;
