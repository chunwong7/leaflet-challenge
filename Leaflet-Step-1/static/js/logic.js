
queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL, function(data) {
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {

    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, location) {
        return L.circleMarker(location);
      },
      style: mapFeatures,
      onEachFeature: onEachFeature
    });
  
    createMap(earthquakes);
    
  }

  function createMap(earthquakes) {

    var streetmap =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  

    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h1>Magnitude: " + feature.properties.mag + "<br><h2>Location: " + feature.properties.place);
  }

  function mapFeatures(feature) {
    return {
      fillOpacity: .5,
      fillColor: adjustColor(feature.properties.mag),
      radius: adjustRadius(feature.properties.mag),
      color: "white",
      weight: 0.5
    };
  }

  function adjustColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "orange";
    case magnitude > 3:
      return "yellow";
    case magnitude > 2:
      return "lightgreen";
    case magnitude > 1:
      return "lightblue";
    default:
      return "white";
    }
  }

  function adjustRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 7;
  }




  