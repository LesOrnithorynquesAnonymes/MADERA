var db = require('../db/connect_db.js');


var Module = db.extend({
    tableName: "module",
});

module.exports = Module
// var db = require('../db/connect_db.js');
//
//
// plan = new db({tableName: "plan"});
// var Plan_Model = db.extend({tableName : "plan"});
//
//
// function newPlan(created, description, id_projet, name, updated){
//   plan = new Projet_Model({
//     created     : created,
//     description : description,
//     id_projet   : id_projet,
//     name        : name,
//     updated     : updated
//   });
//   plan.save();
// }
//
// function getPlanOfProject(id_proj)
// {
//     plan.find('all',{where:'id_projet = ' + id_proj}, function(err, rows, fields) {
//       console.log(rows);
//       //console.log(fields);
//     });
//   }
//
// }
