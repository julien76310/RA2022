/**
 * Fetches a geojson file as well as a data file and joins them before passing to L.choropleth
**/
function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
  for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
          return i;
      }
  }
  return null;
}

function functiontofindPradoTrue(arraytosearch, id, namePrado) {
  for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i]['ID_ACCUEIL'] == id) {
          return arraytosearch[i][namePrado];
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
// config map
 let config = {
   minZoom: 9,
   maxZomm: 11
 };
 // magnification with which the map will start
 const zoom = 9;
 // co-ordinates 
 const lat = 49.6070158; 
 const lon = 0.7839116;

 // calling map
 const map = L.map("map", config).setView([lat, lon], zoom);

 // Used to load and display tile layers on the map
 // Most tile servers require attribution, which you can set under `Layer`
 L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
   attribution:'Données des CPAM 76'
 }).addTo(map);

 

$.when(
  $.getJSON('https://raw.githubusercontent.com/julien76310/RA2022/main/geodata_files/CARTE76_ACCUEIL.json'),
  $.getJSON('https://raw.githubusercontent.com/julien76310/RA2022/main/geodata_files/JSON/DATA_ACCUEIL.json')
  ).done(function (responseGeojson, responseData) {
    var data = responseData[0];
    var geojson = responseGeojson[0];
    console.log(data);
    console.log(geojson);

    for (let i = 0; i < geojson.length; i++) {
      //console.log(geojson[i]["MARKER"]);
      const position_marker = geojson[i]["MARKER"].split(','); 
      const id_ACCUEIL = geojson[i]["ID_ACCUEIL"];
      //console.log(position_marker);
      var index_data = functiontofindIndexByKeyValue(data, 'ID_ACCUEIL', id_ACCUEIL);
     
      var marker = L.marker(
        position_marker,
        { icon: L.icon({
          iconUrl: 'pictos/Accueil-'+data[index_data]["TYPE"]+'.png',
          iconSize:     [25, 25], // size of the icon
        }),
          draggable: true,
          title: "",
          opacity: 0.9
      }).bindPopup("<p1><h3>"+geojson[i]["NOM_ACCUEIL"]+" <img src='pictos/Accueil-"+data[index_data]["TYPE"]+".png' height='20px' width='20px'></h3><hr><h4>Type : "+data[index_data]["TYPE"]+"</h4><p>"+data[index_data]["ADRESSE_ETAB"]+"</p>").addTo(map);
       }

       var index_detailsData = functiontofindIndexByKey(data, "NOM_DATA");
       var titre_map = data[index_detailsData]["NOM_DATA"];
       var date_map = data[index_detailsData]["DATE_DATA"];
       var taux_departement = data.length-1;
       const elem = document.getElementById("titre");
       elem.innerHTML = titre_map;
       const elem2 = document.getElementById("reference");
       elem2.innerHTML = '<strong>'+taux_departement +' accueils Assurance Maladie</strong> en Seine-Maritime'+" - "+date_map;
 
  });
