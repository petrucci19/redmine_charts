function myActivityRenderer(url, div_id, options) {
	
	var svg_width  = (options.width != null) ?options.width :500;
	var svg_height = (options.height != null) ?options.height :200;

	var div_to = document.getElementById(div_id);
	var my_activity_div = document.createElement("div");
    my_activity_div.setAttribute("id", "my_activity_div");
    my_activity_div.setAttribute("style", "width:" + svg_width.toString() + "px; height:" + svg_height.toString() + "px;");
    div_to.appendChild(my_activity_div);
    ajaxActivityRenderer(url,div_id);

	function ajaxActivityRenderer(url,div_id) {
		jQuery.ajax( {       
			//url: '/my_month/' + month + '/and/' + year,
			url: url,
			dataType: "json",
			success:  function(dataset){
				d3.select(my_activity_div).selectAll("svg").remove();
				my_activity_div.innerHTML="";  
				activityRenderer(my_activity_div, dataset);  
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error ajax, activity renderer!'); }
		});

	}


	function activityRenderer(div_id,dataset) {
		var margin = {top: 10, right: 5, bottom: 20, left: 25},
		    width = svg_width - margin.left - margin.right,				//500
		    height = svg_height - margin.top - margin.bottom;			//200

		var parseDate = d3.time.format("%d-%b-%y").parse;

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .ticks(5)
		    .tickSize(4, 4)
		    .orient("left");

		var area = d3.svg.area()
		    .x(function(d) { return x(d.date); })
		    .y0(height)
		    .y1(function(d) { return y(d.val); })
		    .interpolate("basis");
		    //.interpolate(function(points) { return points.join("A 1,1 0 0 1 "); });

		var line = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.val); })
			.interpolate("basis");
			//.interpolate(function(points) { return points.join(""); });

		var svg = d3.select(div_id).selectAll("svg")
			.data([1])
			.enter().append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		dataset.forEach(function(d) {
		    d.date = parseDate(d.date);
		    //d.val = +d.val;
		  });

		x.domain(d3.extent(dataset, function(d) { return d.date; }));
	    y.domain([0, d3.max(dataset, function(d) { return d.val; })]);


		svg.append("path")
		  .datum(dataset)
		  .attr("class", "area")
		  .attr("d", area);


		svg.append("path")
		  .attr("class","path2")
		  .attr("d", line(dataset));

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
		  .style("text-anchor", "end");
		  //.text("Price ($)");
	}
	
}