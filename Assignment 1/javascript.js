//Size of window
var height = 960;
var width = 500;
 
// e array & name array
var e = [];
var comets = [];

//margin
var margin = {left:50, right:50, top:40, bottom: 0};


//create a svg canvas
var svg = d3.select("body").append("svg").attr("width","100%").attr("height","100%");
var chartGroup = svg.append('g')
.attr("transform","translate("+margin.left+","+margin.top+")");

// pool data json into canvas
d3.json("https://data.nasa.gov/resource/nkd9-uwas.json").get(function(error,data){

    for(var p = 0; p < data.length; p++){
        
         var root = d3.hierarchy(data[p]);
          e.push(root.data.e);
        comets.push(root.data.object_name);   
        
       
     
    }
   
    var max = d3.max(e);
      
    var x = d3.scaleBand()
    .domain(comets)
    .paddingInner(1)
    .range([0,width*3]);
    
     var y = d3.scaleLinear()
    .domain([0.3,1])
    .range([height-100,0]);
    
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    
        var line = d3.line()                     
                    .x(function(d,i){return i*9;})
                    .y(function(d){return y((d.e));})
                    .curve(d3.curveCardinal);
               
       chartGroup.append("path")  
            .attr("stroke", "red")
            .attr("stroke-width","3")
            .attr("fill","none")
           .attr("d",line(data));
    
        chartGroup.append("g")
        .attr("class","axis y")   
        .call(yAxis);
    
        chartGroup.append("g")
        .attr("transform","translate(0,550)")
        .attr("class","x axis hidden")
        .call(xAxis)
        .selectAll("Text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")        
        .attr("transform",function(d){return "rotate(-90)"});
  
});