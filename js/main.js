var autocomplete = new google.maps.places.Autocomplete((document.getElementById('search-location')), {
	types: ['(cities)']
});

$("#search-submit").click(function(){
	if($("#search-location").val() != "") {
		var place = autocomplete.getPlace();
		var address = place.formatted_address;
		var coordinates = place.geometry.location;
		$("#title-location").text(address);
		$("#title-coordinates").text(coordinates);
	} else {
		return false;
	}
});