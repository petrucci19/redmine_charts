Date.prototype.getMonthWeek = function(){
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return ( Math.ceil((this.getDate() + firstDay)/7) - 1 );
}

function ajaxMonthRenderer(month, year){
  jQuery.ajax( {       
        //url: '/my_month/' + month + '/and/' + year,
        url: '/my_month',
        dataType: "json",
        success:  function(dataset){
          d3.select("#my_month").selectAll("svg").remove();
          var str = monthNameFull[month] + ", " + year;
          $("#my_month_title").html(str);
          monthRenderer(dataset, month, year);  
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error month calendar ajax!'); }
    });
}

function monthRenderer(dataset, month, year){

  var width = 448,
      height = 350;

  var cellSize = 60,
      padding = 4,
      day_rect_height = 30;

  var day = d3.time.format("%w"),
      week = d3.time.format("%U"),
      percent = d3.format(".1%"),
      format = d3.time.format("%Y-%m-%d");

  var date_color = "#8F8F8F",
      sunday_date_color = "#E9E9E9";

  var circle_fill_11_12 = "rgb(0,104,55)",
      circle_fill_8_10 = "rgb(102,189,99)",
      circle_fill_5_7 = "rgb(140,239,139)",
      circle_fill_2_4 = "rgb(202,224,139)",
      circle_fill_0_1 = "rgb(244,109,67)";

  var svg = d3.select("#my_month").selectAll("svg")
      .data([year])
    .enter().append("svg")
      .attr("id","month_svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "RdYlGn")
    .append("g");
      //.attr("transform", "translate(" + ((width - (cellSize + padding) * 53) / 2) + "," + (height - (cellSize + padding) * 7 - 1) + ")");
      //.attr("transform", "translate(20,20)");

  var day_rect = svg.selectAll(".day_rect")
      .data([year])
    .enter().append("rect")
      .attr("class", "day_rect")
      .attr("width", (cellSize+padding)*7)
      .attr("height", day_rect_height)
      .attr("y", 0)
      .attr("x", 0);

  
  
  var day_label = svg.selectAll(".day_label")
      .data( d3.range(0,7))
    .enter().append("text")
      .attr("class", "day_label")
      .attr("x", function(d) { return (d+0.38)*(cellSize+padding) })
      .attr("y", (cellSize + padding)*0.3 )
      .text( function(d) { return dayNameShort[d] });

  var days = d3.time.days(new Date(year, month, 1), new Date(year, (Number(month) + 1).toString(), 1) ) ;
  
  var circle = svg.selectAll(".day")
      .data(days)
    .enter().append("circle")
      .attr("class", "day")
      .attr("r", 0)
      .attr("sharp-rendering", "crispEdges")
      .attr("cy", function(d) { return ( d.getMonthWeek() * (cellSize + padding) + day_rect_height + (cellSize + padding)*0.55 ) ; })
      .attr("cx", function(d) { return (  day(d) * (cellSize + padding) + (cellSize + padding)*0.55 ) ; })
      .datum(format);

  circle.append("title")
      .text(function(d) { return d; });

  var label_format = d3.time.format("%d");

  var date_label = svg.selectAll(".date_label")
      .data(days)
    .enter().append("text")
      .attr("class", "date_label")
      .attr("y", function(d) { return ( d.getMonthWeek() * (cellSize + padding) + 12 + day_rect_height ) ; })
      .attr("x", function(d) { return (day(d) * (cellSize + padding)) ; })
      .attr("fill", function(d) { if (day(d) == 0) { return sunday_date_color; } else { return date_color; } })
      .text( function(d) { return label_format(d)});


  var line = svg.selectAll(".week")
      .data(d3.range(0,6))
    .enter().append("line")
      .attr("class", "week")
      .attr("x1", 0)
      .attr("y1", function(d) { return (d*(cellSize+padding) + day_rect_height); } )
      .attr("x2", (cellSize+padding)*7 )
      .attr("y2", function(d) { return (d*(cellSize+padding) + day_rect_height); } );

  var t = Math.floor(cellSize*0.42);
  
  var scale = d3.scale.linear()
                  .domain([0, 12])
                  .range([0, t]);

  circle.filter(function(d) { return d in dataset; })
          .attr("r", function(d) { return Math.floor(scale(dataset[d])) } )
          .attr("fill", function(d) {
              if (dataset[d] >= 11 && dataset[d]<= 12) {return circle_fill_11_12;}
              else if (dataset[d] >= 8 && dataset[d]<= 10) {return circle_fill_8_10;}
              else if (dataset[d] >= 5 && dataset[d]<= 7) {return circle_fill_5_7;}
              else if (dataset[d] >= 2 && dataset[d]<= 4) {return circle_fill_2_4;}
              else {return circle_fill_0_1;}
          })
        .select("title")
          .text(  function(d) { return dataset[d] + " hours"; }   );   
};