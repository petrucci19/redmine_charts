/*
 * Usage:
   url, div_id, options = { barWidth, colors, labels}
  
*/


function bar1Renderer(url, div_id, options){
			
	var bar1,arr,bar_ticks,obj,
	    inn_arr_8 =[], inn_arr_1 = [], inn_arr_2 = [], inn_arr_3=[];

	jQuery.ajax( {
           
        cache: false,
        //url: '/bar1',
        url: url,
        dataType: "json",
        success:  function(data){
        	console.log(data);
        	arr = new Array();
        	bar_ticks = new Array();
        	for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			    	inn_arr_8.push(8);
			    	inn_arr_1.push(data[key][0]);
			    	inn_arr_2.push(data[key][1]);
			    	inn_arr_3.push(data[key][2]);
			    	bar_ticks.push(key);
			  }
			}
			arr.push(inn_arr_8, inn_arr_1, inn_arr_2, inn_arr_3);			        
	        $("#" + div_id).html("");
	        $.jqplot(div_id, arr, {
		        //seriesColors: [ "#3366CC", "#DC3912", "#FF9900", "#109618"],
		        seriesColors : options.colors,
		        seriesDefaults:{
		            renderer:$.jqplot.BarRenderer,
		            rendererOptions: {
		            	fillToZero: true,
		            	//barWidth: 10
		            	barWidth: options.barWidth
		            }				            
		        },
		        /*series:[
		        	{label:'Expected Hours'},
		            {label:'Design and Analysis'},
		            {label:'Development'},
		            {label:'Bug Fixing'}
		        ],*/
		        series: [
					{label: options.label[0]},
					{label: options.label[1]},
					{label: options.label[2]},
					{label: options.label[3]}
		        ],
		        legend: {
		            show: true,
		            placement: 'outsideGrid'
		        },
		        axes: {
		            xaxis: {
		                renderer: $.jqplot.CategoryAxisRenderer,
		                ticks: bar_ticks
		            },
		            yaxis: {
		                pad: 1.2
		                //tickOptions: {formatString: '$%d'}
		            }
		        }
		    });
    	},
    	error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error bar1 ajax!'); }

    });
};
