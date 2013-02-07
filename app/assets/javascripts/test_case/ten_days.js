function ajaxTenDaysRenderer(to_date){
  jQuery.ajax( {       
        //url: '/my_month/' + month + '/and/' + year,
        url: '/ten_days',
        dataType: "json",
        success:  function(dataset){
          d3.select("#ten_days").selectAll("svg").remove();
          tenDaysRenderer(dataset, to_date);  
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error month calendar ajax!'); }
    });
}

function tenDaysRenderer(dataset, to_date) {

  var width = 400,
      height = 100,
      padding = 25,
      bar_width = (width-9*padding)/10,
      offset = 22,
      bar_max_height = (height - offset)*0.9,
      day_label_offset_1 = 2,
      day_label_offset_2 = 12;

  var day = d3.time.format("%w"),
      week = d3.time.format("%U"),
      percent = d3.format(".1%"),
      format = d3.time.format("%Y-%m-%d"),
      month = d3.time.format("%b"),
      date = d3.time.format("%d");


  var svg = d3.select("#ten_days").selectAll("svg")
      .data([1])
    .enter().append("svg")
      .attr("id","10_days_svg")
      .attr("width", width)
      .attr("height", height)
    .append("g");
      //.attr("transform", "translate(" + ((width - (cellSize + padding) * 53) / 2) + "," + (height - (cellSize + padding) * 7 - 1) + ")");
      //.attr("transform", "translate(20,20)");
  //var today = new Date();
  var days = d3.time.days(new Date(to_date.getFullYear(), to_date.getMonth(), to_date.getDate()-10), new Date(to_date.getFullYear(), to_date.getMonth(), to_date.getDate()) );

  var day_bar = svg.selectAll(".day_bar")
      .data(days)
    .enter().append("rect")
      .attr("class", "day_bar")
      .attr("width", bar_width)
      .attr("height", 0)
      .attr("y", 0)
      .attr("x", function(d,i){ return i * (width/10) })
      .datum(format);

  day_bar.append("title")
      .text(function(d) { return d; });

  var scale = d3.scale.linear()
                  .domain([0, 12])
                  .range([0, bar_max_height]);

  day_bar.filter(function(d) { return d in dataset; })
          .attr("height", function(d) { return scale(dataset[d]) } )
          .attr("y", function(d) { return height-scale(dataset[d])-offset } )
          .select("title")
          .text(  function(d) { return dataset[d] + " hours"; }   );

  var line = svg.selectAll(".axis")
      .data([1])
    .enter().append("line")
      .attr("class", "axis")
      .attr("x1", 0)
      .attr("y1", height-offset)
      .attr("x2", width)
      .attr("y2", height-offset);

  var day_label = svg.selectAll(".day_label")
      .data(days)
    .enter().append("text")
      .attr("class", "day_label");
      //.attr("x", function(d,i){ return i * (width/10) })
      //.attr("y", height-day_label_offset)
      //.attr("transform", function(d, i) {return "translate(" + (i * (width/10)) + "," + (height-day_label_offset-padding*1.3) + ")";});
  
  day_label.append("tspan")
    .text( function(d) { return date(d) } )
    .attr("x", function(d,i){ return i * (width/10) + 3 })
    .attr("y", height-day_label_offset_2);

  day_label.append("tspan")
    .text( function(d) { return dayNameShort[day(d)] } )
    .attr("x", function(d,i){ return i * (width/10) })
    .attr("y", height-day_label_offset_1);
      
};