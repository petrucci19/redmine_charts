Date.prototype.getMonthWeek = function(){
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return ( Math.ceil((this.getDate() + firstDay)/7) - 1 );
}

var RedmineActivityD3 = {

	namespace: function(namespace, obj) {

		var parts = namespace.split('.');

		var parent = RedmineActivityD3;

		for(var i = 1, length = parts.length; i < length; i++) {
			var currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}
		return parent;
	},
	
	getTodaysDate: function(){ return new Date();},
	monthNameFull: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	monthNameShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
	dayNameShort: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

};

/* 
    Yearly Activity Calendar
 
    url 	-> url for ajax request
	div_id 	-> div for svg
	Note that year_from and year_to are inclusive.
	options = {
		width	: should be a number. default value is 1000
		color_range	: [ [range_lower, range_upper, range_color], [range_lower, range_upper, range_color]... ]
		Eg. color_range : [[1,5,"#FFF"],[6,8,"#BBB"],[9,10,"#CCC"], "#000"];
		default_color: should be a color string. default value is "#F5F5F5"
	}
	Note that each year has its own svg.

*/

RedmineActivityD3.namespace("RedmineActivityD3.year");

RedmineActivityD3.year = function(url, div_id, year, options) {
	
	var div_to = document.getElementById(div_id);
    div_to.className += div_to.className ? 'redmine_activity_div_no_border' : 'redmine_activity_div_no_border';
  
    ajaxYearRenderer();

	function ajaxYearRenderer(){
		jQuery.ajax( {       
	        url: url,
	        dataType: "json",
	        success:  function(dataset){
	        	//$(div_id).html("");
	        	yearRenderer(dataset, div_to, year, year, options);	
	    	},
	    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error year calendar ajax!'); }
	    });
	}
	
	function yearRenderer(dataset, div_id, year_from, year_to, options){
	
		d3.select(div_id).selectAll("svg").remove();
		
		var width 	= (options.width != null && typeof options.width == "number" ) ?options.width :1000,
			left_offset = 20,
			right_offset = 10,
			top_offset = 20,
			bottom_offset = 10,
			padding = 3,
			cellSize = (width-159-left_offset-right_offset)/53,
			height 	= 7*(cellSize+padding) + top_offset + bottom_offset,
			colors	= options.color_range;
	
		var day = d3.time.format("%w"),
		    week = d3.time.format("%U"),
		    percent = d3.format(".1%"),
		    format = d3.time.format("%Y-%m-%d");
	
		/*var color = d3.scale.quantize()
		    .domain([0,10])
		    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));*/
		
		$(div_id).css({"width": width.toString() + "px" ,"height": height.toString() + "px"});
	
		var svg_year = d3.select(div_id).selectAll("svg")
		    //.data(d3.range(year_from, year_to))
		    .data([Number(year_from)])
		  .enter().append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    //.attr("class", "RdYlGn")
		  .append("g")
		    //.attr("transform", "translate(" + (( (width - (cellSize + padding) * 53) / 2) ) + "," + (height - (cellSize + padding) * 7 - 1) + ")");
		    .attr("transform", "translate(" + ( left_offset) + "," + (top_offset) + ")");
	
		svg_year.append("text")
		    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
		    .style("text-anchor", "middle")
		    .attr("fill", "#737373")
		    .text(function(d) { return d; });
	
		var rect = svg_year.selectAll(".redmine_activity_yearly_day")
		    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		  .enter().append("rect")
		    .attr("class", "redmine_activity_yearly_day")
		    .attr("width", cellSize)
		    .attr("height", cellSize)
		    .attr("x", function(d) { return (week(d) * (cellSize + padding)) ; })
		    .attr("y", function(d) { return (day(d) * (cellSize + padding)) ; })
		    .attr("fill", (options.default_color!=null)?options.default_color:"#F5F5F5")
		    .datum(format);
	
		rect.append("title")
		    .text(function(d) { return d; });
	
		svg_year.selectAll(".redmine_activity_yearly_month")
		    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		  .enter().append("path")
		    .attr("class", "redmine_activity_yearly_month")
		    .attr("d", monthPath);
		
		svg_year.selectAll(".redmine_activity_yearly_month_label")
		    .data( d3.range(0,12) )
		  .enter().append("text")
		    .attr("class", "redmine_activity_yearly_month_label")
		    .attr("x", function(d) { return (d+0.45)*(cellSize+padding)*4.35 })
		    .attr("y", -5)
		    .text( function(d) { return RedmineActivityD3.monthNameShort[d] } );
	
		rect.filter(function(d) { return d in dataset; })
		      .attr("class", "redmine_activity_yearly_day")
		      .attr("fill", function(d) {
		      		for (var i=0; i<colors.length; i++){
		      			if (dataset[d] >= colors[i][0] && dataset[d] <= colors[i][1]){
		      				return colors[i][2];
		      			}
		      		}
		      	})
		    .select("title")
		      .text(function(d) { return d + ": " + dataset[d] + " hours"; });
	
		function monthPath(t0) {
		  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
		      d0 = +day(t0), w0 = +week(t0),
		      d1 = +day(t1), w1 = +week(t1);
		  return "M" + (w0 + 1) * (cellSize+padding) + "," + d0 * (cellSize+padding)
		      + "H" + w0 * (cellSize+padding) + "V" + 7 * (cellSize+padding)
		      + "H" + w1 * (cellSize+padding) + "V" + (d1 + 1) * (cellSize+padding)
		      + "H" + (w1 + 1) * (cellSize+padding) + "V" + 0
		      + "H" + (w0 + 1) * (cellSize+padding) + "Z";
		}
	
	};
	
}

/*
  Options = {
    start_year  :
    width       :
    color_range :
  }
*/

RedmineActivityD3.namespace("RedmineActivityD3.month");

RedmineActivityD3.month = function (url, div_id, month, year, options) {

  var year_from = (options.start_year != null) ?options.start_year :2007;
  var div_to = document.getElementById(div_id);
  
  div_to.className += div_to.className ? 'redmine_activity_div_with_border' : 'redmine_activity_div_with_border';
  
  ajaxMonthRenderer(url,month,year);

  function ajaxMonthRenderer(url,month,year){
    jQuery.ajax( {       
          url: url,
          dataType: "json",
          success:  function(dataset){
            monthRenderer(div_to, dataset, month, year);  
          },
          error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error month calendar ajax!'); }
      });
  }

  function monthRenderer(div_id, dataset, month, year){
	  
	d3.select(div_id).selectAll("svg").remove();

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
    
    $(div_id).css({"width": width.toString() + "px" ,"height": height.toString() + "px"});

    var svg = d3.select(div_id).selectAll("svg")
        .data([year])
      .enter().append("svg")
        .attr("id","redmine_activity_monthly_month_svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");
        //.attr("transform", "translate(" + ((width - (cellSize) * 53) / 2) + "," + (height - (cellSize) * 7 - 1) + ")");
        //.attr("transform", "translate(20,20)");

    var day_rect = svg.selectAll(".redmine_activity_monthly_day_rect")
        .data([year])
      .enter().append("rect")
        .attr("class", "redmine_activity_monthly_day_rect")
        .attr("width", (cellSize)*7)
        .attr("height", day_rect_height)
        .attr("y", 0)
        .attr("x", 0);

    
    
    var day_label = svg.selectAll(".redmine_activity_monthly_day_label")
        .data( d3.range(0,7))
      .enter().append("text")
        .attr("class", "redmine_activity_monthly_day_label")
        .attr("x", function(d) { return (d+0.38)*(cellSize) })
        .attr("y", (cellSize)*0.3 )
        .text( function(d) { return RedmineActivityD3.dayNameShort[d] });

    var days = d3.time.days(new Date(year, month, 1), new Date(year, (Number(month) + 1).toString(), 1) ) ;
    
    var circle = svg.selectAll(".redmine_activity_monthly_day")
        .data(days)
      .enter().append("circle")
        .attr("class", "redmine_activity_monthly_day")
        .attr("r", 0)
        .attr("sharp-rendering", "crispEdges")
        .attr("cy", function(d) { return ( d.getMonthWeek() * (cellSize) + day_rect_height + (cellSize)*0.55 ) ; })
        .attr("cx", function(d) { return (  day(d) * (cellSize) + (cellSize)*0.55 ) ; })
        .datum(format);

    circle.append("title")
        .text(function(d) { return d; });

    var label_format = d3.time.format("%d");

    var date_label = svg.selectAll(".redmine_activity_monthly_date_label")
        .data(days)
      .enter().append("text")
        .attr("class", "redmine_activity_monthly_date_label")
        .attr("y", function(d) { return ( d.getMonthWeek() * (cellSize) + 12 + day_rect_height ) ; })
        .attr("x", function(d) { return (day(d) * (cellSize)) ; })
        .attr("fill", function(d) { if (day(d) == 0) { return sunday_date_color; } else { return date_color; } })
        .text( function(d) { return label_format(d)});


    var line = svg.selectAll(".redmine_activity_monthly_week")
        .data(d3.range(0,6))
      .enter().append("line")
        .attr("class", "redmine_activity_monthly_week")
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

}

