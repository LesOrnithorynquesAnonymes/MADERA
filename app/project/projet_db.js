var db = require('../db/connect_db.js');
const Router = require('electron-router');
let router = Router('DB');

router.post('/projet/addProjet', (req, res)=> {
  console.log('Received', req.params);
   res.json( err, result );
})

projet = new db({tableName: "projet"});
var Projet_Model = db.extend({tableName : "projet"});


function newProj(name, id_com, id_client){
  projet = new Projet_Model({
    name : name_proj,
    id_com : id_com,
    id_client : id_client
  });
  projet.save();
}
