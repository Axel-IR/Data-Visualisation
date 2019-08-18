/*http://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
/*https://github.com/d3/d3/blob/master/CHANGES.md*/
/*https://github.com/d3/d3/blob/master/API.md#easings-d3-ease*/
//Size of the rectangle
var height = window.innerHeight - 200;
var width = window.innerWidth / 2.8;
//String to date value (year)
var parseDatayear = d3.timeParse("%Y");
// declare a tree layout
var tree = d3.tree().size([width, height]);
d3.json("../data/data.json").get(function (error, data) {
    var margin = {
        left: 200,
        right: 100,
        top: 50,
        bottom: 0
    };
    //parent
    var root = d3.hierarchy(data);
    tree(root);
    //declare div & add div in body
    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    //append the svg variable to the body
    var svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%");
    //declare year & values array
    var year = [];
    var values = {};


    for (city in data) {


        values[city] = [];

        //add values from json file to the Arrays
        for (x in data[city]) {
            values[city].push(data[city][x]);
        }
        for (x in data['Antwerpen']) {
            year.push(x);
        }

    }
    //Scale year values  
    var x = d3.scaleTime().domain(d3.extent(year, function (d) {
        return parseDatayear(d);
    })).range([0, width * 2]);

    var y = {};
    var citiesVal = values['Vlaams-brabant'].concat(values['Antwerpen']);

    yCitiesVal = d3.scaleLinear().domain(d3.extent(citiesVal, function (d) {
        return d + 50;
    })).range([height - 20, 0]);

    for (city in data) {
        y[city] = [];
        //Scale values
        y[city] = d3.scaleLinear().domain(d3.extent(values[city], function (d) {
            return d + 50;
        })).range([height - 50, 0]);
    }
    var duration = {};

    duration['Vlaams-brabant'] = 1500;
    duration['Antwerpen'] = duration['Vlaams-brabant'] * 2;


    for (city in data) {
        // declare chartGroup & append group element to svg
        var chartGroup = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //append data to x axis & y axis
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(yCitiesVal);
        //declare line chart
        var line = d3.line().x(function (d, i) {
            return i * width / 3;
        }).y(function (d) {
            return y[city](d);
        });
        //declare path & to chartGroup element
        var path = chartGroup.append("path").attr("stroke", "green").attr("stroke-width", "3").attr("fill", "none").attr("d", line(values[city])).on("mouseover", function () {
            $(".dot").css("fill", "green");
        }); //when hovering, it appears white
        //length of path
        var totalLength = path.node().getTotalLength();
        //path animation repeat
        path.transition().duration(duration[city]).on("start", function repeat() {
            d3.active(this).attr("stroke-dashoffset", 0).ease(d3.easeExpOut).style("stroke", "green").transition().attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).style("stroke", "white").transition().on("start", repeat);
        });
        //add values to on y axis & g element
        chartGroup.append("g").attr("transform", "translate(" + -100 + ",0)").attr("class", "axis y").call(yAxis);
        //add year values to g element & x axis
        chartGroup.append("g").attr("transform", "translate(0," + (height + 100) + ")").attr("class", "axis x hidden").call(xAxis);
        //select all points equal to year values 
        chartGroup.selectAll("circle").data(year).enter().append("circle").attr("class", "dot").attr("id", city).attr("cx", function (d, i) {
            return i * width / 3;
        }).attr("cy", function (d, i) {
            if (i < 7) {
                return y[city](values[city][i]);
            }

        }).attr("r", function (d, i) {
            if (i == 0 || i == 6) {
                return 15;
            } else {
                return 0;
            }
        }).on("mouseover", function (d, i) { //appear when hovering on path

            $("g.axis.x").show();
            $("g.axis.x").css("stroke", "white");
            console.log("hit");
            $("g.axis.y").show();
            $("g.axis.y").css("stroke", "white");
            div.transition() //animation tooltip
                .duration(200).style("opacity", .9);
            div.html(this.id + "<br/>" + values[this.id][i] + "<br/>" + year[i]).style("left", (d3.event.pageX - 100) + "px").style("top", (d3.event.pageY) + "px");
        }).on("mouseout", function () { //disappear when mouse is not nearby
            $("g.axis.x").hide();
            $("g.axis.y").hide();
            div.transition().duration(500).style("opacity", 0);
        }).style("fill", "green");
    }
});
