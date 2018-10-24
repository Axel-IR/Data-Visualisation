var height = 960;
var width = 500;
 
var e = [];
var comets = [];

var margin = {left:50, right:50, top:40, bottom: 0};

 var tree = d3.tree().size([width, height]);

var svg = d3.select("body").append("svg").attr("width","100%").attr("height","100%");
var chartGroup = svg.append('g').attr("transform","translate("+margin.left+","+margin.top+")");


d3.json("https://data.nasa.gov/resource/nkd9-uwas.json").get(function(error,data){

    for(var p = 0; p < data.length; p++){
        
         var root = d3.hierarchy(data[p]);
          e.push(root.data.e);
        comets.push(root.data.object_name);   
        
       
     
    }
   
    var max = d3.max(e, function(d){return d;});
      
    
     var y = d3.scaleLinear()
    .domain([0,max])
    .range([height,0]);
      
    var yAxis = d3.axisLeft(y);
        var line = d3.line()
                    .x(function(d){return y((d.e));})
                    .y(function(d){return y((d.e));});
               
       chartGroup.append("path").attr("d",line(data));
    
  
});