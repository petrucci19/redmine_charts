var monthNameFull = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var monthNameShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
var dayNameShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getTodaysDate() {
	return new Date();
}

Date.prototype.getMonthWeek = function(){
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return ( Math.ceil((this.getDate() + firstDay)/7) - 1 );
}
