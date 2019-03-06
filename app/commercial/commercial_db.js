var db = require('../db/connect_db.js');


function byID(id){
  db.query("SELECT * FROM commercial where commercial.com_id = " + db.escape(id), function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      for(var key in result) {
        console.log(result[key].matricule);
      }
    });
}


byID(2);
