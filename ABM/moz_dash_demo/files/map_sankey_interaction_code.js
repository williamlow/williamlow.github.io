/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Map & sankey interation     ////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////



//chart.data().getDataSets() gets flows

/* function makeChartRefs() {
    //store layer reference for external interactions
    var admin2Name = feature.properties.ADM2_PT;
    admin2Layers[admin2Name] = layer; // Save layer reference
} */

//sankey mouseover

var testdom






chart.listen('mouseover', function(e) {
    if (e.domTarget.tag && e.domTarget.tag.element) {
        massStyleClassifier (e, "hover");
    }
/*     if (e.domTarget.tag && e.domTarget.tag.element) {
        hoverState = true;
    var el = e.domTarget.tag.element;

    //console.log(e.domTarget.tag.element.type)


      var type = el.type ? 'flow' : 'node';
      if (type === 'node') {
        //dashState = "node";
        //console.log("Here:"+el)
        var level = el.level;
        var name = el.name;
        var nodeType = (level == 0) ? ('orig') : ('dest');
        //console.log('Node type '+nodeType+' with name '+name)
        var connectedNodes = getNodesForNode(name,nodeType);
        var cleanedName = cleanName(name);

        styleAdmin2LayersSankey(cleanedName,connectedNodes,nodeType) 





      }
      if (type === 'flow') {
        //dashState = "node";
      	//console.log('Flow from '+el.from.name+' to '+el.Ke.name+' of '+el.weight);
      }
    } */




  });



  chart.listen('click', function(e) {
    if (e.domTarget.tag && e.domTarget.tag.element) {
        massStyleClassifier (e, "click");
    }
    //console.log(e)
 /*    if (e.domTarget.tag && e.domTarget.tag.element) {
    var el = e.domTarget.tag.element;

      var type = el.type ? 'flow' : 'node';
      if (type === 'node') {
        //dashState = "node";

        var level = el.level;
        var name = el.name;
        var nodeType = (level == 0) ? ('orig') : ('dest');
        //console.log('Node type '+nodeType+' with name '+name)
  
        var cleanedName = cleanName(name);


        admin2Layers[cleanedName].fireEvent('click');
        //var connectedNodes = getNodesForNode(name,nodeType);
        //console.log(connectedNodes)
        //styleAdmin2LayersSankey(cleanedName,connectedNodes,nodeType) 

        //not sure what this did here
        //resetMapStyle();
/* 
        currentProperties.push(name);
        gridMap.setStyle(styleGrid);
        //highlightMatchingFeatures(adm2);

        gridSelection = getGridSelection(name).addTo(map);

        styleGridSelection(gridSelection);

        updateTitle();
 */

        //styleAdmin2LayersSankey(cleanedName,connectedNodes,nodeType) 


/* 
      }
      if (type === 'flow') {
        //dashState = "node";
      	//console.log('Flow from '+el.from.name+' to '+el.Ke.name+' of '+el.weight);
      }
    } */




  });










  //if a node, get the nodes connected to it
  //need to look in current dataCollection subset
//if orig, find records where from == name
//if dest, to == name_
//make list of associated froms or tos

function getNodesForNode(name, nodeType) {
    // Determine which data source to use
    const dataSource = currentProperties.length ? dataCollection : topFlows;

    // Initialize an empty list to store the results
    const connectedNodes = [];



    // Iterate through the data source
    dataSource.forEach(record => {
        if (nodeType === "orig" && record.from === name) {
            connectedNodes.push(cleanName(record.to)); // Clean destination nodes for 'orig'
        } else if (nodeType === "dest" && record.to === name) {
            connectedNodes.push(cleanName(record.from)); // Clean origin nodes for 'dest'
        }
    });

    return connectedNodes;
}




/* function updateLayerStyle(areaName, isRed, isBlue, isGrey, reset = false) {
    const layer = admin2Layers[areaName];
    if (!layer) return;

    if (reset) {
        // Reset style based on selected or unselected state
        if (currentProperties.includes(areaName)) {
            layer.setStyle({ color: "darkred", weight: 5 });
            styleGridSelection(getGridSelection(areaName));
        } else if (currentProperties.some(selected => getNodesForNode(selected, "orig").includes(areaName))) {
            layer.setStyle({ color: "darkblue", weight: 5 });
            unStyleGridSelection(getGridSelection(areaName));
        } else {
            layer.setStyle({ color: "black", weight: 2, fillOpacity: 0.0 });
        }
    } else {
        // Apply specific styles
        if (isRed) {
            layer.setStyle({ color: "darkred", weight: 5 });
            styleGridSelection(getGridSelection(areaName));
        } else if (isBlue) {
            layer.setStyle({ color: "darkblue", weight: 5 });
            unStyleGridSelection(getGridSelection(areaName));
        } else if (isGrey) {
            layer.setStyle({ color: "grey", weight: 0, fillOpacity: 0.7 });
        }
    }
} */





function styleAdmin2LayersSankey(nodeName, nodeList, nodeType) {
    // Step 1: Grey out all unselected areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isGrey = areaName !== nodeName && !nodeList.includes(areaName);
        if (isGrey) {
            updateLayerStyleNew(areaName, false, false, true);
            // No `bringToFront` for grey areas
        }
    });

    // Step 2: Style blue areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isBlue = (nodeType === "orig" && areaName === nodeName) || 
                       (nodeType === "dest" && nodeList.includes(areaName));
        if (isBlue) {
            updateLayerStyleNew(areaName, false, true, false);
            layer.bringToFront(); // Ensure blue areas are above grey areas
        }
    });

    // Step 3: Style red areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isRed = (nodeType === "orig" && nodeList.includes(areaName)) || 
                      (nodeType === "dest" && areaName === nodeName);
        if (isRed) {
            updateLayerStyleNew(areaName, true, false, false);
            layer.bringToFront(); // Ensure red areas are above both blue and grey areas
        }
    });
}



// Reset map to the state reflecting selected areas
function resetMapStyle() {
    // Step 1: Grey out all unselected areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isGrey = !currentProperties.includes(areaName) && 
                       !currentProperties.some(selected => getNodesForNode(selected, "orig").includes(areaName));
        if (isGrey) {
            layer.setStyle({ color: "black", weight: 2, fillOpacity: 0.0 });
            // No `bringToFront` for grey areas
        }
    });

    // Step 2: Style blue areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isBlue = currentProperties.some(selected => 
                         getNodesForNode(selected, "orig").includes(areaName));
        if (isBlue) {
            layer.setStyle({ color: "darkblue", weight: 5 });
            layer.bringToFront(); // Ensure blue areas are above grey areas
        }
    });

    // Step 3: Style red areas
    Object.entries(admin2Layers).forEach(([areaName, layer]) => {
        const isRed = currentProperties.includes(areaName);
        if (isRed) {
            layer.setStyle({ color: "darkred", weight: 5 });
            layer.bringToFront(); // Ensure red areas are above both blue and grey areas
        }
    });

    // Step 4: Reset grid styling
    Object.entries(admin2Layers).forEach(([areaName]) => {
        const gridSelection = getGridSelection(areaName);
        if (currentProperties.includes(areaName)) {
            styleGridSelection(gridSelection); // Apply red grid style
        } else {
            unStyleGridSelection(gridSelection); // Remove style for other grids
        }
    });
}

// Mouseout listener
chart.listen('mouseout', function (e) {
    if (e.domTarget.tag && e.domTarget.tag.element) {
        massStyleClassifier (e, "out");
        }
    });

/*     if (e.domTarget.tag && e.domTarget.tag.element) {
        hoverState = false;
        var el = e.domTarget.tag.element;
        var type = el.type ? 'flow' : 'node';
        if (type === 'node') {
            mapReturnToState();
            //resetMapStyle(); // Reuse the resetMapStyle function
        }
    }
}); */







//if a node, get relevent flows
function getLinksForNode(){}

//if a link, get the relevent nodes 
function getNodesForFlows(){}







