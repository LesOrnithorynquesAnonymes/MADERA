var db = require('../db/connect_db.js');

client = new db({tableName: "client"});
var Client_Model = db.extend({tableName : "client"});

function newCli(first_name, last_name,address,phone,city,mail,cp){

  cli = new Client_Model({
    first_name  : first_name,
    last_name   : last_name,
    address     : address,
    phone       : phone,
    city        : city,
    mail        : mail,
    cp          : cp
  });
  cli.save();
}
