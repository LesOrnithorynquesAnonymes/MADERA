
router.post('/project', (req, res) => {
  console.log(__dirname, req.params);
  Projet = require('../app/components/project/projet_db.js');

  projet = new Projet();

  projet.set('id', 4);
  projet.read();
  console.log(projet.id);
});
