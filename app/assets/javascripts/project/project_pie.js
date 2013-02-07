var plot1, plot2, txt;

function dataRenderer(){
    jQuery.ajax({                
      cache: false,
      dataType: "json",
      success:  function(data){ 
        txt = "<p>" + data['ns'] + " Test cases not started </br>" + data['p'] + " Test cases passed </br>" + data['f'] + " Test cases failed </br> </p>";
        document.getElementById("summary_data").innerHTML=txt;
        plot1.series[0].data=  [ ['Design & Analysis',data['ns']], ['Bug-Fixing',data['f']] , ['Development',data['p']] ] ;
        console.log(plot1.data);  
        plot1.redraw();
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error!'); } 
    });

    jQuery.ajax({       
      cache: false,
      url: '/project/list/2',
      dataType: "json",
      success:  function(data){ 
        plot2.series[0].data= [ ['Design & Analysis',data['ns']], ['Bug-Fixing',data['f']] , ['Development',data['p']] ];
        console.log(plot2.data);  
        plot2.redraw();
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error!'); } 
    });
};

function getStyle(el,styleProp)
{
    var x = document.getElementById(el);
    if (x.currentStyle)
        var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
    return y;
}


function emptyPieRenderer(div_id)
{
    var piedata = [ ['default',1] ],
        s2= [[null]],
        outer_diameter = 220,
        donut_thickness = outer_diameter*0.2,
        plot = jQuery.jqplot (div_id, [ piedata, s2 ] , 
        { 
          seriesDefaults: {
            renderer: jQuery.jqplot.DonutRenderer,
            rendererOptions:{
              seriesColors: [ "#FF9900", "#38761D", "#3366CC"],
              sliceMargin: 1,
              diameter: outer_diameter,
              thickness: donut_thickness,
              startAngle: -250,
              showDataLabels: true,
              dataLabels: 'percent',
              highlightMouseOver: false,
              highlightMouseDown: false
            }
          }, 
          legend: { show:true},
          grid: {borderWidth:0, background: '#ffffff', shadow:false}
        }
      );
    return plot;
}

function blockDiv(div_id)
{
    $(div_id).block({ 
        message: '<h2 style="text-align:center;">Processing</h2>', 
        css: { 
            border: 'none',
            padding: '0px 120px 0px 80px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } 
    });

}