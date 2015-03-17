var chartA;
var chartB;

Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

$(function () {
    $(document).ready(function () {
        chartA = $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var series = this.series;
                        console.log(series);
                        setInterval(function () {
                            var time = (new Date()).getTime(), // current time
                                y = Math.random();
                            for(var i = 0; i<series.length; i++)
                            {
                                for (j = -50; j < 0; j += 1) {
                                    x = time + j * 10
                                    y = Math.random()
                                    if( j==-1 && i == series.length-1)
                                    {
                                        series[i].addPoint([x, y], true, true);
                                    }
                                    else{
                                        series[i].addPoint([x, y], false, true);
                                    }
                                }
                            }
                        }, 500);
                    }
                }
            },
            title: {
                text: 'Live Velocity Data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                min:0,
                max:5
            },
            tooltip: {
                enabled:false
                // formatter: function () {
                //     return '<b>' + this.series.name + '</b><br/>' +
                //         Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                //         Highcharts.numberFormat(this.y, 2);
                // }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker:{
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Series1',
                data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -200; i <= 0; i += 1) {
                            data.push({
                                x: time + i * 10,
                                y: Math.random()
                            });
                        }
                        return data;
                    }())
                }, 
                {   
                name: 'Series2',
                data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -200; i <= 0; i += 1) {
                            data.push({
                                x: time + i * 10,
                                y: Math.random()
                            });
                        }
                        return data;
                    }()) 
                }]
        });
    });
});