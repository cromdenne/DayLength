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

// callback from sunrise-sunset API
APIcallback = function(data) {
	var status = data.status;
	console.log("sunrise-sunset.org API call status: " + status);

	if (status == "OK") {
		var sunrise = new Date(data.results.sunrise);
		var sunset = new Date(data.results.sunset);
		var daylength = toHHMMSS(data.results.day_length);

		$("#sunrise-time").text(sunrise.toLocaleTimeString());
		$("#daylength-time").text(daylength);
		$("#sunset-time").text(sunset.toLocaleTimeString());
	}
	$("#content-generated").toggle();
	$("#footer").toggle();
};

// handle submission of location and date
$("#search-submit").click(function(){
	if($("#search-location").val() != "") {
		var place = autocomplete.getPlace();
		var address = place.formatted_address;
		var coordinates = place.geometry.location;
		var date;

		$("#title-location").text(address);

		if($("#search-date").val() != "") {
			date = new Date($("#search-date").val());
		} else {
			date = new Date();
		}
		$("#title-date").text(date.toLocaleDateString());

		var latitude = coordinates.lat();
		var longitude = coordinates.lng();
		var query = "http://api.sunrise-sunset.org/json?lat=" + latitude 
					+ "&lng=" + longitude 
					+ "&date=" + date.toLocaleDateString() 
					+ "&formatted=0&callback=APIcallback";
	

		$.ajax({
			url: query,
			dataType: "jsonp",
			jsonpCallback: "APIcallback"
		});
	} else {
		return false;
	}
});