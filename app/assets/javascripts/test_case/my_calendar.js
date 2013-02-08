/*  
	Usage:
	url 	-> url for ajax request
	div_id 	-> div for svg
	Note that year_from and year_to are inclusive.
	options = {
		svg_width	: should be a number. default value is 1000
		svg_height	: should be a number. default value is 200
		cellSize	: should be a number. default value is 15
		padding		: should be a number. default value is 3
		color_range	: [ [range_lower, range_upper, range_color], [range_lower, range_upper, range_color]... , default_color]
		Eg. color_range : [[1,5,"#FFF"],[6,8,"#BBB"],[9,10,"#CCC"], "#000"];
		default_color: should be a color string. default value is "#F5F5F5"
	}
	Note that each year has its own svg.
*/

function ajaxYearRenderer(url, div_id, year_from, year_to, options){
	jQuery.ajax( {       
        url: url,
        dataType: "json",
        success:  function(dataset){
        	$(div_id).html("");
        	yearRenderer(dataset, div_id, year_from, year_to, options);	
    	},
    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error year calendar ajax!'); }
    });
}

function yearRenderer(dataset, div_id, year_from, year_to, options){

	console.log(options);
	
	var width 	= (options.width != null && typeof options.width == "number" ) ?options.width :1000,
		height 	= (options.height != null && typeof options.height == "number" ) ?options.height :200,
		cellSize= (options.cellSize != null && typeof options.cellSize == "number" ) ?options.cellSize :15,
		padding = (options.padding != null && typeof options.padding == "number" ) ?options.padding :3,
		colors	= options.color_range;

	var day = d3.time.format("%w"),
	    week = d3.time.format("%U"),
	    percent = d3.format(".1%"),
	    format = d3.time.format("%Y-%m-%d");

	var color = d3.scale.quantize()
	    .domain([0,10])
	    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

	var svg = d3.select(div_id).selectAll("svg")
	    .data(d3.range(year_from, year_to))
	  .enter().append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "RdYlGn")
	  .append("g")
	    .attr("transform", "translate(" + (( (width - (cellSize + padding) * 53) / 2) ) + "," + (height - (cellSize + padding) * 7 - 1) + ")");

	svg.append("text")
	    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
	    .style("text-anchor", "middle")
	    .attr("fill", "#737373")
	    .text(function(d) { return d; });

	var rect = svg.selectAll(".my_calendar_day")
	    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	  .enter().append("rect")
	    .attr("class", "my_calendar_day")
	    .attr("width", cellSize)
	    .attr("height", cellSize)
	    .attr("x", function(d) { return (week(d) * (cellSize + padding)) ; })
	    .attr("y", function(d) { return (day(d) * (cellSize + padding)) ; })
	    .attr("fill", (options.default_color!=null)?options.default_color:"#F5F5F5")
	    .datum(format);

	rect.append("title")
	    .text(function(d) { return d; });

	svg.selectAll(".my_calendar_month")
	    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	  .enter().append("path")
	    .attr("class", "my_calendar_month")
	    .attr("d", monthPath);
	
	svg.selectAll(".my_calendar_month_label")
	    .data( d3.range(0,12) )
	  .enter().append("text")
	    .attr("class", "my_calendar_month_label")
	    .attr("x", function(d) { return (d+0.45)*(cellSize+padding)*4.35 })
	    .attr("y", -5)
	    .text( function(d) { return monthNameShort[d] } );

	rect.filter(function(d) { return d in dataset; })
	      .attr("class", "day")
	      .attr("fill", function(d) {
	      		console.log(dataset[d]);
	      		for (var i=0; i<colors.length; i++){
	      			if (dataset[d] >= colors[i][0] && dataset[d] <= colors[i][1]){
	      				console.log(colors[i][2]);
	      				return colors[i][2];
	      			}
	      		}
	      	})
	    .select("title")
	      .text(function(d) { return d + ": " + dataset[d]; });
	

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

	//d3.select(self.frameElement).style("height", "2910px");
};