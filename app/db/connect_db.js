var mysql = require('mysql');
<<<<<<< HEAD
console.log("Trying to connect..");
=======

>>>>>>> 1f3803c0e77ce2673558362505d329d9ba27b455
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
