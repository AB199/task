// import express
const express = require('express')
const bodyParser = require('body-parser');
const app = express();

//import .env file
require('dotenv').config()

//import github routes
const router = express.Router();
require('./routes/api')(router);

//use github routes
app.use('/api',router);
app.set('json spaces', 30);

//define the  port
const port = process.env.API_PORT || 5000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//start the server
app.listen(port,() => {
  console.info(`Server listening on ${port}`);  
});