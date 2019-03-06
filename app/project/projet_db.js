var db = require('../db/connect_db.js');


projet = new db({tableName: "projet"});
var Projet_Model = db.extend({tableName : "projet"});


function newCom(name, id_com, id_client){
  projet = new Projet_Model({
    name : name_proj,
    id_com : id_com,
    id_client : id_client
  });
  projet.save();
}
