/*http://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
/*https://github.com/d3/d3/blob/master/CHANGES.md*/
/*https://github.com/d3/d3/blob/master/API.md#easings-d3-ease*/
var height = 200;
    var width = 500;
   
var parseDataYear = d3.timeParse("%Y");

var tree = d3.tree().size([width, height]);
d3.json("data/data.json").get(function(error,data){
 
    var margin = {left: 50, right: 50, top: 40, bottom:0};
   
    var root = d3.hierarchy(data[0]);
  
    tree(root);
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    var svg = d3.select("body").append("svg").attr("width","100%").attr("height","100%");
    var chartGroup = svg.append('g')    
    .attr("transform","translate("+margin.left+","+margin.top+")");
    
    var Year = [];
    var values = [];
    
    for(x in data[0]["Vlaams-brabant"][0]){
       values.push(data[0]["Vlaams-brabant"][0][x]);
    }
    for(x in data[0]["Vlaams-brabant"][0]){
       Year.push(x);
    }
    
        
     var x = d3.scaleTime()
     .domain(d3.extent(Year,function(d){return parseDataYear(d);}))
     .range([0,width]);
    
    var y = d3.scaleLinear()
    .domain(d3.extent(values,function(d){return d-10;}))
    .range([height,0]);
   
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    
  
     var line = d3.line()                     
                    .x(function(d,i){return i*84;})
                    .y(function(d){return y(d);})
                    .curve(d3.curveNatural);
               
   
    
      var path = chartGroup.append("path")                    
            .attr("stroke", "green")
            .attr("stroke-width","3")
            .attr("fill","none")
            .attr("d",line(values))           
            .on("mouseover",function(){$(".dot").css("fill","white");});
            /*.on("mouseleave",function(){$(".dot").css("fill","none");});*/
    
           var totalLength = path.node().getTotalLength();
      
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
            
            
            
           
        chartGroup.append("g")
        .attr("class","axis y")   
        .call(yAxis);
    
        chartGroup.append("g")
        .attr("transform","translate(0,"+height+")")
        .attr("class","x axis hidden")
        .call(xAxis);
         
    chartGroup.selectAll("circle").data(Year).enter()       
       .append("circle")      
        .attr("class", "dot")   
        .attr("cx",function(d,i){return i*84;} )
        .attr("cy",function(d,i){ return y(values[i]);})
        .attr("r", function(d,i) { return 5; })   
        .on("mouseover",function(d,i){       
        $("g.axis.x").show();$("g.axis.x").css("stroke","white"); console.log("hit");
        $("g.axis.y").show();$("g.axis.y").css("stroke","white"); 
        div.transition()
        .duration(200)
        .style("opacity", .9);	       
       div	.html( values[i]+ "<br/>"  + Year[i])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout",function(){
        $("g.axis.x").hide();
        $("g.axis.y").hide();
          div.transition()		
                .duration(500)		
                .style("opacity", 0);	
    })
        .style("fill", "none");    
              

        
});