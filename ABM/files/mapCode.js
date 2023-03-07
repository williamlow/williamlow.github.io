	const map = L.map('map').setView([11.769869596125355, 13.305704701640476], 8);
	
	//NE: 11.769869596125355, 13.305704701640476
	//all Nigeria: 9.97967,9.06372], 7);

	<!-- const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { -->
		<!-- maxZoom: 19, -->
		<!-- attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' -->
	<!-- }).addTo(map); -->

<!-- var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { -->
	<!-- attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', -->
	<!-- subdomains: 'abcd', -->
	<!-- maxZoom: 20 -->
<!-- }).addTo(map); -->

    const accessToken = 'U6QI4wv2b3SRlAE7AMATOVUAAQ9Ne7kXT5nVZdJy4R0nWMiG7Do0yw3Jpsxhsv5N';
	
    L.tileLayer(
      `https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=${accessToken}`, {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
        maxZoom: 22
      }
    ).addTo(map);

//style for points

////scale  for colour
function locColor(d) {
    return d > 60000   ? '#a50f15' :
           d > 30000   ? '#de2d26' :
           d > 15000   ? '#fb6a4a' :
           d > 5000   ? '#fc9272' :
           d > 1000   ? '#fcbba1' :
                      '#fee5d9';
}

////scale for radius
function locRadius(d) {
    return d > 60000 ? 50 :
           d > 30000   ? 20 :
           d > 15000   ? 15 :
           d > 5000   ? 10 :
           d > 1000   ? 6 :
                      4;
}

////called by circlemarker when locs added to map
function locs_style(feature) {
	return {
    radius: locRadius(feature.properties.end_total),
    fillColor: locColor(feature.properties.end_total),
    color: "#000",
    weight: 0,
    opacity: 1,
    fillOpacity: 0.9
};
}


//style for lines

////scale for colour
function lineColor(d) {
    return d > 15000  ? '#08519c' :
           d > 6000   ? '#3182bd' :
           d > 3500   ? '#6baed6' :
           d > 1500   ? '#bdd7e7' :
                      '#eff3ff';
}

////scale for width
function linewidth(d) {
    return d > 15000  ? 10 :
           d > 6000  ? 9 :
           d > 3500   ? 6 :
           d > 1500   ? 4 :
                      2;
}

////called by style when links added to map
function links_style(feature) {
    return {
        fillColor: '#800026',
        weight: linewidth(feature.properties.total),
        opacity: 1,
        color: lineColor(feature.properties.total),
//        dashArray: '3',
        fillOpacity: 1
    };
}


//location interaction

////called by mouseover locs
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

////custom version of oneachfeature as call different functions for locs and links, adds listeners for interactions
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


//link interaction

function highlightLink(e) {
    var layer = e.target;

    layer.setStyle({
        color: '#ceb806',
    });
    //layer.bringToFront();
	info.updateLink(layer.feature.properties);
}

function resetLink(e) {
    links_gj.resetStyle(e.target);
	info.updateLink();
}

function onEachLink(feature, layer) {
    layer.on({
        mouseover: highlightLink,
        mouseout: resetLink,
    });
}

//set inital value for smoothing
var smoothFactor = 50;

//function for toggling simple routes
//removes link layer, alters smoothFactor value, respawns links
//could make more efficient with function to spawn links_gj, passing smoothFactor as argument
//would need to define links_gj outside function first so it persists outside it
function toggleSimple() {
if (smoothFactor == 50) {
map.removeLayer(links_gj);
smoothFactor = 1;

links_gj = L.geoJSON(links, {
	smoothFactor: smoothFactor,
	onEachFeature: onEachLink,
	style: function (feature) {
	return links_style(feature)}}
	).addTo(map);
//spawns at front, so send back
links_gj.bringToBack();

} else {
map.removeLayer(links_gj);
smoothFactor = 50;

links_gj = L.geoJSON(links, {
	smoothFactor: smoothFactor,
	onEachFeature: onEachLink,
	style: function (feature) {
	return links_style(feature)}}
	).addTo(map);

links_gj.bringToBack();
}}


//add links and locs to map

////changed to var as remove and respawn due to simple routes toggle - check if neccesary
var links_gj = L.geoJSON(links, {
	smoothFactor: smoothFactor,
	onEachFeature: onEachLink,
	style: function (feature) {
	return links_style(feature)}}
	).addTo(map);
	
	
const locs_gj = L.geoJSON(locs, {
	onEachFeature: onEachLoc,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, locs_style(feature));
    }}
	).addTo(map);


//info box

var info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info readout'); // create a div with a class "info"
    this.updateLoc();
    return this._div;
};

////function to update the control based on feature properties passed
////seperate functions for links and locs, but both reset to same
////could make single function that checks whether link or loc is calling it
////.toLocaleString() gives number formatting
info.updateLoc = function (props) {
    this._div.innerHTML = (props ?
        '<h5>' + props.full_name + '</h5>' +
		'<p><span class="all"><b>' + props.end_total.toLocaleString() + '</b> displaced people at the end of the simulation</span>' +
		'</br><span class="u18"><b>' + props.end_under18.toLocaleString() + '</b> under 18</span>  |  ' +
		'<span class="u5"><b>' + props.end_under5.toLocaleString() + '</b> under 5</span>' +
		'</br><span class="female"><b>' + props.end_female.toLocaleString() + '</b> female</span>  |  ' +
		'<span class="male"><b>' + props.end_male.toLocaleString() + '</b> male</span></p>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="locations/Overall/' + props.name + '.png"><figcaption>Displaced people at location per day</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="locations/Age/' + props.name + '.png"><figcaption>% share by age</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="locations/Gender/' + props.name + '.png"><figcaption>% share by sex</figcaption></figure></div>' 
        : '<span id="readoutDefault">Hover over a location or route</span>');
};

info.updateLink = function (props) {
    this._div.innerHTML = (props ?
        '<h5>' + props.full_name + '</h5>' +
		'<p><span class="all"><b>' + props.total.toLocaleString() +'</b> agents used this route during the simulation</span>' +
		'</br><span class="u18"><b>' + props.under18.toLocaleString() + '</b> under 18</span>  |  ' +
		'<span class="u5"><b>' + props.under5.toLocaleString() + '</b> under 5</span>' +
		'</br><span class="female"><b>' + props.female.toLocaleString() + '</b> female</span>  |  ' +
		'<span class="male"><b>' + props.male.toLocaleString() + '</b> male</span></p>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="routes/Overall/' + props.name + '.png"><figcaption>Displaced people on route per day</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="routes/Age/' + props.name + '.png"><figcaption>% share by age</figcaption></figure></div>' +
				'<div class="imagecaption"><figure><img class="infoGraph" src="routes/Gender/' + props.name + '.png"><figcaption>% share by sex</figcaption></figure></div>' 
        : '<span id="readoutDefault">Hover over a location or route</span>');
};

info.addTo(map);

//legends
//taken from leaflet chloro example


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


///Links

var legend_links = L.control({position: 'bottomleft'});

legend_links.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1500, 3500, 6000, 15000],
        labels = [];

	div.innerHTML = '<h4>Displaced people</br>on routes</h4>';
    // loop through our density intervals and generate a label with a colored square for each interval
    
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + lineColor(grades[i] + 1) + '"></i> ' +
            grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
    }

    return div;
};

legend_links.addTo(map);