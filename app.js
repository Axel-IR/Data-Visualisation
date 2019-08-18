//declaration of variables
var tweets = {};
var settings = undefined;

//get settings from settings.json
var settingrequest = new XMLHttpRequest();
settingrequest.open('GET', '/settings', true);
settingrequest.onload = function () {
    settings = JSON.parse(this.response);
    //get data from serv.js
    var datarequest = new XMLHttpRequest();
    datarequest.open('GET', '/data', true);
    datarequest.onload = function () {
        var data = JSON.parse(this.response);
        data = data.statuses;
        //add data underneath in list
        let str = "<ul>";
        data.forEach(tweet => {
            str += "<li>" + tweet.text + "--" + tweet.retweet_count + "</li>";
        });
        str += "</ul>";
        document.getElementById(settings.dataid).innerHTML = str;
        tweets.data = data;
        //declare p5 variable & s function
        var myp5 = new p5(s, settings.vizid);
    }
    datarequest.send();
}
settingrequest.send();
//Draw Data
var s = function (sketch) {
    //get slider from index
    var slider = document.getElementById("slider");
    //sketch settings
    sketch.setup = function () {
        const w = document.getElementById(settings.vizid).offsetWidth;
        sketch.createCanvas(w, w);           
       
        sketch.textSize(50);
        sketch.colorMode(sketch.HSB, 255);
        sketch.textAlign(sketch.CENTER);
       
    };
    //Drawing function
    sketch.draw = function () {
       
        sketch.frameRate(parseInt(slider.value));//raise frame rate depending from slider value
        //setting color
        sketch.background(settings.secondarycolor); 
        sketch.fill(settings.primarycolor);
        sketch.stroke(settings.primarycolor);
        //for loop iterate trough tweets & show them on rectangle 
        for (let i = 0; i < tweets.data.length; i++) {
            var rdm = Math.floor(Math.random() * 2000);
            var color = Math.floor(Math.random() * 255);
            sketch.fill(sketch.color(color, 255, 255));
            WordsRandom(tweets.data[i].text, i, tweets.data[i].retweet_count + rdm);
        }
    }
        //Text function
    function WordsRandom(text, x, y) {
        sketch.text(text, x, y);
    }
};