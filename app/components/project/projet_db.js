var db = require('../db/connect_db.js');

var Projet = db.extend({
    tableName: "project",
});

module.exports = Projet
