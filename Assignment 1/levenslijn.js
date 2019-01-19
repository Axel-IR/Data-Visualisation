/*http://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
/*https://github.com/d3/d3/blob/master/CHANGES.md*/
/*https://github.com/d3/d3/blob/master/API.md#easings-d3-ease*/

//Size of the rectangle
    var height = 400;
    var width = 1450;
   
//String to date value (year)
var parseDataYear = d3.timeParse("%Y");

// declare a tree layout
var tree = d3.tree().size([width, height]);
d3.json("data/data.json").get(function(error,data){
 
    var margin = {left: 50, right: 50, top: 40, bottom:0};
   //parent
    var root = d3.hierarchy(data[0]);
  
    tree(root);
    //declare div & add div in body
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    //append the svg variable to the body
    var svg = d3.select("body").append("svg").attr("width","100%").attr("height","100%");
    // declare chartGroup & append group element to svg
    var chartGroup = svg.append('g')    
    .attr("transform","translate("+margin.left+","+margin.top+")");
    
    //declare year & values array
    var Year = [];
    var values = [];
    
    //add values from json file to the Arrays
    for(x in data[0]["Vlaams-brabant"][0]){
       values.push(data[0]["Vlaams-brabant"][0][x]);
    }
    for(x in data[0]["Vlaams-brabant"][0]){
       Year.push(x);
    }
    
       //Scale year values  
     var x = d3.scaleTime()
     .domain(d3.extent(Year,function(d){return parseDataYear(d);}))
     .range([0,width]);
    //Scale values
    var y = d3.scaleLinear()
    .domain(d3.extent(values,function(d){return d+10;}))
    .range([height-20,0]);
   
    //append data to x axis & y axis
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    
        //declare line chart
     var line = d3.line()                     
                    .x(function(d,i){return i*240;})
                    .y(function(d){return y(d);})
                    .curve(d3.curveNatural);
               
   
    //declare path & to chartGroup element
      var path = chartGroup.append("path")                    
            .attr("stroke", "green")
            .attr("stroke-width","3")
            .attr("fill","none")
            .attr("d",line(values))           
            .on("mouseover",function(){$(".dot").css("fill","white");}); //when hovering, it appears white
           
                //length of path
           var totalLength = path.node().getTotalLength();
            //path animation repeat
            path            
            .transition()           
            .duration(4000)           
            .on("start", function repeat(){
                  d3.active(this)
                    .attr("stroke-dashoffset", 0) 
                    .ease(d3.easeElasticInOut) 
                    .style("stroke","white")
                    .transition()                     
                    .attr("stroke-dashoffset", totalLength)
                    .attr("stroke-dasharray", totalLength + " " + totalLength)                    
                    .style("stroke","green")
                    .transition()
                    .on("start",repeat);
                });
            
            
            
           //add values to on y axis & g element
        chartGroup.append("g")
        .attr("class","axis y")       
        .call(yAxis);
    
          //add year values to g element & x axis
        chartGroup.append("g")
        .attr("transform","translate(0,"+height+")")
        .attr("class","axis x hidden")        
        .call(xAxis);
    
         //select all points equal to year values 
    chartGroup.selectAll("circle").data(Year).enter()       
       .append("circle")      
        .attr("class", "dot")   
        .attr("cx",function(d,i){return i*240;} )
        .attr("cy",function(d,i){ return y(values[i]);})
        .attr("r", function(d,i) { return 5; })   
        .on("mouseover",function(d,i){     //appear when hovering on path
        $("g.axis.x").show();$("g.axis.x").css("stroke","white"); console.log("hit");
        $("g.axis.y").show();$("g.axis.y").css("stroke","white"); 
        div.transition()//animation
        .duration(200)
        .style("opacity", .9);	       
       div	.html( values[i]+ "<br/>"  + Year[i])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout",function(){//disappear when mouse is not nearby
        $("g.axis.x").hide();
        $("g.axis.y").hide();
          div.transition()		
                .duration(500)		
                .style("opacity", 0);	
    })
        .style("fill", "none");    
              

        
});