function ajaxYearRenderer(year_from, year_to){
	jQuery.ajax( {       
       //url: '/year_data?from=' + year_from + '?to=' + year_to,
        url: '/my_calendar/' + year_from + '/to/' + year_to,
        dataType: "json",
        success:  function(dataset){
        	$("#year").html("");
        	yearRenderer(dataset, year_from, year_to);	
    	},
    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error year calendar ajax!'); }

    });
}

function yearRenderer(dataset, year_from, year_to){
	
	var width = 1000,
    height = 200,
    cellSize = 15,	// cell size
    padding = 3;	// cell padding


	var day = d3.time.format("%w"),
	    week = d3.time.format("%U"),
	    percent = d3.format(".1%"),
	    format = d3.time.format("%Y-%m-%d");

	var color = d3.scale.quantize()
	    .domain([0,10])
	    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

	var svg = d3.select("#year").selectAll("svg")
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

	var rect = svg.selectAll(".day")
	    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	  .enter().append("rect")
	    .attr("class", "day")
	    .attr("width", cellSize)
	    .attr("height", cellSize)
	    .attr("x", function(d) { return (week(d) * (cellSize + padding)) ; })
	    .attr("y", function(d) { return (day(d) * (cellSize + padding)) ; })
	    .datum(format);

	rect.append("title")
	    .text(function(d) { return d; });

	svg.selectAll(".month")
	    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
	  .enter().append("path")
	    .attr("class", "month")
	    .attr("d", monthPath);
	
	var monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	svg.selectAll(".month_label")
	    .data( d3.range(0,12) )
	  .enter().append("text")
	    .attr("class", "month_label")
	    .attr("x", function(d) { return (d+0.45)*(cellSize+padding)*4.35 })
	    .attr("y", -5)
	    .text( function(d) { return monthShort[d] } );

	rect.filter(function(d) { return d in dataset; })
	      .attr("class", function(d) { return "day " + color(dataset[d]); })
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

	d3.select(self.frameElement).style("height", "2910px");
};