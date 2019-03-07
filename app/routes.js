router.get('/projects', (req, res) => {
  console.log(__dirname, req.params);
  Projet = require('../app/components/project/projet_db.js');

  projet = new Projet();

  res.json(projet.find('all'));
});
