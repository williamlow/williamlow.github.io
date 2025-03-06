/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Map mechanics    /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


//I think .fitBounds() can be used with manually set bounds to get the zoom levle right from the start and avoid a jerky change in zoom on spawn
const map = L.map('map', {attributionControl: false, zoomSnap: 0.5}).setView([-12.479487125908548, 39.3206], 8);

// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);



// Define the map adjustment function
function adjustMapZoom() {
    map.fitBounds(admin2Map.getBounds());
}

// Use jQuery to attach the resize event listener
$(window).on('resize', function() {
    adjustMapZoom();
});

// Detect maximize/restore actions with size tracking
let previousSize = { width: $(window).width(), height: $(window).height() };

setInterval(() => {
    const currentSize = { width: $(window).width(), height: $(window).height() };
    if (currentSize.width !== previousSize.width || currentSize.height !== previousSize.height) {
        adjustMapZoom();
        previousSize = currentSize;
    }
}, 250);





var gridMap = L.geoJson(grid_data, {style: styleGrid, onEachFeature: onEachGridSq}).addTo(map);

var admin2Map = L.geoJson(admin2_data, {style: styleAdmin2, onEachFeature: onEachAdmin2}).addTo(map);

map.fitBounds(admin2Map.getBounds());

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);


var OpenStreetMap_CAT = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
})


//[removing links functionality]
//var linksMap = L.geoJson(links_data, {style: hideLinks}).addTo(map);

//var admin2Labels = L.geoJson(admin2_labels, {style: hideLinks}).addTo(map);

var selectedPair = null;
var gridSelection
var origSelection = []

var testItem

function onEachGridSq(feature, layer) {

    //store layer reference for external interactions
    var gridSq = feature.properties.grid_id;
    var gridSqAdmin = feature.properties.ADM2_PT;

    gridLayers[gridSq] = layer; // Save layer reference

// Ensure the admin object exists before assigning
if (!gridLayersByAdmin[gridSqAdmin]) {
    gridLayersByAdmin[gridSqAdmin] = {};
}
    gridLayersByAdmin[gridSqAdmin][gridSq] = layer;
}


function onEachAdmin2(feature, layer) {
    //store layer reference for external interactions
    var admin2Name = feature.properties.ADM2_PT;
    admin2Layers[admin2Name] = layer; // Save layer reference

    layer.bindTooltip(feature.properties.ADM2_PT,
   {permanent: true, direction:"center"}
  ).openTooltip();


    layer.on({
        mouseover: highlightAdmin2,
        mouseout: resetHighlight,
        click: function(e) {
            selectAdmin2(e);
            L.DomEvent.stopPropagation(e); // This stops the event from propagating to the map
        }
        });
}

// Add a click event listener to the map
map.on('click', function(e) {
    fullReset()
});

// Assuming you already have your Leaflet map initialized as `map`
map.dragging.disable(); // Disable dragging
map.touchZoom.disable(); // Disable pinch-to-zoom on touch devices
map.doubleClickZoom.disable(); // Disable zooming by double-clicking
map.scrollWheelZoom.disable(); // Disable zooming with the scroll wheel
map.boxZoom.disable(); // Disable box zooming
map.keyboard.disable(); // Disable keyboard controls

// Optionally, prevent tap events on touch devices
if (map.tap) map.tap.disable();

// Disable attribution and zoom controls (optional)
map.removeControl(map.zoomControl);


////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   new styler        //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//duplicating here from map_sankey_interaction while working on it

//is the reset functionality used after the first option?
function updateLayerStyleNewEx(areaName, isRed, isBlue, isGrey, reset = false) {

    const layer = admin2Layers[areaName];
    if (!layer) return;

    if (reset) {
        // Reset style based on selected or unselected state
        if (currentProperties.length == 0) {
            //console.log("reset black")
            styleGridSelection(getGridSelection(areaName));
            layer.setStyle({ color: "black", weight: 2,  fillOpacity: 0 });
        }
        else if (currentProperties.includes(areaName)) {
            //console.log("reset red")
            layer.setStyle({ color: "darkred", weight: 2,  fillOpacity: 0 });
            styleGridSelection(getGridSelection(areaName));
        } else if (currentProperties.some(selected => getOrigsForDest(selected, "dest").includes(areaName))) {
            //console.log("reset blue")
            layer.setStyle({ color: "darkblue", weight: 2,  fillOpacity: 0 });
            unStyleGridSelection(getGridSelection(areaName));
        } else {
            //console.log("reset grey")
            layer.setStyle({ color: "grey", weight: 0, fillOpacity: 0.7 });
            //unStyleGridSelection(getGridSelection(areaName));
        }
    } else {
        // Apply specific styles
        if (isRed) {
            console.log("red "+areaName)
            layer.setStyle({ color: "darkred", weight: 2, fillOpacity: 0  });
            //testarea = getGridSelection(areaName);
            //console.log(testarea._layers)
            layer.bringToFront();
            styleGridSelection(getGridSelection(areaName));
        } else if (isBlue) {
            console.log("blue")
            layer.setStyle({ color: "darkblue", weight: 2, fillOpacity: 0 });
            layer.bringToFront();
            unStyleGridSelection(getGridSelection(areaName));
        } else if (isGrey) {
            //stlying to arrivals, will be visible under grey
            styleGridSelection(getGridSelection(areaName));
            layer.setStyle({ color: "grey", weight: 2, fillColor: "grey", fillOpacity: 0.7 });
            // No `bringToFront` for grey areas
        }
    }

}


/* function styleAdmin2LayersHover(hoveredAdmin) {

//get associated orig admins
var origAdms = getOrigsForDest(hoveredAdmin,"dest");
//first hover
if (currentProperties.length == 0) {
//set hoveredAdmin (grid already red)
//admin2Layers[hoveredAdmin].setStyle({ color: "darkred", weight: 2,  fillOpacity: 0 });
updateLayerStyleNew(hoveredAdmin, true, false, false);
//something is already selected
} else {
    //get list of current origs
    var currentOrigs = [];

    currentProperties.forEach(area => {
        var origAdms = getOrigsForDest(area,"dest");
        currentOrigs.push(...origAdms);            
            })

    //the hovered admin is a origin for existing selection
    if (currentOrigs.includes(hoveredAdmin)) {
        

    }



    //one of the existing selection is an origin for the hovered admin

    //the origins for the hovered admin overlap with those of an existing selection

    //there is a new origin for the hovered admin


//when done go back and add sankey origin hovering options
//can probably do a bunch of and or for each colouring option
}
} */

//suprised destAdm ended up redundant
function styleAdmin2LayersNewEx(destAdm, origAdms, areaType) {
    //console.log("styleAdmin2LayersNew starts")
    // Step 1: Grey out all unselected areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {

        const isGrey = !currentProperties.includes(areaName) &&
                        !currentProperties.some(selected => getOrigsForDest(selected, "dest").includes(areaName));
        if (isGrey) {
            //console.log("GREY: "+areaName);
            updateLayerStyleNew(areaName, false, false, true);
            // No `bringToFront` for grey areas
        }
    });

    // Step 2: Style blue areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isBlue = (origAdms.includes(areaName) && !currentProperties.includes(areaName));
        if (isBlue) {
            //console.log("BLUE: "+areaName);
            updateLayerStyleNew(areaName, false, true, false);
            layer.bringToFront(); // Ensure blue areas are above grey areas
        }
    });

    // Step 3: Style red areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isRed = (currentProperties.includes(areaName));
        if (isRed) {
            //console.log("RED: "+areaName);
            updateLayerStyleNew(areaName, true, false, false);
            layer.bringToFront(); // Ensure red areas are above both blue and grey areas
        }
    });
    //console.log("styleAdmin2LayersNew ends")
}


function getOrigsForDest(name, areaType, tempData) {
    //console.log("getting origs for "+name+" "+areaType)
    // Determine which data source to use
    //const dataSource = dataCollection;
    const dataSource = tempData ? tempData : dataCollection;



    // Initialize an empty list to store the results
    const connectedDests = [];

    // Iterate through the data source
    dataSource.forEach(record => {
        //console.log(name+" vs"+record.to)
        if (areaType === "orig" && record.from === name) {
            connectedDests.push(cleanName(record.to)); // Clean destination nodes for 'orig'
        } else if (areaType === "dest" && cleanName(record.to) === name) {
            connectedDests.push(cleanName(record.from)); // Clean origin nodes for 'dest'
        }
    });
    //console.log(connectedDests);
    return connectedDests;
}



function mapReturnToState() {



    var currentOrigs = [];

        currentProperties.forEach(area => {
            var origAdms = getOrigsForDest(area,"dest");
            currentOrigs.push(...origAdms);            
        }
        )

    let noSelection = currentProperties.length === 0 ? true : false;

    //for every adm, see if it's 
    for (area in admin2Layers) {
        //a) in currentProps
        if (currentProperties.includes(area)) {
        //set to arrivals
        updateLayerStyleNew(area, true, false, false);
        //b) in currentOrigs
        } else if (currentOrigs.includes(area)) {
        //set to depts
        //console.log(area)
        updateLayerStyleNew(area, false, true, false);
        //c) neither         
        } else {
        //set to arrivals and grey if there is anything selected
        //if not, set to arrivals and black
        updateLayerStyleNew(area, false, false, true, noSelection);
        }

}
}




//click
function selectAdmin2(e) {
    
    //admin2Map.resetStyle()
    
    var layer = e.target;
    var adm2 = layer.feature.properties.ADM2_PT

//selecting first admin2 area
    if (currentProperties.length == 0) {
        //console.log("first selection")
        massStyleClassifier (e, "click");
/*         updateTitle();
        updateSankeyAll();
        disaggCall () */
    } 

//unselecting the only selected admin
    else if (currentProperties.includes(e.target.feature.properties.ADM2_PT) && currentProperties.length == 1) {
        //console.log("Reseting")
        //fullReset()
        massStyleClassifier (e, "click");

    }

//removing an admin from the selection
//caome back to this after add
    else if (currentProperties.includes(adm2)) {
        massStyleClassifier (e, "click");
        //console.log("unselect")
 
/*     updateTitle();
    updateSankeyAll();
    disaggCall () */

    }


//adding admin to selection
    else {
        massStyleClassifier (e, "click");
   

    }

/* updateTitle();
updateSankeyAll();
disaggCall () */



    //}

//console.log("selectAdmin2 is complete")
    };



//mouseover
function highlightAdmin2(e) {
    massStyleClassifier (e, "hover");

    

}







function getGridSelection(adm2) {

    var gridSet = L.featureGroup()
    gridMap.eachLayer(function(layer) {

        if (layer.feature.properties.ADM2_PT === adm2) {
            gridSet.addLayer(layer);
        }

        })
        return gridSet
}




function styleGridSelection(gridSet) {

    gridSet.eachLayer(function(layer) {

        layer.setStyle((styleTotalArrivals(layer.feature)))
    })
        }
    
function unStyleGridSelection(gridSet) {

    gridSet.eachLayer(function(layer) {

        layer.setStyle((styleOtherProperty(layer.feature)))
    })
} 

//selectedPolygonGroup.clearLayers();
    

//selectedPolygonGroup.addLayer(layer);


/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Reset/mouseout     //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


//mouseout
function resetHighlight(e) {
    massStyleClassifier (e, "out");
    //console.log("out starting");
    //hoverState = false;
    
    //selectedPair = null;
    //need an adjustedv ersion of this reset call
    //admin2Map.resetStyle();
    //linksMap.resetStyle();

    //var layer = e.target;
    //var adm2 = e.target.feature.properties.ADM2_PT


    //updateLayerStyleNew(adm2,0,0,0,true);

/*       //new styling
    if (currentProperties.length == 0) {
        layer.setStyle({ color: "black", weight: 2 });
    }  
      else if (currentProperties.includes(adm2)) {
            console.log("back to red")
            layer.setStyle({ color: "darkred", weight: 2 });
            layer.bringToFront();
            styleGridSelection(getGridSelection(adm2));
        } else if (currentProperties.some(selected => getOrigsForDest(selected, "dest").includes(adm2))) {
            console.log("back to blue")
            layer.setStyle({ color: "darkblue", weight: 2 });
            layer.bringToFront();
            unStyleGridSelection(getGridSelection(adm2));
        } else {
            layer.setStyle({ color: "grey", weight: 0, fillOpacity: 0.7 });
        } */




        //var origAdms = getOrigsForDest(adm2,"dest")
        //console.log(origAdms);
        //styleAdmin2LayersNew(adm2,origAdms,"dest")
        
    





    //???
    //highlightSelectedNew();

//find out what it should be and use new styling function to execute









/*     admin2Map.eachLayer(function(layer) {
        //if (layer != selectedPolygon && layer != selectedPair) {admin2Map.resetStyle(layer)};

        if (selectedPair) {selectedPair.bringToFront();}
        if (selectedPolygon.length > 0) {
            for (i in selectedPolygon) selectedPolygon[i].bringToFront();}


    }) */
    
    //console.log("out ending")
}



// Define the "Reset" control
var resetControl = L.Control.extend({
    options: {
        position: 'bottomleft'
    },
    
    onAdd: function(map) {
        // Create a button element
        var button = L.DomUtil.create('button', 'leaflet-control-reset');
        button.innerHTML = 'Reset';
        
        // Add click event listener
        L.DomEvent.addListener(button, 'click', function() {
            // Reset the map to its starting state
            fullReset();
        });
        
        return button;
    }
});

// Add the "Reset" control to the map
map.addControl(new resetControl());

// Function to reset the map to its starting state
function fullReset() {
    // Reset the grid to show total_arrivals
    currentProperties = [];

 //empty click states
 clickStateAdms = {
    grey: {},
    blue: {},
    red: {}
};

clickStateGrid = {
    grey: {},
    blue: {},
    red: {}
};

    gridMap.setStyle(styleGrid);
    //linksMap.setStyle(hideLinks);
    updateTitle();
    updateSankeyAll();
    disaggCall ();

    selectedPair = null;

    // Reset any selected admin2 polygon
    admin2Map.eachLayer(function(layer) {
        admin2Map.resetStyle(layer);
    });

}









//////////// Legends //////////////


var legend_arrivals = L.control({position: 'topleft'});

legend_arrivals.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [20, Math.round(arrivalMultiplier*1), Math.round(arrivalMultiplier*2), Math.round(arrivalMultiplier*3), Math.round(arrivalMultiplier*4), Math.round(arrivalMultiplier*5)];
        labels = [];

	div.innerHTML = '<h4>Arrivals</h4>';
    // loop through our intervals and generate a label with a colored square for each interval
	// added .toLocaleString() to give formatted numbers
    
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + gridColorDefault(grades[i] + 1) + '"></i> ' +
            grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
    }

    return div;
};

legend_arrivals.addTo(map);



var legend_departures = L.control({position: 'topleft'});

legend_departures.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [20, Math.round(departureMultiplier*1), Math.round(departureMultiplier*2), Math.round(departureMultiplier*3), Math.round(departureMultiplier*4), Math.round(departureMultiplier*5)];
        labels = [];

	div.innerHTML = '<h4>Departures</h4>';
    // loop through our intervals and generate a label with a colored square for each interval
	// added .toLocaleString() to give formatted numbers
    
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + gridColorDepartures(grades[i] + 1) + '"></i> ' +
            grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
    }

    return div;
};

legend_departures.addTo(map);