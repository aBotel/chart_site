
/***************************
* VARIABLES
****************************/
var ajx_q_name = "theMasterQueue";
var base_url = "http://localhost:5000"
var updates = 20
var x_max = 200
var graph_clips = ["accel_clip","gyro_clip","magnet_clip","power_clip"]

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
    .attr("id","accel_graph")
  .append("defs").append("clipPath")
    .attr("id",graph_clips[0])
  .append("rect")
    .append("width",width)
    .append("height",height);

var gyro_svg = d3.select("html").select("body").append("svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .attr("id","gyro_svg")
.append("g")  
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
  .attr("class","graph")
  .attr("id","gyro_graph")
.append("defs").append("clipPath")
  .attr("id",graph_clips[1])
.append("rect")
  .append("width",width)
  .append("height",height);

var magnet_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","magnet_svg")
magnet_svg.append("g");
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","magnet_graph");
magnet_svg.append("g").append("defs").append("clipPath")
    .attr("id",graph_clips[2])
  .append("rect")
    .append("width",width)
    .append("height",height);

var power_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("id","power_svg");
power_svg.append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","power_graph");
power_svg.append("g").append("defs").append("clipPath")
    .attr("id",graph_clips[3])
  .append("rect")
    .append("width",width)
    .append("height",height);

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
  // For each key in the td dictionary, pull out array.
  var tdValues = Object.keys(td).map(function(key){
    return td[key];
  });

  for (j = 0; j<graphs.length; j++)
  {
    tdValues[j].data = {"x":[],"y":[],"z":[],"t":[]}
    for (i = 0; i<200; i++)
    {
      x = (h - 350)+(i/5);
      y = (h - 250)+(i/5);
      z = (h - 150)+(i/5);
      t = (h - 50)+(i/5);
      tdValues[j].data.x.push(x)
      tdValues[j].data.y.push(y)
      tdValues[j].data.z.push(z)
      tdValues[j].data.t.push(t)
    }
  }

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
  var count = 0
  gs.each(function() {
    var e = d3.select(this);
    var cmp_obj_list = []
    for(var key in tdValues[count].data) {
      var component = {}
      component.values = tdValues[count].data[key];
      component.maxValue = d3.max(tdValues[count].data[key], function(d) { return d; });
      component.minValue = d3.min(tdValues[count].data[key], function(d) { return d; });
      component.sum = d3.sum(component.values, function(d) { return d; });
      component.descr = td[Object.keys(td)[count]].description +"_"+key.toString()
      cmp_obj_list.push(component)
    }
    /*Set the graph to hold cmp_obj_list. Each list has 4 component*/
    e.selectAll("g").data(cmp_obj_list)
    .enter()
    .append("g")
    .attr("id",function(d,i){
                return "component"+i.toString()
              })
    .attr("class","component");
    count++
  });
};

function initGraphs(list_of_graphs) {
  /* Loop over each svg => each graph */
  for(i in list_of_graphs) {
    var svg = list_of_graphs[i]
    var comp = svg.selectAll(".component")
    //.attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });
    
    data = comp.data()
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
  } //loop over graphs
}; //drawLineGraph

function hideGraphs()
{

}

function updateGraphs(list_of_graphs) 
{
  for(i in list_of_graphs) {
    if(graph_enable[i] == true) {
      var svg = list_of_graphs[i]
      var comp = svg.selectAll(".component")
      var component_cnt = 1

      /*Dictionary of x,y,z,t data*/
      data = comp.data()
      x_domain_min = 0
      x_domain_max = d3.min(data, function(d){return d.values.length})
      y_domain_min = d3.min(data, function(d){return Math.min(d.minValue,0)})
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
      data.forEach(function(cmp_data){
        var component = svg.select("g:nth-child("+component_cnt+")");
        component.datum(cmp_data) //set the data of the nth child

        console.log(component.data()[0].descr)
        component.append("path")
            .attr("class", "line")
            .attr("d", function(d,i) { return y_interpolation(d.values); })
            .style("stroke", function(d,i) { return color(d.descr+component_cnt.toString()); });

        component.append("text")
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


function mockUpdateData(num_updates)
{
  // For each key in the td dictionary, pull out array.
  var tdValues = Object.keys(td).map(function(key){
    return td[key];
  });

  for (j = 0; j<graphs.length; j++)
  {
    for (i = 0; i<num_updates; i++)
    {
      x = (h - 350)+50*Math.random();
      y = (h - 250)+50*Math.random();
      z = (h - 150)+50*Math.random();
      t = (h - 50)+50*Math.random();
      tdValues[j].data.x.push(x)
      tdValues[j].data.y.push(y)
      tdValues[j].data.z.push(z)
      tdValues[j].data.t.push(t)
    }
  }

  // For each key in the td dictionary comput maxValue and sum
  tdValues.forEach(function(s) {
    s.maxValue = d3.max(s["data"].x, function(d) { return d; });
    s.minValue = d3.min(s["data"].t, function(d) { return d; });
    s.sum = d3.sum(s["data"].x, function(d) { return d; });
  });

  //d3.select("body").selectAll("div").append("p").text("This has been appended")
  var gphs = d3.select("body").selectAll("svg").selectAll(".graph"); //graph
  
  /* Create each x,y,z,t,maxvalue object. This is the data
  Stored in each graph */
  var count = 0
  gphs.each(function() {
    var e = d3.select(this);  // select a graph
    var cmp_obj_list = []
    //Iterate over components, accel, gyro, magnet, power
    for(var key in tdValues[count].data) {
      var component = {}
      component.values = tdValues[count].data[key];
      component.maxValue = d3.max(tdValues[count].data[key], function(d) { return d; });
      component.minValue = d3.min(tdValues[count].data[key], function(d) { return d; });
      component.sum = d3.sum(component.values, function(d) { return d; });
      component.descr = td[Object.keys(td)[count]].description +"_"+key.toString()
      cmp_obj_list.push([component])
    }
    //e.selectAll(".component").data(cmp_obj_list)
    e.selectAll(".component").selectAll("path").data(cmp_obj_list[count])
    
    e.selectAll(".component").selectAll("path").each(function(d,i){
        data = [d]
        tick(d3.select(this),data,num_updates,count)
    });
  count++;
  });
}

function tick(path, data, num_updates, count) {
  /*Dictionary of x,y,z,t data*/
  x_domain_min = 0
  x_domain_max = d3.max(data, function(d){return d.values.length})
  y_domain_min = d3.min(data, function(d){return Math.min(d.minValue,0)})
  y_domain_max = d3.max(data, function(d){return d.maxValue})
  
  //if(x_domain_min < x_axes_min[i] || x_domain_max> x_axes_max[i])
  x_scales[count].domain([x_domain_min,x_domain_max]);
  //if(y_domain_min < y_axes_min[i] || y_domain_max> y_axes_max[i])
  y_scales[count].domain([y_domain_min, y_domain_max]);
  y_interpolation = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d,q) { return x_scales[count](q); })
                        .y(function(d,q) { return y_scales[count](d); })
  x_scale = x_scales[count]
  
  path.attr("d", function(d){return y_interpolation(d.values)})
      .attr("transform", null)
    .transition()
      .duration(0)
      .ease("linear")
      .attr("transform", "translate(" + x_scale(-1*num_updates) + ",0)")
     // .each("end", tick);

  // pop the old data point off the front
  for(i=0;i<num_updates; i++)
  {
    data[0].values.shift();
  }
}


function testAjax(){
    mock_accel_data = {x:1,y:2,z:3,t:4}
    mock_gyro_data = {x:5,y:6,z:7,t:8}
    mock_magnet_data = {x:9,y:10,z:11,t:12}

    updateAccel(mock_accel_data)
    updateGyro(mock_gyro_data)
    updateMagnet(mock_magnet_data)

    for (i=0;i<100;i++) {
      updateAccel(mock_accel_data)
      updateGyro(mock_gyro_data)
      updateMagnet(mock_magnet_data)
    }
   
    var acc = getAccel();
    var gyro = getGyro();
    var magnet = getMagnet();
    //var all = getAll();
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
initGraphs(graphs);
updateGraphs(graphs);
for (k = 0; k<3; k++)
{
  mockUpdateData(updates);
}


//testAjax();

/*************************
* AJAX
**************************/

function startService() {
  jQuery.ajax({
         type: "POST",
         url: base_url+"/motion/api/v1/start",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify({val:1}),
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log("Starting JSON service")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateMagnet!")
         }     
     });     
}

function stopService() {
  jQuery.ajax({
         type: "POSTT",
         url: base_url+"/motion/api/v1/stop",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify({val:0}),
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log("Stopping JSON service")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateMagnet!")
         }     
     });     
}

/* AJAX Calls */
function getAccel () {
    var result;
    $.ajax({
      type: "GET",
      url: base_url+"/motion/api/v1/accel",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async:false,
      success: function (data, status, jqXHR) {
        console.log("Getting accel info...")
        result = data
        console.log("Got accel info: "+data.toString())
      },

      error: function (jqXHR, status) {
        // error handler
        console.log("Error in getAccel!")
      }
    });
  return result
}

function getGyro () {
    var result;
    $.ajax({
      type: "GET",
      url: base_url+"/motion/api/v1/gyro",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async:false,
      success: function (data, status, jqXHR) {
        console.log("Getting gyro info...")
        result = data
        console.log("Got gyro info: "+data.toString())
      },

      error: function (jqXHR, status) {
        // error handler
        console.log("Error in getGyro!")
      }
    });
  return result
}


function getMagnet() {
    var result;
    $.ajax({
      type: "GET",
      url: base_url+"/motion/api/v1/magnet",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async:false,
      success: function (data, status, jqXHR) {
        result = data
        console.log("Got magnetometer info: "+data.toString())
      },

      error: function (jqXHR, status) {
        // error handler
        console.log("Error in getMagnet!")
      }
    });
  return result
}

function getAllData () {
    $.ajax({
      type: "GET",
      url: base_url+"/motion/api/v1/all",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async:false,
      success: function (data, status, jqXHR) {
        result = data
        console.log("Got all_data info: "+data.toString())
      },

      error: function (jqXHR, status) {
          // error handler
          console.log("Error in getData!")
      }
    });
}

/* AJAX Puts */


function updateAccel (accelData) {
     $.ajaxq(ajx_q_name,{
         type: "PUT",
         url: base_url+"/motion/api/v1/accel",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(accelData),
         dataType: "json",
         async:false,
         success: function (data, status, jqXHR) {
             console.log("Putting data to accel!")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateAccel!")
         }     
     });     
}

function updateGyro (gyroData) {
     $.ajaxq(ajx_q_name,{
         type: "PUT",
         url: base_url+"/motion/api/v1/gyro",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(gyroData),
         dataType: "json",
         async:false,
         success: function (data, status, jqXHR) {
             console.log("Putting data to gyro!")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateGyro!")
         }     
     });     
}

function updateMagnet (magnetData) {
     $.ajaxq(ajx_q_name,{
         type: "PUT",
         url: base_url+"/motion/api/v1/magnet",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(magnetData),
         dataType: "json",
         async:false,
         success: function (data, status, jqXHR) {
             console.log("Putting data to magnet!")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateMagnet!")
         }     
     });     
}

function updateAll (data) {
     jQuery.ajax({
         type: "PUT",
         url: base_url+"/motion/api/v1/all",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(data),
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log("Putting data to all!")
         },
     
         error: function (jqXHR, status) {
             // error handler
            console.log("Error in updateAll!")
         }     
     });     
}