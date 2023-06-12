/**
 * Fetches a geojson file as well as a data file and joins them before passing to L.choropleth
**/

// config map
 let config = {
   minZoom: 9,
   maxZomm: 9
 };
 // magnification with which the map will start
 const zoom = 9;
 // co-ordinates
 const lat = 49.658904;
 const lon = 0.8243786;

 // calling map
 const map = L.map("map", config).setView([lat, lon], zoom);
 
 // Used to load and display tile layers on the map
 // Most tile servers require attribution, which you can set under `Layer`
 L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
   attribution:'Données des CPAM 76'
 }).addTo(map);

 function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
  for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
          return i;
      }
  }
  return null;
}

 function functiontofindIndexByKey(arraytosearch, key) {
  for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key]) {
          return i;
      }
  }
  return null;
}

function legend_for_choropleth_layer(layer, name, units, id) {
  // Generate a HTML legend for a Leaflet layer created using choropleth.js
  //
  // Arguments:
  // layer: The leaflet Layer object referring to the layer - must be a layer using
  //        choropleth.js
  // name: The name to display in the layer control (will be displayed above the legend, and next
  //       to the checkbox
  // units: A suffix to put after each numerical range in the layer - for example to specify the
  //        units of the values - but could be used for other purposes)
  // id: The id to give the <ul> element that is used to create the legend. Useful to allow the legend
  //     to be shown/hidden programmatically
  //
  // Returns:
  // The HTML ready to be used in the specification of the layers control
  var limits = layer.options.limits;
  var colors = layer.options.colors;
  var labels = [];

  // Start with just the name that you want displayed in the layer selector
  var HTML = name

  // For each limit value, create a string of the form 'X-Y'
  limits.forEach(function (limit, index) {
      if (index === 0) {
          var to = parseFloat(limits[index]).toFixed(0);
          var range_str = "< " + to;
      }
      else {
          var from = parseFloat(limits[index - 1]).toFixed(0);
          var to = parseFloat(limits[index]).toFixed(0);
          var range_str = from + "-" + to;
      }

      // Put together a <li> element with the relevant classes, and the right colour and text
      labels.push('<li class="sublegend-item"><div class="sublegend-color" style="background-color: ' +
          colors[index] + '">Â </div>Â ' + range_str + units + '</li>');
  })

  // Put all the <li> elements together in a <ul> element
  HTML += '<ul id="' + id + '" class="sublegend">' + labels.join('') + '</ul>';

  return HTML;
}

// Fetch GeoJSON and data to join to it
$.when(
  $.getJSON('https://raw.githubusercontent.com/julien76310/GEOJSON/main/CARTE76_EPCI.geojson'),
  $.getJSON('/RA2022/geodata_files/JSON/DATA_C2S_V2.json')
  ).done(function (responseGeojson, responseData) {
    var data = responseData[0]
    var geojson = responseGeojson[0]
    //console.log(data)
    var index_detailsData = functiontofindIndexByKey(data, "NOM_DATA");
    var titre_map = data[index_detailsData]["NOM_DATA"];
    var date_map = data[index_detailsData]["DATE_DATA"];
    var taux_departement = data[index_detailsData]["TAUX_DEPARTEMENT"];
    var taux_titre = data[index_detailsData]["TAUX_BENEF_TITRE"];
    var pop_titre = data[index_detailsData]["NB_BENEF_TITRE"];
    const elem = document.getElementById("titre");
    elem.innerHTML = titre_map ;
    console.log(titre_map+' - '+date_map+' - '+taux_departement);
    
    const elem2 = document.getElementById("reference");
    elem2.innerHTML = '<strong>Référence pour le département :'+taux_departement +'J</strong>';
    // Create hash table for easy reference
    // Add value from hash table to geojson properties
    geojson.features.forEach(function (item) {
      var index = functiontofindIndexByKeyValue(data, 'CODE_EPCI', item.id);
      //console.log(data[index]["TAUX_BENEF"]);
      item.properties.type = data[index]["TYPE_EPCI"];
      item.properties.pourcent = parseFloat(data[index]["TAUX_BENEF"]);
      item.properties.concern = parseInt(data[index]["NB_BENEF"]);
    })

    var choroplethLayer = L.choropleth(geojson, {
      valueProperty: 'pourcent',
      scale: ["#FFF38D","#ff9966","#CA4833"],
      steps: 5,
      mode: 'q',
      style: {
        color: '#fff',
        weight: 2,
        fillOpacity: 0.8
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.NOM_EPCI+ '</h3> '+taux_titre+': <strong>' + feature.properties.pourcent+ ' J</strong>'+'<br> '+pop_titre+' : <strong>' + feature.properties.concern+ ' </strong><hr> <small>CODE EPCI : '+feature.id+' / TYPE : '+feature.properties.type+'</small>')
      }
    }).addTo(map)
   
    // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethLayer.options.limits
    var colors = choroplethLayer.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + ' %</div> \
			<div class="max">' + limits[limits.length - 1] + ' %</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map)
  })
