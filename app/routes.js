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

router.get('/3D', (req, res) => {
    window.location = '../plugin/plan/index.html';

});

router.get('project/:id/plans', (req, res) =>{
  Plan = require('../app/components/plan/plan_db.js');
  console.log(req.params[0].projet_id);
  plan = new Plan();

  plan.find('all', {where: 'projet_id = ' + req.params[0].projet_id}, function(err,rows,fields){
    res.json(rows);
    console.log(rows);
  });

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

router.get('plan/:id/', (req, res) =>{
  Plan = require('../app/components/plan/plan_db.js');
  console.log(req.params[0].id);
  plan = new Plan();

  plan.find('all', {where: 'id = ' + req.params[0].id}, function(err,rows,fields){
    res.json(rows);
  });

});

router.post('plan/:id/update', (req,res) =>{
  Plan = require('../app/components/plan/plan_db.js');
  plan = new Plan();
  console.log(req.params[0].id);
  plan.set('id',parseInt(req.params[0].id));
  plan.set('rep3D',req.params[0].updated3D);
  //plan.set('name','toto');
  plan.save();
});

router.post('/plan/add', (req, res) => {
  Plan = require('../app/components/plan/plan_db.js');
   var basicPlan = '{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}';

  plan = new Plan({
    name : req.params[0].titre,
    description : req.params[0].description,
    projet_id : req.params[0].projet_id,
    rep3D: basicPlan
  });

  plan.save();
})
