
/***************************
* VARIABLES
****************************/
var base_url = "http://localhost:5000"
var updates = 2
var x_max = 200
var graph_clips = ["accel_clip","gyro_clip","magnet_clip","power_clip"]
var global_count = 20
var ajax_delay = 1000
// var transition_delay = 1000
// var interpolation_data = [0,0,0,0];
// var date = new Date();

/* Dimensions */
var m = [20, 80, 30, 50];
var margin = {'top': 20, 'right': 80, 'bottom': 30, 'left': 50};
var w = 960 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;
var width = w;
var height = h;
var text_label_x_offset = (w - margin.right)*0.05
var text_label_y_offset = (h - margin.bottom)*0.02
var date = new Date()

// /* Data */
// var td = {
//   "accel": {"data":[],
//           "description":"accel"},
//   "gyro": {"data":[],
//           "description":"gyro"},
//   "magnet": {"data":[],
//             "description":"magnet"},
//   "power": {"data":[],
//             "description":"power"}
// };

// /* Axes Limits */
// var y_axes_max = [500,500,500,500]
// var y_axes_min = [0,0,0,0]
// var x_axes_max = [x_max,x_max,x_max,x_max]
// var x_axes_min = [0,0,0,0]

// /* Graph Variables */
// //var graphs = [accel_svg,gyro_svg,magnet_svg,power_svg]
// var graph_enable = [true,true,true,true]
// var x_scales = []
// var y_scales = []
// var y_interpolation = [0,0,0,0];
// var transition_interpolator = [0,0,0,0];
// var x_axes = []
// var y_axes = []
// var color = d3.scale.category10();

var chartOne;
var chartOneData = [
  // First series
  {
    label: "Accel_x",
    values: [ ]
  },

  // The second series
  {
    label: "Accel_y",
    values: [ ]
  },

  // The second series
  {
    label: "Accel_z",
    values: [ ]
  },
];

function initializeChartOne()
{
    chartOne = $('#chartOne').epoch({ 
    type: 'time.line', 
    data: chartOneData,
    axes: ['bottom','left','right'],
    //ticks: { time: 35, right: 5, left: 5 },
    fps: 120,
    windowSize: 100,
    historySize:x_max/2
  });
}

function initializeChartOneData()
{
  
  for (i=0; i<x_max; i++)
  {
    var entry = [];
    var t = ((new Date()).getTime() / 1000);
    for (j = 0; j<chartOneData.length; j++)
    {
      //val = (h - j*75+50)+20*Math.random();    
      val = global_count + 1*Math.random();
      chartOneData[j].values.push({time: t, y: val})
    }
  }
}

function updateChartOne()
{
    var entry = [];
    for (i = 0; i<updates; i++)
    {
      var t = ((new Date()).getTime() / 1000)
      for (j = 0; j<chartOneData.length; j++)
      {
        val = 20 + global_count + 1*Math.random();
        entry.push({time: t, y: val});
      }
    }
    chartOne.push(entry)
    global_count--
    console.log("Global count: "+global_count)
}



/* MAIN */

initializeChartOneData()
initializeChartOne()
//window.setInterval(updateChartOne,ajax_delay)

/*************************
* AJAX
**************************/

function testAjax(){
    mock_accel_data = {x:1,y:2,z:3,t:4}
    mock_gyro_data = {x:5,y:6,z:7,t:8}
    mock_magnet_data = {x:9,y:10,z:11,t:12}

    //updateAccel(mock_accel_data)
    //updateGyro(mock_gyro_data)
    //updateMagnet(mock_magnet_data)

    /*for (i=0;i<1;i++) {
      updateAccel(mock_accel_data)
      updateGyro(mock_gyro_data)
      updateMagnet(mock_magnet_data)
    }*/
   
    var acc = getAccel();
    var gyro = getGyro();
    var magnet = getMagnet();
}

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
        //console.log("Got accel info: "+data.toString())
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
        //console.log("Got gyro info: "+data.toString())
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
        //console.log("Got magnetometer info: "+data.toString())
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
        //console.log("Got all_data info: "+data.toString())
      },

      error: function (jqXHR, status) {
          // error handler
          console.log("Error in getData!")
      }
    });
}

/* AJAX Puts */


function updateAccel (accelData) {
     $.ajax({
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
     $.ajax({
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
     $.ajax({
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