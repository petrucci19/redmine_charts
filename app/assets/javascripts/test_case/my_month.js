/*
  Options = {
    start_year  :
    width       :
    color_range :
  }

*/

function myMonthRenderer(url, div_id, month, year, options) {

  var year_from = (options.start_year != null) ?options.start_year :2007;
  var div_to, my_month_select, my_month_title, my_month_calendar, my_month_buttons;
  myMonthDivLayout();
  ajaxMonthRenderer(url,month,year);
  myMonthChange();

  function ajaxMonthRenderer(url,month,year){
    jQuery.ajax( {       
          //url: '/my_month/' + month + '/and/' + year,
          url: url,
          dataType: "json",
          success:  function(dataset){
            d3.select(my_month_calendar).selectAll("svg").remove();
            my_month_calendar.innerHTML="";  
            var str = monthNameFull[month] + ", " + year;
            $(my_month_title).html(str);
            monthRenderer(my_month_calendar, dataset, month, year);  
          },
          error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error month calendar ajax!'); }
      });
  }

  function monthRenderer(div_id,dataset, month, year){

    var width = (options.width != null && typeof options.width == "number" ) ?options.width :448,     //448
        height = width*0.78125;    //350

    var cellSize = width/7,
        day_rect_height = height - (cellSize*5);

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var date_color = "#8F8F8F",
        sunday_date_color = "#E9E9E9";

    var colors = options.color_range;

    var svg = d3.select(div_id).selectAll("svg")
        .data([year])
      .enter().append("svg")
        .attr("id","month_svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");
        //.attr("transform", "translate(" + ((width - (cellSize) * 53) / 2) + "," + (height - (cellSize) * 7 - 1) + ")");
        //.attr("transform", "translate(20,20)");

    var day_rect = svg.selectAll(".my_month_day_rect")
        .data([year])
      .enter().append("rect")
        .attr("class", "my_month_day_rect")
        .attr("width", (cellSize)*7)
        .attr("height", day_rect_height)
        .attr("y", 0)
        .attr("x", 0);

    
    
    var day_label = svg.selectAll(".my_month_day_label")
        .data( d3.range(0,7))
      .enter().append("text")
        .attr("class", "my_month_day_label")
        .attr("x", function(d) { return (d+0.38)*(cellSize) })
        .attr("y", (cellSize)*0.3 )
        .text( function(d) { return dayNameShort[d] });

    var days = d3.time.days(new Date(year, month, 1), new Date(year, (Number(month) + 1).toString(), 1) ) ;
    
    var circle = svg.selectAll(".day")
        .data(days)
      .enter().append("circle")
        .attr("class", "day")
        .attr("r", 0)
        .attr("sharp-rendering", "crispEdges")
        .attr("cy", function(d) { return ( d.getMonthWeek() * (cellSize) + day_rect_height + (cellSize)*0.55 ) ; })
        .attr("cx", function(d) { return (  day(d) * (cellSize) + (cellSize)*0.55 ) ; })
        .datum(format);

    circle.append("title")
        .text(function(d) { return d; });

    var label_format = d3.time.format("%d");

    var date_label = svg.selectAll(".my_month_date_label")
        .data(days)
      .enter().append("text")
        .attr("class", "my_month_date_label")
        .attr("y", function(d) { return ( d.getMonthWeek() * (cellSize) + 12 + day_rect_height ) ; })
        .attr("x", function(d) { return (day(d) * (cellSize)) ; })
        .attr("fill", function(d) { if (day(d) == 0) { return sunday_date_color; } else { return date_color; } })
        .text( function(d) { return label_format(d)});


    var line = svg.selectAll(".my_month_week")
        .data(d3.range(0,6))
      .enter().append("line")
        .attr("class", "my_month_week")
        .attr("x1", 0)
        .attr("y1", function(d) { return (d*(cellSize) + day_rect_height); } )
        .attr("x2", (cellSize)*7 )
        .attr("y2", function(d) { return (d*(cellSize) + day_rect_height); } );

    var max_radius = Math.floor(cellSize*0.42);
    
    var scale = d3.scale.linear()
                    .domain([0, 12])
                    .range([0, max_radius]);

    circle.filter(function(d) { return d in dataset; })
            .attr("r", function(d) { return ( Math.floor(scale(dataset[d])<=max_radius) )?Math.floor(scale(dataset[d])):max_radius  } )
            .attr("fill", function(d) {
              for (var i=0; i<colors.length; i++){
                if (dataset[d] >= colors[i][0] && dataset[d] <= colors[i][1]){
                  return colors[i][2];
                }
              }
            })
          .select("title")
            .text(  function(d) { return dataset[d] + " hours on " + d; }   );   
  };


  function myMonthChange(){
    var url = '/my_month';
    $(".my_month_select").change(function() {
        month = $('select#my_month_select_month :selected').val();
        year = $('select#my_month_select_year :selected').val();
        ajaxMonthRenderer(url, month, year);
    });

    $("#my_month_prev_month").click(function() {
      if(month=="0") {
        month="11";
        year--;
      }
      else {
        month--;
      }
      ajaxMonthRenderer(url, month,year);
    });

    $("#my_month_next_month").click(function() {
      if(month=="11") {
        month="0";
        year++;
      }
      else {
        month++;
      }
      ajaxMonthRenderer(url,month,year);
    });
  }

  function myMonthDivLayout() {
    div_to = document.getElementById(div_id);
    my_month_select = document.createElement("div");
    my_month_select.setAttribute("id", "my_month_select");
    my_month_select.innerHTML = monthSelect()+yearSelect();
    my_month_title = document.createElement("div");
    my_month_title.setAttribute("id", "my_month_title");
    my_month_title.setAttribute("style", "width:" + options.width.toString() + "px;");
    my_month_calendar = document.createElement("div");
    my_month_calendar.setAttribute("id", "my_month_calendar");
    my_month_calendar.setAttribute("style", "width:" + options.width.toString() + "px; height:" + (options.width*0.78125).toString() + "px;");
    //my_month_calendar.setAttribute("style", "width:448px; height:350px;");
    my_month_buttons = document.createElement("div");
    my_month_buttons.setAttribute("id", "my_month_buttons");
    my_month_buttons.innerHTML = "<div>\
      <button type=\'button\' id=\'my_month_prev_month\' style=\'width:70px;\'>Previous</button>\
      <button type=\'button\' id=\'my_month_next_month\' style=\'width:70px; margin-left:"+ Math.abs(options.width - 140) +"px\'>Next</button>\
    </div>"

    div_to.appendChild(my_month_select);
    div_to.appendChild(my_month_title);
    div_to.appendChild(my_month_calendar);
    div_to.appendChild(my_month_buttons);
  }

  function monthSelect(){
    var str = "<label for=\'select_month\' style=\'display:inline; width:60px;\'>Month:</label>\
                <select name=\'select_month\' class=\'my_month_select\' id=\'my_month_select_month\' style=\'width:100px;\'  >";
    for(i=0; i<12; i++){
      str = str + "<option value=\'" + i + "\'>" + monthNameFull[i] + "</option>";
    }
    return str + "</select>";
  }

  function yearSelect(){
    var year_to = Number(getTodaysDate().getFullYear());
    var str = "<label for=\'select_year\' style=\'display:inline; width:60px; margin-left:"+ Math.abs(options.width*0.15) +"px;\'>Year:</label>\
                <select name=\'select_year\' class=\'my_month_select\' id=\'my_month_select_year\' style=\'width:100px;>";
    for(i=year_from; i<=year_to; i++){
      str = str + "<option value=\'" + i.toString() + "\'>" + i.toString() + "</option>";
    }
    return str + "</select>";
  }

}






