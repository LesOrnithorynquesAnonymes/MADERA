var mysql = require('mysql');

var connection = mysql.createConnnection({
  host : 'localhost:8080',
  user : 'root',
  password :'',
  database :'madera'
})

connection.connect();

//connection.query("SELECT * FROM projet");

//connection.end();
