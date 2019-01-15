var tweets = {};
var settings = undefined;
var settingrequest = new XMLHttpRequest();
settingrequest.open('GET', '/settings', true);
settingrequest.onload = function () {
    settings = JSON.parse(this.response);
    var datarequest = new XMLHttpRequest();
    datarequest.open('GET', '/data', true);
    datarequest.onload = function () {
        var data = JSON.parse(this.response);
        data = data.statuses;
        let str = "<ul>";
        data.forEach(tweet => {
            str += "<li>" + tweet.text + "--" + tweet.retweet_count + "</li>";
        });
        str += "</ul>";
        document.getElementById(settings.dataid).innerHTML = str;
        tweets.data = data;
        var myp5 = new p5(s, settings.vizid);
    }
    datarequest.send();
}
settingrequest.send();

var s = function (sketch) {
    
    var slider = document.getElementById("slider");
    sketch.setup = function () {
        const w = document.getElementById(settings.vizid).offsetWidth;
        sketch.createCanvas(w, w);           
        console.log(tweets);
        sketch.textSize(50);
        sketch.colorMode(sketch.HSB, 255);
        sketch.textAlign(sketch.CENTER);
       
    };
    sketch.draw = function () {
        console.log(slider.value);
        sketch.frameRate(parseInt(slider.value));
        sketch.background(settings.secondarycolor);
        sketch.fill(settings.primarycolor);
        sketch.stroke(settings.primarycolor);
        let w = sketch.width;
        for (let i = 0; i < tweets.data.length; i++) {
            var rdm = Math.floor(Math.random() * 2000);
            var color = Math.floor(Math.random() * 255);
            sketch.fill(sketch.color(color, 255, 255));
            WordsRandom(tweets.data[i].text, i, tweets.data[i].retweet_count + rdm);
        }
    }

    function WordsRandom(text, x, y) {
        sketch.text(text, x, y);
    }
};