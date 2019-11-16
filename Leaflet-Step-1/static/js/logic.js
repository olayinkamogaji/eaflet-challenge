var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 6
});
function getColor(d) {
	return d > 5 ? '#800026' :
	       d > 4  ? '#BD0026' :
	       d > 3  ? '#E31A1C' :
	       d > 2  ? '#FC4E2A' :
	       d > 1   ? '#FD8D3C' :
	       d > 0  ? '#FEB24C' :
	                  '#FFEDA0';
}

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Assemble API query URL
var url = baseURL;

// Grab the data with d3
d3.json(url, function(response) {

  console.log(response);


  // Loop through data
  for (var i = 0; i < response['features'].length; i++) {

    // Set the data location property to a variable
    var location = response['features'][i]['geometry']['coordinates'];
    // console.log(location[0]);
    // Check for location property
    if (location) {

      // // Add a new marker to the cluster group and bind a pop-up
      // markers.addLayer(L.marker(location[1],location[0])
      //   .bindPopup(response['features'][i]['id']));

      // L.marker([location[1], location[0]]).addTo(myMap);
      var circle = L.circle([location[1], location[0]], {
        color: getColor((response['features'][i]['properties']['mag'])+1),
        fillColor: getColor(response['features'][i]['properties']['mag']),
        fillOpacity: 0.8,
        radius: 8000 * (response['features'][i]['properties']['mag']+0.7)
      }).bindPopup(response['features'][i]['properties']['title']).addTo(myMap);

    }
  }


});
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background-color:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;

};

legend.addTo(myMap);
