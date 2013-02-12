function myActivityRenderer(url, div_id, options) {
	
	var svg_width  = (options.width != null) ?options.width :500;
	var svg_height = (options.height != null) ?options.height :200;
	var label_height = 30;
	var div_to = document.getElementById(div_id);

	

	var my_activity_div = document.createElement("div");
    my_activity_div.setAttribute("id", "my_activity_div");
    my_activity_div.setAttribute("style", "width:" + svg_width.toString() + "px; height:" + svg_height.toString() + "px;");

    div_to.appendChild(my_activity_div);

    var my_activity_label = document.createElement("div");
    my_activity_label.setAttribute("id", "my_activity_label");
    my_activity_label.setAttribute("style", "width:" + (svg_width).toString() + "px; height:" + label_height.toString() + "px;");

    var my_activity_chart = document.createElement("div");
    my_activity_chart.setAttribute("id", "my_activity_chart");
    my_activity_chart.setAttribute("style", "width:" + (svg_width).toString() + "px; height:" + (svg_height-label_height).toString() + "px;");
    
    my_activity_div.appendChild(my_activity_label);
    my_activity_div.appendChild(my_activity_chart);
    
    ajaxActivityRenderer(url,div_id);

	function ajaxActivityRenderer(url,div_id) {
		jQuery.ajax( {       
			//url: '/my_month/' + month + '/and/' + year,
			url: url,
			dataType: "json",
			success:  function(dataset){
				d3.select(my_activity_chart).selectAll("svg").remove();
				my_activity_chart.innerHTML="";
				data = d3.entries(dataset); 
				activityRenderer(my_activity_chart, data, "14-Oct-11", "20-Dec-11");  
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error ajax, activity renderer!'); }
		});
	}

	function activityRenderer(div_id,dataset,date_from,date_to) {
		var margin = {top: 30, right: 0, bottom: 20, left: 25},
		    width = svg_width - margin.left - margin.right,				//500
		    height = svg_height - margin.top - margin.bottom - label_height;			//200

		var parseDate = d3.time.format("%d-%b-%y").parse;

		var days = d3.time.days( parseDate(date_from) , parseDate(date_to) ) ;
		var cir_id, tooltip_id;
		var date = d3.time.format("%d-%b");

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, -10]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .ticks(3);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .ticks(5)
		    .tickSize(4, 4)
		    .orient("left");

		var area = d3.svg.area()
		    .x(function(d) { return x(d.key); })
		    .y0(height)
		    .y1(function(d) { return y(d.value); });
		    //.interpolate("basis");
		    //.interpolate(function(points) { return points.join("A 1,1 0 0 1 "); });

		var line = d3.svg.line()
			.x(function(d) { return x(d.key); })
			.y(function(d) { return y(d.value); });
			//.interpolate("basis");
			//.interpolate(function(points) { return points.join(""); });*/

		dataset.forEach(function(d) {
		    d.key = parseDate(d.key);
		    //d.val = +d.val;
		  });

		/*var area = d3.svg.area()
		    .x(function(d) { return x(d); })
		    .y0(height)
		    .y1(function(d) { return y(10) });
		    //.interpolate(function(points) { return points.join("A 1,1 0 0 1 "); });

		var line = d3.svg.line()
			.x(function(d) { return x(d); })
			.y(function(d) { return y(10); });
			//.defined( function(d) { var temp = false; dataset.forEach(function(x) { if (x.key == d) { temp = true; console.log(x.key)} }); return temp; }  );
			//.interpolate(function(points) { return points.join(""); });

		/*var line2 = d3.svg.line()
			.x(function(d) { return x(d.key); })
			.y(function(d) { return y(d.value); });*/

		var svg = d3.select(div_id).selectAll("svg")
			.data([1])
			.enter().append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom )
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		

		x.domain(d3.extent(dataset, function(d) { return d.key; }));
	    y.domain([-10, d3.max(dataset, function(d) { return d.value; })]);

	    var label = svg.selectAll("rect")
						.data([1]).enter().append("rect")
						.attr("class","my_activity_rect")
						.attr("id", function(d,i) { return "rect-" + i.toString() })
						.attr("x", function(d,i) { return width-(i* width/dataset.length)-width/dataset.length })
						.attr("y", -margin.top)
						.attr("height", height+margin.top)
						.attr("width", width/dataset.length)
	    


		svg.append("path")
		  .datum(dataset)
		  .attr("class", "area")
		  .attr("d", area);


		svg.append("path")
		  .attr("class","path2")
		  .attr("d", line(dataset));

		//pathChange();

		var rect = svg.selectAll("rect")
						.data(dataset).enter().append("rect")
						.attr("class","my_activity_rect")
						.attr("id", function(d,i) { return "rect-" + i.toString() })
						.attr("x", function(d,i) { return width-(i* width/dataset.length)-width/dataset.length })
						.attr("y", -margin.top)
						.attr("height", height+margin.top)
						.attr("width", width/dataset.length)
						//.style("display","none")
						.on("mouseover", function() {
							var get_id = this.id.split("-");
							cir_id = "#circle-"+get_id[1];
							tooltip_id = "#tooltip-"+get_id[1];
							console.log(tooltip_id);
							d3.select(div_id).select(cir_id)
							    .style("display","block");
							d3.select(div_id).select(tooltip_id)
							    .style("display","block");
							my_activity_label.innerHTML= dataset[get_id[1]].value + "h on " + date(dataset[get_id[1]].key);
							})
						.on("mouseout", function() {
							d3.select(cir_id)
							    .style("display","none");
							d3.select(div_id).select(tooltip_id)
							    .style("display","none");
							});

		

		var circle = svg.selectAll("circle")
						.data(dataset).enter().append("circle")
						.attr("class","my_activity_circle")
						.attr("id", function(d,i) { return "circle-" + i.toString() })
						.attr("cx", function(d) { return x(d.key);})
						.attr("cy", function(d) { return y(d.value)})
						.attr("r", 3)
						.style("display","none");

		/*circle.append("title")
      		.text(function(d) { return d.value + " hours on " + d.key; });*/

		var tooltip = svg.selectAll("text")
						.data(dataset).enter().append("text")
						.attr("class","my_activity_tooltip")
						.attr("id", function(d,i) { return "tooltip-" + i.toString() })
						.attr("x", function(d) { return x(d.key);})
						.attr("y", function(d) { return y(d.value)-10})
						.text(function(d) { return d.value + " hours on " + date(d.key); })
						.style("display","none");


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

		
						/*.on("mouseover", function() {
							d3.select(this)
							    //.style("display","block")
							    .attr("r", 4)
							})
						.on("mouseout", function() {
							d3.select(this)
							    //.style("display","none")
							    .attr("r", 2)
							});*/



		/*function pathChange() {
			svg.selectAll("path")
				.attr("d", line2(dataset))
				.transition() 
				.ease("linear")
				.duration(2000000);
		}*/
	}
	
}