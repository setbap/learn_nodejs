const mysql = require("mysql2");
const pool = mysql.createPool({
    user : "root",
    password : "sina1234",
    database : "node_app",
    host : "localhost"
})

module.exports = pool.promise();