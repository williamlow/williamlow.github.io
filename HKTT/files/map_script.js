

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
$('.right-half').on('click', '#myBtn', function () {
     modal.style.display = "block";
	 popCorrectionForm();
	 $(".modal-content").scrollTop(0);
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.getElementById("correctionMapContainer").innerHTML = '<div id="correctionMap"></div>';
  document.getElementById("correctionForm").reset();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
	document.getElementById("correctionMapContainer").innerHTML = '<div id="correctionMap"></div>';
	document.getElementById("correctionForm").reset();
  }
}

var correctionMap

function getCorrectionMap() {
var correctionMap = L.map('correctionMap').setView([e_current.lat, e_current.long], 14);

L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://stamen.com">Stamen Design</a>'
    }).addTo(correctionMap);


var oldMarker = L.marker([e_current.lat, e_current.long], {icon: correctionIcon}).addTo(correctionMap);
oldMarker.bindPopup("<b>Current location</b>").openPopup();

var newLocationPopup = L.popup();

function onMapClick(e) {
    newLocationPopup
        .setLatLng(e.latlng)
        .setContent("New location")
        .openOn(correctionMap);
	document.querySelector('[name="new_coords"]').value = e.latlng.toString().replace(/[^\d,.\s]/g, '');
}

correctionMap.on('click', onMapClick);
}



function popCorrectionForm () {
document.querySelector('[name="orig_loc_name"]').value = e_current.name;
document.querySelector('[name="orig_old_date"]').value = e_current.old_date;
document.querySelector('[name="orig_coords"]').value = e_current.lat+', '+e_current.long;
correctionPhoto.innerHTML = ('<img src="../files/photos/' + e_current.filename + '" alt="Trying to load image..."/>');
getCorrectionMap();
}


function showButtons() {
    $(".hiddenbutton").css({ "visibility": "visible"});
	};
 

//icons
var doneIcon = L.icon({
    iconUrl: '../files/circle_tick.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
});

var freshIcon = L.icon({
    iconUrl: '../files/circle_red_fix.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
});

var correctionIcon = L.icon({
    iconUrl: '../files/circle_red.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
});

  // initialize the map
  var map = L.map('map').setView([22.293701, 114.172459], 14);

  // load a tile layer
  //get a more interesting basemap
L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://stamen.com">Stamen Design</a>'
    }).addTo(map);

var e_current
var currentPhoto = 0;
var layers = {};

//this one closes all popups using a leaflet function, iterating over each layer
function closeAllPopups() {
map.eachLayer(function (layer) {
  layer.closePopup();
});}

//this one is more of a hack, which finds the close button on the prior popup and manually clicks it (seems dangerous, but works)
function closePriorPopup() {
$(".leaflet-popup-close-button")[0].click();
}

// Popup window function
	function basicPopup(url) {
popupWindow = window.open(url,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
	}
	
function onEachFeature(feature, layer) {
    layer.bindPopup('<b>Location: </b>' + feature.properties.name + '<br>' + '<b>Original photo date:</b> ' + feature.properties.old_date + '<br>' + '<b>New photo date:</b> ' + feature.properties.new_date+'<br> <div style="text-align:center;"><button id="myBtn">Submit correction</button></div>',{autoClose: false,closeOnClick:true, autoPan: false});
	layer.on(
        "click",function(e){
		e_current= e.target.feature.properties;
		showButtons();
		closeAllPopups();
		layer.setIcon(doneIcon);
		getName(e);
		currentPhoto = parseInt(layer.feature.properties.fid,10);
		layer.openPopup();
		centreOnPopup(e);
    });
                layer.on('mouseover', function() { layer.openPopup(); });
                layer.on('mouseout', function() { 
				if (parseInt(layer.feature.properties.fid,10) !== currentPhoto) {
				layer.closePopup();} });
//	layer.on("mouseover",function(e){
//                layer.setIcon(redIcon)
//    });
//    layer.on("mouseout",function(e){
//                layer.setIcon(blackIcon)
//    });
	layers[feature.properties.fid] = layer;
}

// call from outside map
function highlightFeature(fid){
    layers[fid].fireEvent('click');
}

function clickOnMapItem(itemId) {
    var id = parseInt(itemId);
    //get target layer by it's id
    var layer = geojson.getLayer(id);
    //fire event 'click' on target layer 
    layer.fireEvent('click');
	layer.openpopup();
}

$('#prev').click(function() {
    try {highlightFeature(currentPhoto-1);}
	catch (err){highlightFeature(1032);}
});

$('#next').click(function() {
    try {highlightFeature(currentPhoto+1);}
	catch (err){highlightFeature(1);}
});

$('#random').click(function() {
	highlightFeature(Math.floor((Math.random() * 1032) + 1));
	});

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
		try {highlightFeature(currentPhoto-1);}
		catch (err){highlightFeature(1032);}
        break;

        case 39: // right
		try {highlightFeature(currentPhoto+1);}
		catch (err){highlightFeature(1);}
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


function getName(e) {
		//info.update is a function used to populate an external div
		info.update(e.target.feature.properties);
		document.getElementById("introText").innerHTML = '';
}

markerMap = {}; // a global variable unless you extend L.GeoJSON
	
//ok this has three parts - it initialises with calling the geojson, then contains the icon stuff, and also calls Get Each Feature, which is external
var geojson = L.geoJson(hkpoints, {


//the pointToLayerfunction gives the icon
pointToLayer: function (feature, latlng) {
		var marker = L.marker(latlng, {icon: freshIcon});
		//markerMap[feature.properties.fid] = marker;
		return marker; 
        },
//and this adds the info
onEachFeature: onEachFeature}).addTo(map);
 
 
 //
var info = L.control();

info.onAdd = function (map) {
    this.info = L.DomUtil.get("infobox"); // get div...?
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this.info.innerHTML = (props ?
		'<img src="../files/photos/' + props.filename + '" alt="Trying to load image..."/>'
		: ''
);
};

//could use something like this as a fix for the autopan issue
centreOnPopup = function (e) {
		var popup_from_click = e.target.getPopup();
		var px = map.project(popup_from_click._latlng); // find the pixel location on the map where the popup anchor is
		px.y -= popup_from_click._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
		map.panTo(map.unproject(px),{animate: true}); // pan to new center
		}
		

info.addTo(map);
