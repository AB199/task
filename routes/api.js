//Importing Github Controller
const GithubController = require('../controllers/githubController');

//Exporting all routes and their respective functions
module.exports = (router) => {
  const githubController = new GithubController();

  //Get all repo 
  router.get('/repo/', [], function(req, res) {
    return githubController.getRepoList(req, res);
  });

  //Get repository details of a user using Repo Name and owner name
  router.get('/repodetails/', [], function(req, res) {
    return githubController.getRepoDetails(req, res);
  });
};
