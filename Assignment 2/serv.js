//declare express & port it's going to use.
const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
var tweetsData = undefined;//variable to store data from API

//Route to index
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
//Store data from API to variable
app.get('/data', function (req, res) {
    res.send(tweetsData);
});
//settings
app.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/settings.json'));
});
// Route to app
app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app.js'));
});



//Twitter api client
var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

//parameter for search query
var params = { q: 'Star Wars lang:en', count: 30 };

//Search request, parameter & function
T.get('search/tweets', params, getData);
//function to get data trough twit client api
function getData(err, data, response) {
  tweetsData = data;
  app.listen(port, () => console.log(`tweets app listening on port ${port}!`));//start server on port 3000
};
