const mysql = require('mysql');

const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});


module.exports = { con };