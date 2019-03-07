var db = require('../db/connect_db.js');

commercial = new db({tableName: "commercial"});
var Commercial_Model = db.extend({tableName : "commercial"});

function byID(id) {
  commercial.find('all',{where:'com_id = ' + id}, function(err, rows, fields) {
    console.log(rows);
    //console.log(fields);
  });
}

function byEmail(email){
  commercial.find('all',{where:'com_id = ' + id}, function(err, rows, fields) {
    console.log(rows);
    //console.log(fields);
  });
}


function newComm(first_name, last_name,login,matricule,pwd,synchro){
  comm = new Commercial_Model({
    first_name  : first_name,
    last_name   : last_name,
    login       : address,
    matricule   : phone,
    pwd         : city,
    synchro     : mail
  });
  comm.save();
}
