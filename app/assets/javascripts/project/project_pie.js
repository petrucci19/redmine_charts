
var plot1, plot2;


function dataRenderer(){
  jQuery.ajax( {
                   
              cache: false,
              //async:false,
              dataType: "json",
              success:  function(data){ 
                             
                //console.log(data);
                txt = "<p>" + data['ns'] + " Test cases not started </br>" + data['p'] + " Test cases passed </br>" + data['f'] + " Test cases failed </br> </p>";
                document.getElementById("summary_data").innerHTML=txt;
                //piedata = [  ['Not started',data['ns']], ['failed',data['f']] , ['started',data['p']]  ];
                //console.log(piedata1);
                plot1.series[0].data=  [ ['Not started',data['ns']], ['failed',data['f']] , ['started',data['p']] ] ;
                console.log(plot1.data);  
                plot1.redraw();
                //alert('test!');

              },

              error : function(XMLHttpRequest, textStatus, errorThrown) { console.log('Error!'); } 
     });

  jQuery.ajax( {
                   
              cache: false,
              url: '/project/list/2',
              dataType: "json",
              success:  function(data){ 
                
                //console.log(data);
                //txt = "<p>" + data['ns'] + " Test cases not started </br>" + data['p'] + " Test cases passed </br>" + data['f'] + " Test cases failed </br> </p>";
                //document.getElementById("summary_data").innerHTML=txt;
                //piedata = [  ['Not started',data['ns']], ['failed',data['f']] , ['started',data['p']]  ];
                //console.log(piedata1);
                plot2.series[0].data= [ ['Not started',data['ns']], ['failed',data['f']] , ['started',data['p']] ];
                console.log(plot2.data);  
                plot2.redraw();
                //alert('test!');

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