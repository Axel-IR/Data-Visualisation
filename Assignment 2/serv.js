const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
var tweetsData = undefined;

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/data', function (req, res) {
    res.send(tweetsData);
});

app.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/settings.json'));
});

app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app.js'));
});




var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);


var params = { q: 'Star Wars lang:en', count: 30 };

T.get('search/tweets', params, getData);

function getData(err, data, response) {
  tweetsData = data;
  app.listen(port, () => console.log(`tweets app listening on port ${port}!`));
};
