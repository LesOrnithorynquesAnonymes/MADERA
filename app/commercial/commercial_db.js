var db = require('../db/connect_db.js');
var mysqlModel = require('mysql-model');

function byID(id){
  db.query("SELECT * FROM commercial where commercial.com_id = " + db.escape(id), function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      for(var key in result) {
        console.log(result[key].matricule);
      }
    });
}

commercial = new MyAppModel({tableName: "commercial"});

commercial.find('all', function(err, rows, fields) {
  console.log(rows);
  console.log(fields);
})

// byID(2);
