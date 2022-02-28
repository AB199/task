const NodeCache = require('node-cache');
const GithubService = require('../services/githubService');

class GithubController {

  constructor() {
    this.githubService = new GithubService();
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }

  
  validateUsernameParams(req, res) {
    const username = req.query.username;
    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ status: 'ERROR', message: 'invalidParameters' });
    }
  }

  //validate if username and repoName are available in the request
  validateParams(req, res) {

    const repoName = req.query.reponame;
    const username = req.query.username;
    if (!username || !username.trim() || !repoName || !repoName.trim()) {
      return res
        .status(400)
        .json({ status: 'ERROR', message: 'invalidParameters' });
    }
  }

  //get data from cache if available
  async retrieveCachedData(cacheKey, serviceFn, userName, repoName ) {
    const dataCached = this.cache.get(cacheKey);
    if (dataCached === undefined || dataCached === null) {
      if(serviceFn === 'getRepoDetails') {
        var data = await this.githubService.getRepoDetails(userName, repoName );
      } else{
        var data = await this.githubService[serviceFn](userName);
      }
      this.cache.set(cacheKey, JSON.stringify(data), 60 * 1000);
      return data
    } else {
      return JSON.parse(dataCached)
    }
  }

 //get list of user repositories
 //first searching in cache and if not available then calling github graphQL api
  async getRepoList(req, res) {
    try {
      this.validateUsernameParams(req, res);
      const username = req.query.username;
      const cacheKey = `/repositories/${username}`;
      const data = await this.retrieveCachedData(cacheKey, 'getRepo', username);
      return res
        .status(200)
        .json({ status: 'OK', data });

    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: 'ERROR', message: 'internalServerError' });
    }
  }

  //get details of a repository
  //first searching in cache and if not available then calling github graphQL api
  async getRepoDetails(req, res) {
    try {
      this.validateParams(req, res);
      const username = req.query.username;
      const repoName = req.query.reponame;
      const cacheKey = `/repositories/${username}/${repoName}`;
      const data = await this.retrieveCachedData(cacheKey, 'getRepoDetails', username, repoName);
      return res
        .status(200)
        .json({ status: 'OK', data });

    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: 'ERROR', message: 'internal_server_error' });
    }
  }
}

module.exports = GithubController;