// set up node to connect to our database
const mysql = require('mysql2')

const dbconnection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "Air_Aware",
    password: "password",
    port: 3306
});

dbconnection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

module.exports = dbconnection; 
