
/***************************
* VARIABLES
****************************/

/* Dimensions */
var m = [20, 80, 30, 50];
var margin = {'top': 20, 'right': 80, 'bottom': 30, 'left': 50};
var w = 960 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;
var width = w;
var height = h;
var text_label_x_offset = (w - margin.right)*0.05
var text_label_y_offset = (h - margin.bottom)*0.02

/* Data */
var td = {
  "accel": {"data":[],
          "description":"accel"},
  "gyro": {"data":[],
          "description":"gyro"},
  "magnet": {"data":[],
            "description":"magnet"},
  "power": {"data":[],
            "description":"power"}
};

/* Graph Objects */
var accel_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","accel_svg")
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","accel_graph");

var gyro_svg = d3.select("html").select("body").append("svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .attr("id","gyro_svg")
.append("g")  
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
  .attr("class","graph")
  .attr("id","gyro_graph");

var magnet_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","magnet_svg")
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","magnet_graph");

var power_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","power_svg")
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","power_graph");

/* Axes Limits */
var y_axes_max = [500,500,500,500]
var y_axes_min = [0,0,0,0]
var x_axes_max = [200,200,200,200]
var x_axes_min = [0,0,0,0]

/* Graph Variables */
var graphs = [accel_svg,gyro_svg,magnet_svg,power_svg]
var graph_enable = [true,true,true,true]
var x_scales = []
var y_scales = []
var y_interpolation = []
var x_axes = []
var y_axes = []
var color = d3.scale.category10();


/***************************
* FUNCTIONS
****************************/
function initData(){
  var random_data = {"x":[],"y":[],"z":[],"t":[]};
  for (i = 0; i<200; i++)
  {
    x = (h - 350)+(i/5);
    y = (h - 250)+(i/5);
    z = (h - 150)+(i/5);
    t = (h - 50)+(i/5);
    random_data.x.push(x)
    random_data.y.push(y)
    random_data.z.push(z)
    random_data.t.push(t)
  }

  td["accel"].data = random_data
  td["gyro"].data = random_data
  td["magnet"].data = random_data
  td["power"].data = random_data

  // For each key in the td dictionary, pull out array.
  var tdValues = Object.keys(td).map(function(key){
    return td[key];
  });

  // For each key in the td dictionary compute maxValue and sum
  tdValues.forEach(function(s) {
    s.maxValue = d3.max(s["data"].x, function(d) { return d; });
    s.minValue = d3.min(s["data"].t, function(d) { return d; });
    s.sum = d3.sum(s["data"].x, function(d) { return d; });
  });

  //d3.select("body").selectAll("div").append("p").text("This has been appended")
  var gs = d3.select("body").selectAll("svg").selectAll(".graph"); //graph
  
  /* Create each x,y,z,t,maxvalue object. This is the data
  Stored in each graph */
  var tmp = 0
  gs.each(function() {
    var e = d3.select(this);
    var cmp_obj_list = []
    for(var key in tdValues[tmp].data) {
      var component = {}
      component.values = tdValues[tmp].data[key];
      component.maxValue = d3.max(tdValues[tmp].data[key], function(d) { return d; });
      component.minValue = d3.min(tdValues[tmp].data[key], function(d) { return d; });
      component.sum = d3.sum(component.values, function(d) { return d; });
      component.descr = td[Object.keys(td)[tmp]].description +"_"+key.toString()
      cmp_obj_list.push(component)
    }
    e.selectAll("g").data(cmp_obj_list)
    .enter()
    .append("g")
    .attr("id",function(d,i){
                return "component"+i.toString()
              })
    .attr("class","component");
    tmp++
  });
};

function initGraphs(list_of_graphs) {
  /* Loop over each svg => each graph*/
  for(i in list_of_graphs) {
    var svg = list_of_graphs[i]
    var g = svg.selectAll(".component")
    //.attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });
    
    data = g.data()
    /*New graph variables*/
    var borderPath = d3.select(svg.node().parentNode).append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", (w + m[1] + m[3]))
        .attr("height", (h + m[0] + m[2]))
        .style("stroke", "steelblue")
        .style("fill", "none")
        .style("stroke-width", "1.5px");
    
    x_scales.push( d3.scale.linear().range([0, width]) )
    y_scales.push( d3.scale.linear().range([height, 0]) )
    y_interpolation.push( d3.svg.line()
                            .interpolate("basis")
                            .x(function(d,q) { return x_scales[i](q); })
                            .y(function(d,q) { return y_scales[i](d); }) )
    x_axes.push( d3.svg.axis()
                .scale(x_scales[i])
                .orient("bottom") )
    y_axes.push( d3.svg.axis()
                .scale(y_scales[i])
                .orient("left") )

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(x_axes[i]);

    svg.append("g")
        .attr("class", "y axis")
        .call(y_axes[i])
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(" X,Y,Z,t for "+data.description)
        .attr("class","graph_font");
  } //graphs
}; //drawLineGraph

function hideGraphs()
{

}

function updateGraphs(list_of_graphs) 
{
  for(i in list_of_graphs) {
    if(graph_enable[i] == true) {
      var svg = list_of_graphs[i]
      var g = svg.selectAll(".component")
      var component_cnt = 1
       /*Dictionary of x,y,z,t data*/
      data = g.data()
      x_domain_min = 0
      x_domain_max = d3.min(data, function(d){return d.values.length})
      y_domain_min = d3.min(data, function(d){return 0})
      y_domain_max = d3.max(data, function(d){return d.maxValue})
      
      //if(x_domain_min < x_axes_min[i] || x_domain_max> x_axes_max[i])
        x_scales[i].domain([x_domain_min,x_domain_max]);
      //if(y_domain_min < y_axes_min[i] || y_domain_max> y_axes_max[i])
        y_scales[i].domain([y_domain_min, y_domain_max]);

      y_interpolation = d3.svg.line()
                            .interpolate("basis")
                            .x(function(d,q) { return x_scales[i](q); })
                            .y(function(d,q) { return y_scales[i](d); })
      /* Plot each of the components on the graph */
      data.forEach(function(component){
        var city = svg.select("g:nth-child("+component_cnt+")");
        city.data(component) //setthe data of the nth child

        console.log(city.data()[0].descr)
        city.append("path")
            .attr("class", "line")
            .attr("d", function(d,i) { return y_interpolation(d.values); })
            .style("stroke", function(d,i) { return color(d.descr+component_cnt.toString()); });

        city.append("text")
            .datum(function(d) { return { name:d.descr, vals:{ex:d.values.length-1, 
                                why:d.values[d.values.length - 1]} }; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .attr("transform", function(d) { return "translate(" + 
                  (x_scales[i](d.vals.ex)-text_label_x_offset)+ "," + 
                  (y_scales[i](d.vals.why)-text_label_y_offset) + ")"; })
            .text(function(d) { return d.name; })
            .attr("class","graph_font");
        ++component_cnt
      }) //components of graph
    }//graph enable true
  }//graphs
}

function updateData()
{
  for (i = 0; i<200; i++)
  {
    x = (h - 350)+(i/5);
    y = (h - 250)+(i/5);
    z = (h - 150)+(i/5);
    t = (h - 50)+(i/5);
    random_data.x.push(x)
    random_data.y.push(y)
    random_data.z.push(z)
    random_data.t.push(t)
  }

  td["accel"].data = random_data
  td["gyro"].data = random_data
  td["magnet"].data = random_data
  td["power"].data = random_data

  // For each key in the td dictionary, pull out array.
  var tdValues = Object.keys(td).map(function(key){
    return td[key];
  });

  // For each key in the td dictionary comput maxValue and sum
  tdValues.forEach(function(s) {
    s.maxValue = d3.max(s["data"].x, function(d) { return d; });
    s.minValue = d3.min(s["data"].t, function(d) { return d; });
    s.sum = d3.sum(s["data"].x, function(d) { return d; });
  });
}

function mockUpdateData()
{
  for (i = 0; i<200; i++)
    {
      x = (h - 350)+(i/5);
      y = (h - 250)+(i/5);
      z = (h - 150)+(i/5);
      t = (h - 50)+(i/5);
      random_data.x.push(x)
      random_data.y.push(y)
      random_data.z.push(z)
      random_data.t.push(t)
    }

    td["accel"].data = random_data
    td["gyro"].data = random_data
    td["magnet"].data = random_data
    td["power"].data = random_data

    // For each key in the td dictionary, pull out array.
    var tdValues = Object.keys(td).map(function(key){
      return td[key];
    });

    // For each key in the td dictionary comput maxValue and sum
    tdValues.forEach(function(s) {
      s.maxValue = d3.max(s["data"].x, function(d) { return d; });
      s.minValue = d3.min(s["data"].t, function(d) { return d; });
      s.sum = d3.sum(s["data"].x, function(d) { return d; });
    });
}

function getAccelData(){
  return td.accel.data
}

function getGyroData(){
  return td.gyro.data
}

function getMagnetData(){
  return td.magnet.data
}

function getPowerData(){
  return td.power.data
}

/* MAIN */
initData();
initGraphs(graphs)
updateGraphs(graphs)

function getContacts () {

     jQuery.ajax({
         type: "GET",
         url: "http://localhost:5000/Contacts.svc/GetAll",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             // do something
         },

         error: function (jqXHR, status) {
             // error handler
         }
});
