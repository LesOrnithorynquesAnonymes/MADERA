
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

router.post('/project', (req, res) => {
  //console.log(__dirname, req.params);
  Projet = require('../app/components/project/projet_db.js');

  projet = new Projet();

  res.json(projet.find('all'));
});


router.post('/client/add', (req, res) => {
  //console.log(__dirname, req.params);
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
