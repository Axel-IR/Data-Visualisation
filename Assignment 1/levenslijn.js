/*http://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
/*https://github.com/d3/d3/blob/master/CHANGES.md*/
/*https://github.com/d3/d3/blob/master/API.md#easings-d3-ease*/
//Size of the rectangle
var height = window.innerHeight - 200;
var width = window.innerWidth / 2.5;
//String to date value (year)
var parseDatayear = d3.timeParse("%Y");
// declare a tree layout
var tree = d3.tree().size([width, height]);
d3.json("data/data.json").get(function (error, data) {
    var margin = {
        left: 200
        , right: 100
        , top: 50
        , bottom: 0
    };
    //parent
    var root = d3.hierarchy(data);
    tree(root);
    //declare div & add div in body
    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    //append the svg variable to the body
    var svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%");
    // declare chartGroup & append group element to svg
    var chartGroup = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //declare year & values array
    var year = {};
    var values = {};
    //add values from json file to the Arrays
    for (city in data) {
        values[city] = [];
        year[city] = [];
        for (x in data[city]) {
            values[city].push(data[city][x]);
        }
        for (x in data[city]) {
            year[city].push(x);
        }
    }
    for (city in data) {
        //Scale year values  
        var x = scaleX(city, year);
        //Scale values
        var y = scaleY(city, values);
        //append data to x axis & y axis
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);
        //declare line chart
        var line = d3.line().x(function (d, i) {
            return i * width / 3;
        }).y(function (d) {
            return y(d);
        });
        //declare path & to chartGroup element
        var path = chartGroup.append("path").attr("stroke", "green").attr("stroke-width", "3").attr("fill", "none").attr("d", line(values[city])).on("mouseover", function () {
            $(".dot").css("fill", "green");
        });
        //when hovering, it appears white
        //length of path
        var totalLength = path.node().getTotalLength();
        //path animation repeat
        path.transition().duration(700).on("start", function repeat() {
            d3.active(this).attr("stroke-dashoffset", 0).ease(d3.easeExpOut).style("stroke", "green").transition().attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).style("stroke", "white").transition().on("start", repeat);
        });
        //add values to on y axis & g element
        chartGroup.append("g").attr("transform", "translate(" + -50 + ",0)").attr("class", "axis y").call(yAxis);
        //add year values to g element & x axis
        chartGroup.append("g").attr("transform", "translate(0," + (height + 20) + ")").attr("class", "axis x hidden").call(xAxis);
        //select all points equal to year values 
        chartGroup.selectAll("circle").data(year[city]).enter().append("circle").attr("class", "dot").attr("cx", function (d, i) {
            return i * width / 3;
        }).attr("cy", function (d, i) {
            for (city in data) {
                return y(values[city][i]);
            }
        }).attr("r", function (d, i) {
            if (i == 0 || i == 6) {
                return 15;
            }
            else {
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
            div.html(values[city][i] + "<br/>" + year[city][i]).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 50) + "px");
        }).on("mouseout", function () { //disappear when mouse is not nearby
            $("g.axis.x").hide();
            $("g.axis.y").hide();
            div.transition().duration(500).style("opacity", 0);
        }).style("fill", "green");
    }
});

function scaleX(city, year) {
    return (d3.scaleTime().domain(d3.extent(year[city], function (d) {
        return parseDatayear(d);
    }))).range([0, width * 2]);
}

function scaleY(city, values) {
    return d3.scaleLinear().domain(d3.extent(values[city], function (d) {
        return d + 10;
    })).range([height - 20, 0]);
}