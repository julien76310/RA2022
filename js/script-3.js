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
      if (arraytosearch[i]['ID_ETAB'] == id) {
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
   minZoom: 10,
   maxZomm: 10
 };
 // magnification with which the map will start
 const zoom = 10;
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
  $.getJSON('https://raw.githubusercontent.com/julien76310/GEOJSON/main/CARTE76_ETAB.json'),
  $.getJSON('https://raw.githubusercontent.com/julien76310/GEOJSON/main/DATA_ETAB.json')
  ).done(function (responseGeojson, responseData) {
    var data = responseData[0];
    var geojson = responseGeojson[0];
    console.log(data);
    console.log(geojson);

    for (let i = 0; i < geojson.length; i++) {
      //console.log(geojson[i]["MARKER"]);
      const position_marker = geojson[i]["MARKER"].split(','); 
      const id_etab = geojson[i]["ID_ETAB"];
      //console.log(position_marker);
      var index_data = functiontofindIndexByKeyValue(data, 'ID_ETAB', id_etab);
      var prado_status = new Array();
      if(functiontofindPradoTrue(data, id_etab, "IC")) {
        prado_status.push("IC");
      }
      if(functiontofindPradoTrue(data, id_etab, "AVC")) {
        prado_status.push("AVC");
      }
      if(functiontofindPradoTrue(data, id_etab, "BPCO")) {
        prado_status.push("BPCO");
      }
      if(functiontofindPradoTrue(data, id_etab, "SENIOR")) {
        prado_status.push("AVC");
      }
      if(functiontofindPradoTrue(data, id_etab, "COVID")) {
        prado_status.push("COVID");
      }
      if(functiontofindPradoTrue(data, id_etab, "CHIRURGIE")) {
        prado_status.push("CHIRURGIE");
      }
      if(functiontofindPradoTrue(data, id_etab, "SSR")) {
        prado_status.push("SSR");
      }
      if(functiontofindPradoTrue(data, id_etab, "MATERNITE")) {
        prado_status.push("MATERNITE");
      }
      
      console.log(prado_status); 
      var IC_status = functiontofindPradoTrue(data, id_etab, "IC"); 
      var marker = L.marker(
        position_marker,
        { icon: L.icon({
          iconUrl: 'pictos/etba_picto-'+data[index_data]["COULEUR"]+'.svg',
          iconSize:     [40, 40], // size of the icon
        }),
          draggable: true,
          title: "",
          opacity: 0.9
      }).bindPopup("<p1><h3>"+geojson[i]["NOM_ETAB"]+" <img src='pictos/etba_picto-"+data[index_data]["COULEUR"]+".svg' height='20px' width='20px'></h3><h4>Inscrit dans "+prado_status.length+" dispositif(s) PRADO : </h4>"+prado_status.toString().replaceAll(',','<br>')+"<br><hr><p>"+data[index_data]["ADRESSE_ETAB"]+"</p>").addTo(map);
       }

       var index_detailsData = functiontofindIndexByKey(data, "NOM_DATA");
       var titre_map = data[index_detailsData]["NOM_DATA"];
       var date_map = data[index_detailsData]["DATE_DATA"];
       var taux_departement = data.length;
       document.title = titre_map+' - '+date_map ;
       const elem = document.getElementById("new-parent");
       elem.innerHTML = titre_map+'<strong>'+taux_departement +' établissements hospitaliers</strong> en Seine-Maritime'+" - "+date_map;
 
  });
