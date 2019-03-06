var mysql = require('mysql');
console.log("Trying to connect..");
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password :'',
  database :'madera'
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

connection.query("SELECT * FROM projet");

//connection.end();
