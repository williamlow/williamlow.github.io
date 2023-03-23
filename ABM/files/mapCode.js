	const map = L.map('map').setView([11.769869596125355, 13.305704701640476], 8);
	
	//NE: 11.769869596125355, 13.305704701640476
	//all Nigeria: 9.97967,9.06372], 7);



    const accessToken = 'U6QI4wv2b3SRlAE7AMATOVUAAQ9Ne7kXT5nVZdJy4R0nWMiG7Do0yw3Jpsxhsv5N';
	
    L.tileLayer(
      `https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=${accessToken}`, {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
        maxZoom: 22
      }
    ).addTo(map);

		
///Styling links
//scale for width
//currently done by eye for best visual results - will need to automate
function linewidth(d) {
    return d > 15000  ? 18 :
           d > 6000  ? 12 :
           d > 3500   ? 7 :
           d > 1500   ? 5 :
                      4;
}
	
//Link mouseover functionality
	
//track the highlighted link for use in mouseout
var activeLink 

//combine these with an if - its just the info update
function highlightPrimLink(e) {
    var layer = e.target;
    layer.setStyle({
        color: '#ceb806'
    });
	activeLink = layer;
    <!-- //layer.bringToFront(); -->
	info.updatePrimLink(layer.feature.properties);
}

function highlightSecLink(e) {
    var layer = e.target;
    layer.setStyle({
        color: '#ceb806'
    });
	activeLink = layer;
    <!-- //layer.bringToFront(); -->
	info.updateSecLink(layer.feature.properties);
}

//Due to the transition to polyline, these functions can't use L.geojson's resetstyle, which means it's also harder to target the link on mouseout, hence use of activeLink variable

function resetPrim(e) {
    
	if (activeLink) {
	activeLink.setStyle({
        color: '#3182bd'
    });
	}
	info.updatePrimLink();
}

function resetSec(e) {
    
	if (activeLink) {
	activeLink.setStyle({
        color: '#d95f0e'
    });
	}
	//antPathsPrimary.resetStyle(e.target);
	info.updateSecLink();
}


////Adding link data

//variable for each part of links
var outlines = L.layerGroup();
var lineBgs = L.layerGroup();
var antPathsPrimary = L.layerGroup();
var antPathsSecondary = L.layerGroup();

//polylineOffset struggles with smoothFactor (and I believe complex lines in general, but leaving here for easy manipulation later
var smoothFactor = 0

//building link polylines from geojson - sadly antpath doesn't work with native geojson layers
	var links_gj = L.geoJSON(links, {
	
	
	onEachFeature: function (feature, layer) {
 
		 var latlng = feature.geometry.coordinates[0];
		 var size = feature.geometry.coordinates[0].length;
         var buffer;
		 
                    
		//reversing the order of latitude and longitude in the array because a L.latLng object needs the latitude first and json is the reverse
			for (i=0;i<size;i++)
			{
			buffer = latlng[i][0];
			latlng[i][0] = latlng[i][1];
			latlng[i][1] = buffer;
			}
					
			//calculates the size of the links and, based on those values, of the outline and background around them
			var primaryWidth = linewidth(feature.properties.pri_total);
			var secondaryWidth = linewidth(feature.properties.sec_total);
			var secondaryOffset = (primaryWidth/2) + 2 + (secondaryWidth/2);
			var lineBgWidth = primaryWidth + secondaryWidth + 2 + 2 + 2;
			var outlineWidth = lineBgWidth + 2;
			var outlineAndBgOffset = (secondaryWidth/2) + 1;
			
			
			//establishing whether the antpath should be reversed
			var priReverse = false;
			var secReverse = true;
			
			if (feature.properties.pri_name !== feature.properties.ref_name) {
				priReverse = true;
				secReverse = false;
			}

						//use polylineOffset plugin to base all lines on the primary link

                                var polylineOutline = L.polyline(latlng, {            	
																					offset: outlineAndBgOffset,
																					color: 'black',
																					weight: outlineWidth,
																					opacity: 1,
																					smoothFactor: smoothFactor　
																				}).addTo(outlines);
																				
                                var polylineLineBg = L.polyline(latlng, {            	
																					offset: outlineAndBgOffset,
																					color: 'white',
																					weight: lineBgWidth,
																					opacity: 1,
																					smoothFactor: smoothFactor　
																				}).addTo(lineBgs);
 
								//var polylinePrimary = L.polyline(latlng,{color: 'blue',opacity: 1}).addTo(map);
								var polylineAntPrimary = L.polyline.antPath(latlng, {
																					"paused": false,   　　
																					"reverse": priReverse,　　
																					"delay": 2500,　　　　
																					"dashArray": [5, 100],　
																					"weight": primaryWidth,　　　　
																					"opacity": 1,　　
																					"color": "#3182bd",　
																					"pulseColor": "#9ecae1",
																					smoothFactor: smoothFactor,
																				});											
								//manually adding feature data (eg.properties for use in tooltips)
								polylineAntPrimary.feature = feature;
								polylineAntPrimary.addTo(antPathsPrimary);
													
								//putting the listener here because to have a single listener for the whole group we would need to make it a featuregroup and my manually added feature data will be stripped out
								//performance shouldn't be too much of a concern
								//could maybe convert it back into a geoJSON and handle without featuregroup?
								//links_gj is still here, so could refer to it another way - perhaps add a custom option value as these persist the shift to featuregroup
								polylineAntPrimary.on({
									mouseover: highlightPrimLink,
									mouseout: resetPrim,
								});
								
										

                                var polylineAntSecondary = L.polyline.antPath(latlng, {
																					offset: secondaryOffset,
																					"paused": false,   　　
																					"reverse": secReverse,　　
																					"delay": 2500,　　　　
																					"dashArray": [5, 100],　
																					"weight": secondaryWidth,　　　　
																					"opacity": 1,　　
																					"color": "#d95f0e",　
																					"pulseColor": "#fec44f",
																					smoothFactor: smoothFactor,
																					pane: 'antPane'　
																				});
								
								polylineAntSecondary.feature = feature;
								polylineAntSecondary.addTo(antPathsSecondary);
								
								polylineAntSecondary.on({
									mouseover: highlightSecLink,
									mouseout: resetSec,
								});

				}
 
				});


//adding all links to map

outlines.addTo(map);
lineBgs.addTo(map);
antPathsPrimary.addTo(map);
antPathsSecondary.addTo(map);


////style for points

//scale  for colour
function locColor(d) {
    return d > 60000   ? '#a50f15' :
           d > 30000   ? '#de2d26' :
           d > 15000   ? '#fb6a4a' :
           d > 5000   ? '#fc9272' :
           d > 1000   ? '#fcbba1' :
                      '#fee5d9';
}

//scale for radius
//currently done by eye for best visual results - will need to automate
function locRadius(d) {
    return d > 60000 ? 50 :
           d > 30000   ? 30 :
           d > 15000   ? 25 :
           d > 5000   ? 20 :
           d > 1000   ? 10 :
                      10;
}

////called by circlemarker when locs added to map
function locs_style(feature) {
	return {
    radius: locRadius(feature.properties.end_total),
    fillColor: locColor(feature.properties.end_total),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
};
}

////location interaction

//called by mouseover locs
function highlightLoc(e) {
    var layer = e.target;
	
    layer.setStyle({
        weight: 5,
        color: '#ceb806',
    });

    //layer.bringToFront();
	
	////sends props to info box
	info.updateLoc(layer.feature.properties);
}


////reset style when mouseout
function resetLoc(e) {
    locs_gj.resetStyle(e.target);
	info.updateLoc();
}

////custom version of oneachfeature as call different functions for locs, adds listeners for interactions
function onEachLoc(feature, layer) {
    layer.on({
        mouseover: highlightLoc,
        mouseout: resetLoc,
    });
	////adding text labels
	layer.bindTooltip(
    feature.properties.full_name,
    {
        permanent:true,
        direction:'bottom',
        className: 'locLabel'
    }
);
}

//Adding locs to map

const locs_gj = L.geoJSON(locs, {
	pane: 'locPane',
	onEachFeature: onEachLoc,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, locs_style(feature));
    }}
	);

//we send the location circlemarkers to a new pane, otherwise they get stuck behind the antpaths (some bug in the antpath plugin I think)
//649 puts it just behind labels
map.createPane('locPane');
map.getPane('locPane').style.zIndex = "649";
const locOptions = { renderer: L.svg({pane: "locPane"}) };
locs_gj.setStyle(locOptions);
locs_gj.addTo(map);


////info box

var info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info readout'); // create a div with a class "info"
    this.updateLoc();
    return this._div;
};

//function to update the control based on feature properties passed
//seperate functions for links and locs, but both reset to same
//could make single function that checks whether link or loc is calling it
//.toLocaleString() gives number formatting
info.updateLoc = function (props) {
    this._div.innerHTML = (props ?
        '<h5>' + props.full_name + '</h5>' +
		'<p><span class="all"><b>' + props.end_total.toLocaleString() + '</b> displaced people at the end of the simulation</span>' +
		'</br><span class="u18"><b>' + props.end_under18.toLocaleString() + '</b> under 18</span>  |  ' +
		'<span class="u5"><b>' + props.end_under5.toLocaleString() + '</b> under 5</span>' +
		'</br><span class="female"><b>' + props.end_female.toLocaleString() + '</b> female</span>  |  ' +
		'<span class="male"><b>' + props.end_male.toLocaleString() + '</b> male</span></p>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Locations/Overall/' + props.name + '.png"><figcaption>Displaced people at location per day</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Locations/Age/' + props.name + '.png"><figcaption>% share by age</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Locations/Gender/' + props.name + '.png"><figcaption>% share by sex</figcaption></figure></div>' 
        : '<span id="readoutDefault">Hover over a location or route</span>');
};

info.updatePrimLink = function (props) {
    this._div.innerHTML = (props ?
        '<h5>' + props.pri_fullname + '</h5>' +
		'<p><span class="all"><b>' + props.pri_total.toLocaleString() +'</b> displaced people used this route during the simulation</span>' +
		'</br><span class="u18"><b>' + props.pri_under18.toLocaleString() + '</b> under 18</span>  |  ' +
		'<span class="u5"><b>' + props.pri_under5.toLocaleString() + '</b> under 5</span>' +
		'</br><span class="female"><b>' + props.pri_female.toLocaleString() + '</b> female</span>  |  ' +
		'<span class="male"><b>' + props.pri_male.toLocaleString() + '</b> male</span></p>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Overall/' + props.pri_name + '.png"><figcaption>Displaced people on route per day</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Age/' + props.pri_name + '.png"><figcaption>% share by age</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Gender/' + props.pri_name + '.png"><figcaption>% share by sex</figcaption></figure></div>' 
        : '<span id="readoutDefault">Hover over a location or route</span>');
};

info.updateSecLink = function (props) {
    this._div.innerHTML = (props ?
        '<h5>' + props.sec_fullname + '</h5>' +
		'<p><span class="all"><b>' + props.sec_total.toLocaleString() +'</b> displaced people used this route during the simulation</span>' +
		'</br><span class="u18"><b>' + props.sec_under18.toLocaleString() + '</b> under 18</span>  |  ' +
		'<span class="u5"><b>' + props.sec_under5.toLocaleString() + '</b> under 5</span>' +
		'</br><span class="female"><b>' + props.sec_female.toLocaleString() + '</b> female</span>  |  ' +
		'<span class="male"><b>' + props.sec_male.toLocaleString() + '</b> male</span></p>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Overall/' + props.sec_name + '.png"><figcaption>Displaced people on route per day</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Age/' + props.sec_name + '.png"><figcaption>% share by age</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="Routes/Gender/' + props.sec_name + '.png"><figcaption>% share by sex</figcaption></figure></div>' 
        : '<span id="readoutDefault">Hover over a location or route</span>');
};

info.addTo(map);


////locations

var legend_locs = L.control({position: 'bottomleft'});

legend_locs.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000, 5000, 15000, 30000, 60000],
        labels = [];

	div.innerHTML = '<h4>Displaced people</br>at locations</h4>';
    // loop through our intervals and generate a label with a colored square for each interval
	// added .toLocaleString() to give formatted numbers
    
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + locColor(grades[i] + 1) + '"></i> ' +
            grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
    }

    return div;
};

legend_locs.addTo(map);


