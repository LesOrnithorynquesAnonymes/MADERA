var mysql = require('mysql');

var connection = mysql.createConnnection({
  host : 'localhost:8080',
  user : 'root',
  password :'',
  database :'madera'
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//connection.query("SELECT * FROM projet");

//connection.end();
