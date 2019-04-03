const Router = require('electron-router');
let router = Router('ROUTES');

// ** AJOUT D'UN NOUVEAU PROKET **//
router.post('/project/add', (req, res) => {
  Projet = require('../app/components/project/projet_db.js');

  projet = new Projet({
    name : req.params[0].titre,
    description : req.params[0].description,
    commercial_id : 2,
    client_id: 2
  });
  projet.save();
});

router.get('/projects', (req, res) => {
  Projet = require('../app/components/project/projet_db.js');

  projet = new Projet();

  projet.find('all', function(err, rows, fields) {
    res.json(rows);
  });
});

router.get('project/:id/plans', (req, res) =>{
  Plan = require('../app/components/plan/plan_db.js');
  console.log(req.params[0].projet_id);
  plan = new Plan();
<<<<<<< HEAD

  plan.find('all', {where: 'projet_id = ' + req.params[0].projet_id}, function(err,rows,fields){
    res.json(rows);
    console.log(rows);
  });

});


router.get('/plans', (req, res) =>{
  Plan = require('../app/components/plan/plan_db.js');
  plan = new Plan();
  console.log(req.params[0].plan_id);
  /*
  plan.find('all', {where: 'id = ' + req.params[0].project_id}, function(err,rows,fields){
=======
  plan.find('all', {where: 'project_id = ' + req.params[0].project_id}, (err, rows, fields) => {
>>>>>>> 52bf80624ec33e3b928d2b1b91ba58ac3a2f37c6
    res.json(rows);
    console.log(res.json(rows));
  });
  */

});

router.post('/client/add', (req, res) => {
  Client = require('../app/components/client/client_db.js');
  console.log(req.params[0].city);
  client = new Client({
     city: req.params[0].city,
     email: req.params[0].mail,
     first_name: req.params[0].prenom,
     last_name: req.params[0].nom,
     phone: req.params[0].phone,
     zipcode : "okok"
  });
  client.save();
});


router.post('/plan/add', (req, res) => {
  Plan = require('../app/components/plan/plan_db.js');
  console.log(req.params[0].titre);
  plan = new Plan({
    name : req.params[0].titre,
    description : req.params[0].description,
    projet_id : req.params[0].project_id
  });

  plan.save();
})
