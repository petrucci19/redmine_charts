function calendarDayRenderer(plot,select){
	jQuery.ajax( {
           
        cache: false,
        url: '/calendar/' + select,
        dataType: "json",
        success:  function(data){ 
        	var arr=new Array();		        	
        	var x=10;
        	var i=0;
        	table1 = document.getElementById('labels_table');
        	for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			  	var date_arr = key.split("-");
			  	var d = new Date(date_arr[0],date_arr[1]-1,date_arr[2]);
			  	var date_str = "day-"+ date_arr[0] + "-" + date_arr[1] + "-" + date_arr[2];
			  	var str = dayNameShort[d.getDay()] + ", " + monthNameShort[d.getMonth()] + " " + date_arr[2];
				var bubble_opt = { label: date_str , color : "#000000"};
			  	if (data[key]>3) {
			  		bubble_opt.color="#868686";
			  	}
			  	cell = table1.rows[0].cells[i];
			  	cell.firstChild.data = str;
			    arr.push(new Array(x,2,data[key],bubble_opt));
			  }
			  x += 10; i+=1;
			}
			plot.series[0].data= arr;
			plot.replot();
			
    	},
    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error calendar ajax!'); }
    });
};

function calendarWeekRenderer(plot,select){
	jQuery.ajax( {
           
        cache: false,
        url: '/calendar/' + select,
        dataType: "json",
        success:  function(data){ 
        	//console.log(select);                
        	console.log(data);
        	var arr=new Array();		        	
        	x=10;
        	i=0;
        	table1 = document.getElementById('labels_table');
        	for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			  	var date_arr = key.split("-");
			  	var date_str = "week-" + date_arr[0] + "-" + date_arr[1];
			  	var str = "Week " + date_arr[1] + ", " + date_arr[0];
			  	var bubble_opt = { label: date_str , color: "#00FF66"};
			  	if (data[key]>3) {
			  		bubble_opt.color="#00CC66";
			  	}

			  	cell = table1.rows[0].cells[i];
			  	cell.firstChild.data = str;
			    arr.push(new Array(x,2,data[key],bubble_opt));
			  }
			  x += 10; i+=1;
			}
		
			plot.series[0].data= arr;  
	        plot.replot();
    	},
    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error calendar ajax!'); }
    });
};

function calendarTooltip(chart_id, tooltip_id) {
	$(chart_id).bind('jqplotDataHighlight', 
	    function (ev, seriesIndex, pointIndex, data, radius) {    
			var chart_left = $(chart_id).offset().left,
			chart_top = $(chart_id).offset().top,
			x = test_case_calendar.axes.xaxis.u2p(data[0]),  // convert x axis unita to pixels
			y = test_case_calendar.axes.yaxis.u2p(data[1]);  // convert y axis units to pixels
			var color = 'rgb(50%,50%,100%)';
			
      	jQuery.ajax( {
           		url: '/tooltip?date=' + data[3].label,
		        dataType: "json",
		        success:  function(data){
		        	var ns,f,p=0;                 
		        	if(data[1] != undefined) {ns= data[1]};
		        	if(data[2] != undefined) {f= data[2]};
		        	if(data[3] != undefined) {p= data[3]};
		        	$(tooltip_id).css({position:"absolute",left:chart_left+x+radius+5, top:chart_top+y, padding:"5px"});
					$(tooltip_id).html('<span style="font: 15px "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif; color:#000; text-align:justify;">' + "<b>" + data[2] + " Test Cases:</b><br>" + ns +" Not Started<br>"+ f +" Failed<br>"+ p +" Passed<br>" );
					$(tooltip_id).show();
		    	},
		    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error tooltip ajax!'); }

		    });	
		});
	   
	$(chart_id).bind('jqplotDataUnhighlight', 
	      function (ev, seriesIndex, pointIndex, data) {
	          $(tooltip_id).empty();
	          $(tooltip_id).hide();
	      });
}

function calendarPlot(chart_div,array) {
	var plot = $.jqplot(chart_div,array,{
    	seriesColors: ["#898989"], 
		axes: {
	        xaxis: {
	        	min:10, max:100, numberTicks: 10, showTicks: false,
	        	//ticks: labels,
	        	tickOptions:{
			        showGridline: false    
			    }

	        },

	        yaxis: { min:0, max: 4, numberTicks: 3, showTicks: false,
	        	tickOptions:{
			        showGridline: false
			    }
	        }
	    },

        seriesDefaults:{
            renderer: $.jqplot.BubbleRenderer,
            rendererOptions: {
            	autoscaleBubbles:true,
            	autoscaleMultiplier : 1.8,
                bubbleAlpha: 1,
                highlightAlpha: 0,
                showLabels: false
            },
            shadow: true,
            shadowAlpha: 0.05
        },
        grid: {borderWidth:0, background: '#ffffff', shadow:false}
    });
    return plot;
}