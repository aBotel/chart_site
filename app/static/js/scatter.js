var m = [20, 20, 30, 20];
var margin = {'top': 20, 'right': 30, 'bottom': 20, 'left': 20};
var w = 1260 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;
var width = w;
var height = h;

/*
* Old scatter graph variables
* -> from the D3 show reel.
* -> many still used by the new line graph
*/
var x,
    y,
    duration = 1500,
    delay = 500;

var color = d3.scale.category10();

var accel_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","graph1")

var gyro_svg = d3.select("html").select("body").append("svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
.append("g")  
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
  .attr("class","graph")
  .attr("id","graph2")

var magnet_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","graph3")

var power_svg = d3.select("html").select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    .attr("class","graph")
    .attr("id","graph4")

var graphs = [accel_svg,gyro_svg,magnet_svg,power_svg]

// A line generator, for the dark stroke
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// // A line generator, for the dark stroke.
// var axis = d3.svg.line()
//     .interpolate("basis")
//     .x(function(d) { return x(d.date); })
//     .y(h);

// // A area generator, for the dark stroke.
// var area = d3.svg.area()
//     .interpolate("basis")
//     .x(function(d) { return x(d.date); })
//     .y1(function(d) { return y(d.price); });


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

function parseData(){
  var random_data = {"x":[],"y":[],"z":[],"t":[]};
  for (i = 0; i<200; i++)
  {
    x = (h - 350)+(i/10);
    y = (h - 250)+(i/10);
    z = (h - 150)+(i/10);
    t = (h - 100)+(i/10);
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

  // // Sort by x value, descending.
  // var tdData = []
  // tdValues.forEach(function(s) {
  //   s.forEach(function(comp){
  //     s.data.sort(function(a, b) { 
  //     return b.x - a.x; 
  //     })
  //   })
  //   tdData.push(s.data)
  // });

  var tdData = []
  tdValues.forEach(function(s) {
    tdData.push(s.data)
  })

  d3.select("body").selectAll("div").append("p").text("This has been appended")

  gs = d3.select("body").selectAll("svg").selectAll(".graph") //graph
    //.selectAll("g") //components
  
  /* Create each x,y,z,t,maxvalue object. This is the data
  Stored in each graph */
  gs.each(function(d,i) {
    var e = d3.select(this);
    var cmp_obj_list = []
    for(var key in tdData[i]) {
      var component = {}
      component.values = tdData[i][key];
      component.maxValue = d3.max(tdData[i][key], function(d) { return d; });
      component.minValue = d3.min(tdData[i][key], function(d) { return d; });
      component.sum = d3.sum(component.values, function(d) { return d; });
      component.descr = td[Object.keys(td)[i]].description +"_"+key.toString()
      cmp_obj_list.push(component)
    }
    e.selectAll("g").data(cmp_obj_list)
    .enter()
    .append("g")
    .attr("id",function(d,i){
                return "component"+i.toString()
              })
    .attr("class","symbol")
  });

  var tmp = "A line to breakpoint"
  drawLineGraphs()
};

function drawLineGraphs() {
  /* Loop over each svg => each graph*/
  for(i in graphs) {
    var svg = graphs[i]
    var g = svg.selectAll(".symbol")
        .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

    /*New graph variables*/
    var x_line_g = d3.scale.linear()
        .range([0, width]);

    var y_line_g = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x_line_g)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y_line_g)
        .orient("left");

    var line_line_g = d3.svg.line()
        .interpolate("basis")
        .x(function(d,i) { return x_line_g(i); })
        .y(function(d,i) { return y_line_g(d); });

    /*Dictionary of x,y,z,t data*/
    data = g.data()
    x_domain_min = 0
    x_domain_max = d3.min(data, function(d){return d.values.length})
    y_domain_min = d3.min(data, function(d){return d.maxValue})
    y_domain_max = d3.max(data, function(d){return d.maxValue})
    
    x_line_g.domain([x_domain_min,x_domain_max]);
    y_line_g.domain([y_domain_min, y_domain_max]);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(" X,Y,Z,t for "+data.description);

    
    var component_cnt = 1
    /* Plot each of the components on the graph */
    data.forEach(function(component) {
      var city = svg.select("g:nth-child("+component_cnt+")");
      city.data(component) //setthe data of the nth child

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d,i) { return line_line_g(d.values); })
          .style("stroke", function(d,i) { return color(d.descr+component_cnt.toString()); });

      city.append("text")
          .datum(function(d) { return {name:d.descr , vals: {x:d.values.length-1, y:d.values[d.values.length - 1]}}; })
          .attr("transform", function(d) { return 
            "translate(" + x_line_g(d.vals.x) + "," + y_line_g(d.vals.y) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
      ++component_cnt
    }) //components of graph

  } //graphs
}; //drawLineGraph

/* Failed attempt at the old scatter graph */
// function lines() {
//   x = d3.scale.linear().range([0, w - 60]);
//   y = d3.scale.linear().range([h / 4 - 20, 0]);

//   // Compute the minimum and maximum date across symbols.
//   x.domain([
//     0,
//     td.accel.data.x.length
//   ]);

//   for(i in graphs) {
//     var svg = graphs[i]
//     var g = svg.selectAll(".symbol")
//         .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

//     g.each(function(d) {
//       var e = d3.select(this);

//       e.append("path")
//           .attr("class", "line");

//       e.append("circle")
//           .attr("r", 5)
//           .style("fill", function(d) { return color(d.key); })
//           .style("stroke", "#000")
//           .style("stroke-width", "2px");

//       e.append("text")
//           .attr("x", 12)
//           .attr("dy", ".31em")
//           .text(d.key);
//     });

//     function draw(k) {
//       g.each(function(d,i) {
//         var e = d3.select(this);
//         y.domain([0, d.maxValue+1]);

//         e.select("path")
//             .attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

//         e.selectAll("circle, text")
//             .data(function(d,i) { return [d.values[k], d.values[k]]; })
//             .attr("transform", function(d) { return "translate(" + x(i) + "," + y(d.values[k]) + ")"; });
//       });
//     }

//     var k = 1, n = td.accel.data.x.length-1;
//     d3.timer(function() {
//       draw(k);
//       if ((k += 2) >= n - 1) {
//         draw(n - 1);
//         //setTimeout(horizons, 500);
//         return true;
//       }
//     });
//   }
// }


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
parseData();
