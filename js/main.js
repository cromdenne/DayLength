// bind Google Places autocomplete to location input
var autocomplete = new google.maps.places.Autocomplete((document.getElementById('search-location')), {
	types: ['(cities)']
});

// bind datepicker to date input
$(function () {
    $('#search-date').datetimepicker({
    	format: 'L'
    });
});

// convert number of seconds into readable format
toHHMMSS = function (sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

// convert day of week to string
toDay = function (day_num) {
	if (day_num == 0) { return "Sunday"; }
	else if (day_num == 1) { return "Monday" }
	else if (day_num == 2) { return "Tuesday" }
	else if (day_num == 3) { return "Wednesday" }
	else if (day_num == 4) { return "Thursday" }
	else if (day_num == 5) { return "Friday" }
	else if (day_num == 6) { return "Saturday" }
	else {
		console.log(day_num + " is not a valid day.");
		return;
	}
}

// remove space between time and AM/PM notation
noSpace = function (time) {
	var timeparts = time.split(" ");
	return timeparts[0] + timeparts[1];
}

// callback from sunrise-sunset API for main data
APIcallbackMain = function(data) {
	var status = data.status;
	//console.log("sunrise-sunset.org API call status main: " + status);

	if (status == "OK") {
		var sunrise = new Date(data.results.sunrise);
		var sunset = new Date(data.results.sunset);
		var daylength = toHHMMSS(data.results.day_length);

		// set main data
		$("#sunrise-time").text(noSpace(sunrise.toLocaleTimeString()));
		$("#daylength-time").text(daylength);
		$("#sunset-time").text(noSpace(sunset.toLocaleTimeString()));

		// set trend data
		$("#forecast-current-date").text(sunrise.toLocaleDateString());
		$("#forecast-current-day").text(toDay(sunrise.getDay()));
		$("#forecast-current-sunrise").text(noSpace(sunrise.toLocaleTimeString()));
		$("#forecast-current-daylength").text(daylength);
		$("#forecast-current-sunset").text(noSpace(sunset.toLocaleTimeString()));
	}
	$("#content-generated").show();
	$("#footer").show();
};

// callback from sunrise-sunset API for trend data past
APIcallbackTrendPast = function(data) {
	var status = data.status;
	//console.log("sunrise-sunset.org API call status trend past: " + status);

	if (status == "OK") {
		var sunrise = new Date(data.results.sunrise);
		var sunset = new Date(data.results.sunset);
		var daylength = toHHMMSS(data.results.day_length);

		$("#forecast-before-date").text(sunrise.toLocaleDateString());
		$("#forecast-before-day").text(toDay(sunrise.getDay()));
		$("#forecast-before-sunrise").text(noSpace(sunrise.toLocaleTimeString()));
		$("#forecast-before-daylength").text(daylength);
		$("#forecast-before-sunset").text(noSpace(sunset.toLocaleTimeString()));
	}
}

// callback from sunrise-sunset API for trend data future
APIcallbackTrendFuture = function(data) {
	var status = data.status;
	//console.log("sunrise-sunset.org API call status trend future: " + status);

	if (status == "OK") {
		var sunrise = new Date(data.results.sunrise);
		var sunset = new Date(data.results.sunset);
		var daylength = toHHMMSS(data.results.day_length);

		$("#forecast-after-date").text(sunrise.toLocaleDateString());
		$("#forecast-after-day").text(toDay(sunrise.getDay()));
		$("#forecast-after-sunrise").text(noSpace(sunrise.toLocaleTimeString()));
		$("#forecast-after-daylength").text(daylength);
		$("#forecast-after-sunset").text(noSpace(sunset.toLocaleTimeString()));
	}
}

// handle submission of location and date
$("#search-submit").click(function(){
	if($("#search-location").val() != "") {
		//temporarily hide content while populating
		$("#content-generated").hide();
		$("#footer").hide();

		// set important data
		var place = autocomplete.getPlace();
		var address = place.formatted_address;
		var coordinates = place.geometry.location;
		var date;

		$("#title-location").text(address);

		// date could be left blank, if so then default to current date
		if($("#search-date").val() != "") {
			date = new Date($("#search-date").val());
		} else {
			date = new Date();
		}
		$("#title-date").text(date.toLocaleDateString());

		// prep API URL
		var latitude = coordinates.lat();
		var longitude = coordinates.lng();
		var query = "https://api.sunrise-sunset.org/json?lat=" + latitude 
					+ "&lng=" + longitude 
					+ "&date=" + date.toLocaleDateString() 
					+ "&formatted=0&callback=APIcallbackMain";
	
		// call API for main data
		$.ajax({
			url: query,
			dataType: "jsonp",
			jsonpCallback: "APIcallbackMain"
		});

		// prep and call API URL for trend data past
		var trendPast = "https://api.sunrise-sunset.org/json?lat=" + latitude 
					+ "&lng=" + longitude 
					+ "&date=-7 day " + date.toLocaleDateString() 
					+ "&formatted=0&callback=APIcallbackTrendPast";
		$.ajax({
			url: trendPast,
			dataType: "jsonp",
			jsonpCallback: "APIcallbackTrendPast"
		});

		// prep and call API URL for trend data future
		var trendFuture = "https://api.sunrise-sunset.org/json?lat=" + latitude 
					+ "&lng=" + longitude 
					+ "&date=+7 day " + date.toLocaleDateString() 
					+ "&formatted=0&callback=APIcallbackTrendFuture";
		$.ajax({
			url: trendFuture,
			dataType: "jsonp",
			jsonpCallback: "APIcallbackTrendFuture"
		});

	} else {
		return false;
	}
});