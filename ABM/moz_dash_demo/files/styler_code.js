
var defaultState = {}
var clickState = {}
var redAdmin = { color: "darkred", weight: 3, fillOpacity: 0 }
var blueAdmin = { color: "darkblue", weight: 3, fillOpacity: 0 }
var greyAdmin = { color: "grey", weight: 0, fillOpacity: 0.7 }
var noHighlight = {color: "grey", weight: 1, fillOpacity: 0 }

 //Store click states
 var clickStateAdms = {
    grey: {},
    blue: {},
    red: {}
};

var clickStateGrid = {
    grey: {},
    blue: {},
    red: {}
};

// Style function for total_arrivals
function styleTester(feature) {
    return {
        fillColor: 'green',
        weight: 2,
        opacity: 1,
        color: 'green',
        dashArray: '3',
        fillOpacity: 0.7
    };
}









function massStyleClassifier (e, action) {

var targetType
var state
var adm2



//state:
//no selection
if (currentProperties.length === 0) {
    state = "noSelection"
    //single selection
    } else if (currentProperties.length === 1) {
    state = "singleSelection"
    //multi-selection
    } else {
    state = "multiSelection"
    }




//target:
//is it a node or link
if (e.domTarget && e.domTarget.tag && e.domTarget.tag.element) {

    //flows have type 1, nodes 0, so we just use a binary check
    var type = e.domTarget.tag.element.type ? 'flow' : 'node';

    if (type === 'node') {

        adm2 = cleanName(e.domTarget.tag.element.name);

        //is it a orig (level 0)
        //is it a dest (level 1)
        //maybe try the same here, binary check
        var level = e.domTarget.tag.element.level;
        targetType = (level === 0) ? ('nodeOrig') : ('nodeDest');
    
    } else if (type === 'flow') {
        targetType = "link";
}



//is it a map admin
} else if (e.target && e.target.feature && e.target.feature.properties.ADM2_PT) {

    var adm2 = e.target.feature.properties.ADM2_PT
    var selectionCheck = currentProperties.includes(adm2)

   //is it unselected
   //if nothing selection or curProps doesn't include it
    if (currentProperties.length === 0) {
        targetType = "mapUnselected"

   //is it previously selected
        } else if (selectionCheck) {
            targetType = "mapPrevSelected"
    
            //doing the full check against all current origins in a nested step as more computationally heavy
        } else {
            //get full list of linked origins based on active selection
            var currentOrigs = [];

            //check if adm is included
            currentProperties.forEach(area => {
                var origAdms = getOrigsForDest(area,"dest");
                currentOrigs.push(...origAdms);            
            });

            if (currentOrigs.includes(adm2)) {
                targetType = "mapLinkedOrig"
            //error check
            } else if (!selectionCheck) {
                targetType = "mapUnselected"
            } else {console.log("error massStyleClassifier: "+e.target)}

        }


}

/* //if we want to have hover action on links, we need to use sankeyLinkHover() rather than pass it to the massStyleSorter
if (targetType === "link" && action === "hover") {sankeyLinkHover(e);} else {
massStyleSorter(action, state, targetType, adm2)
} */

massStyleSorter(action, state, targetType, adm2)

}













/* function styleAdmin2LayersSankey1(nodeName, nodeList, nodeType) {
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
} */

/* //need to do without currentProperties due to hover
//or a combined approach - direct change vs change clickState then apply
function massStyleCaller(destAdm, origAdms, areaType) {
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
} */

//would it make more sense to store grid references as
//gridLayers.Ancuabe
//gridlayers.Palma
//then wouldn't need to do grid lookups

var test




// Style function for other properties
function styleOtherPropertyNew(feature, adm2, store, triggerAdm2) {
    //console.log("2 "+feature.properties.to_Macomia)
    //test = feature
    //console.log("styleOtherPropertyNew"+feature+" "+adm2+" "+store+" "+triggerAdm2);
    //var departs = departureTotalCalc(feature, adm2, store, triggerAdm2)
    //console.log(departs)
    //var fill = gridColorDepartures(departureTotalCalc(feature, adm2, store, triggerAdm2));
    //console.log(fill)
    return {
        fillColor: gridColorDepartures(departureTotalCalc(feature, adm2, store, triggerAdm2)),
        weight: 1,
        opacity: 1,
        color: 'lightgrey',
        //dashArray: '3',
        //fillOpacity: 0.7
    };

}




function departureTotalCalc(feature, adm2, store, triggerAdm2) {   

var totalDepartures = 0;

if (store == true) {
for (i in currentProperties) {
var tempTotal
//looks at the grid square and sees how many people are going to the adms in currentProps
tempTotal = feature.properties["to_"+[currentProperties[i]]]
totalDepartures += tempTotal;
}

} else {

    //when hovering over an admin (or sankey node) show only those flows
//removed this check - was due to double adding when (sankey) hovering over a selected node
//don't need now only showing specific flows for hovered node
//add back in if change back to showing total flows including both hovered and selected node(s)
//if (!currentProperties.includes(adm2)) {

//console.log(feature)
//console.log(triggerAdm2)
//console.log(feature.properties["ADM2_PT"+[triggerAdm2]])

var tempTotal
//looks at the grid square and sees how many people are going to the trigger adm
tempTotal = feature.properties["to_"+[triggerAdm2]]
totalDepartures += tempTotal;
//}
}

//console.log("departureTotalCalc= "+totalDepartures)

return totalDepartures;
}



function setGridStyle(adm2, colour, reset = false, store = false, triggerAdm2) {
    console.log(colour+triggerAdm2)
//get the grid squares for the admin area
//var gridExtract = getGridSelection(adm2);
//got rid of getGridSelection(adm2) here, can probably repeat elsewhere
var gridExtract = gridLayersByAdmin[adm2];

//console.log("setGridStyle for "+adm2+ " "+colour)

//this function is run per admin area
//get the scale without using currentProps for hover
//1. just selected and linked - simple
//2. selected and linked PLUS new - can still use current props, but need to add to it, so use current props as part of dyanmic process?
// If it's click we DO add to current props, and we want to store in a clickState then load that
// then for hover let's add new numbers to exiting using either currentProps or clickState. Clickstate gives us the blues without another lookup.
//So this function should be called by updateMapOrClickState, with two versions based on whether store is active

if (reset) {


} else {
    // Apply specific styles
    if (colour == "red") {
        if (store) {
            //console.log("red grid "+adm2)           
            Object.entries(gridExtract).forEach(([key, layer]) => {
            var style = styleTotalArrivals(layer.feature)
            var gridId = layer.feature.properties.grid_id;
            clickStateGrid.red[gridId] = {style};
            })
        }
        else {
            //simplify this again as not doing red/blue mix !!!!
            Object.entries(gridExtract).forEach(([key, layer]) => {
                //if (layer.feature.properties.total_arrivals > layer.feature.properties["to_"+triggerAdm2]) {
                layer.setStyle((styleTotalArrivals(layer.feature)))
                //} else {
                //layer.setStyle((styleOtherPropertyNew(layer.feature, adm2, store, triggerAdm2)))
                //}
            })
        }

    } else if (colour == "blue") {
        //console.log("blue grid "+adm2)
        if (store) {
            Object.entries(gridExtract).forEach(([key, layer]) => {
            var style = styleOtherPropertyNew(layer.feature, adm2, store)
            var gridId = layer.feature.properties.grid_id
            clickStateGrid.blue[gridId] = {style};
        })
        }
        else {   
            Object.entries(gridExtract).forEach(([key, layer]) => {
            layer.setStyle((styleOtherPropertyNew(layer.feature, adm2, store, triggerAdm2)))
        })
        }

    //we want arrivals behind the grey, doesn't seem to be there. Come back after click is done.
    } else if (colour == "grey") {
        //console.log("grey grid "+adm2)
        if (store) {
            Object.entries(gridExtract).forEach(([key, layer]) => {
                //!!!!!!!this is the problem
                //why are they in the grey group?
            var style = styleTotalArrivals(layer.feature)
            var gridId = layer.feature.properties.grid_id;
            clickStateGrid.grey[gridId] = {style};
            })
        }
        else {
            Object.entries(gridExtract).forEach(([key, layer]) => {
                layer.setStyle((styleTotalArrivals(layer.feature)))
            })
        }

    }
}


}





// Apply the styles to the map
function applyClickState() {
    //console.log("apply click state")
Object.entries(clickStateAdms.grey).forEach(([areaName]) => {
    var layer = admin2Layers[areaName];
    layer.setStyle(clickStateAdms.grey[areaName]);
}); 

Object.entries(clickStateAdms.blue).forEach(([areaName]) => {
    var layer = admin2Layers[areaName];
    layer.setStyle(clickStateAdms.blue[areaName]);
    layer.bringToFront();
}); 

Object.entries(clickStateAdms.red).forEach(([areaName]) => {
    var layer = admin2Layers[areaName];
    layer.setStyle(clickStateAdms.red[areaName]);
    layer.bringToFront();
}); 

Object.entries(clickStateGrid.grey).forEach(([gridID]) => {
    var layer = gridLayers[gridID];
    //layer.setStyle(styleTest());
    layer.setStyle(clickStateGrid.grey[gridID].style);
    //layer.bringToFront();
}); 

Object.entries(clickStateGrid.blue).forEach(([gridID]) => {
    var layer = gridLayers[gridID];
    //layer.setStyle(styleTest());
    layer.setStyle(clickStateGrid.blue[gridID].style);
    //layer.bringToFront();
}); 

Object.entries(clickStateGrid.red).forEach(([gridID]) => {
    var layer = gridLayers[gridID];
    //layer.setStyle(styleTest());
    layer.setStyle(clickStateGrid.red[gridID].style);
    //layer.bringToFront();
}); 

}


//is the reset functionality used?
//why are these set to false?
//we now also pass the adm2 that is called the change, which is needed for hovers where we can't use CurrentProps
function updateMapOrClickState(adm2, colour, reset = false, store = false, triggerAdm2, partialHighlight = false) {
 //    console.log("updateLayerStyleNew starts")
    const layer = admin2Layers[adm2];
    if (!layer) return;

    if (reset) {
        console.log("RESET FUNCTION USED")
        // Reset style based on selected or unselected state
        if (currentProperties.length == 0) {
            //console.log("reset black")
            styleGridSelection(getGridSelection(adm2));
            //layer.setStyle({ color: "black", weight: 2,  fillOpacity: 0 });
        }

    } else {
        // Apply specific styles
        if (colour == "red") {
            //console.log("red "+adm2)
            if (store) {clickStateAdms.red[adm2] = redAdmin;
                        setGridStyle(adm2, "red", false, true, triggerAdm2);}
            else {
                if (partialHighlight == false) {
                    layer.setStyle(redAdmin);
                    layer.bringToFront();
                } else {
                    layer.setStyle(noHighlight);  
                }
                    setGridStyle(adm2, "red", false, false, triggerAdm2);
                    }

            //styleGridSelection(getGridSelection(adm2));
        } else if (colour == "blue") {
            //console.log("blue "+adm2)
            if (store) {clickStateAdms.blue[adm2] = blueAdmin;
                        setGridStyle(adm2, "blue", false, true, triggerAdm2);}
            else { 
                if (partialHighlight == false) {
                    layer.setStyle(blueAdmin);
                    layer.bringToFront();
                } else {
                    layer.setStyle(noHighlight);
                }
                //either way update grid
                    setGridStyle(adm2, "blue", false, false, triggerAdm2);
                    }
            //unStyleGridSelection(getGridSelection(adm2));

        } else if (colour == "grey") {
            //stlying to arrivals, will be visible under grey
            //styleGridSelection(getGridSelection(adm2));

            //!!!!!!! problem might be here as hover is working
            if (store) {clickStateAdms.grey[adm2] = greyAdmin;
                        setGridStyle(adm2, "grey", false, true);}
            else {layer.setStyle(greyAdmin);
                    setGridStyle(adm2, "grey", false, false);}
            // No `bringToFront` for grey areas
        }
    }
    //console.log("updateLayerStyleNew ends")
}




//

/*             //we don't pass the event target, and we work all linked admins, not speciic 
            //so link behavior can't be done inside massStyleSorter
function sankeyLinkHover(e) {

            //get names from link
            el = e.domTarget.tag.element

            var toAdm = cleanName(el.Ke.name);
            var fromAdm = el.from.name;

            //send grey areas
                        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                            const isGrey = toAdm !== areaName && fromAdm !== areaName;
                            if (isGrey) {
                                //console.log("GREY: "+areaName);
                                updateMapOrClickState(areaName, "grey", false, false);
                            }
                        });
                
            //send blue area
                        updateMapOrClickState(fromAdm, "blue", false, false);
            
            //send red area
                        updateMapOrClickState(toAdm, "red", false, false); 

            //pass to map

} */













var noRefreshSelection = false;



//states noSelection singleSelection multiSelection

//actions hover out click

//types nodeOrig nodeDest link mapUnselected mapPrevSelected mapLinkedOrig

function massStyleSorter(action, state, targetType, adm2) {

console.log(action, state, targetType, adm2)

///////////////////////////////////////////////////////////////////////////
////////////////////////////////// hover //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

if (action === "hover") {
//directly apply state
    
////////////////////////////
//// HOVER NOSELECTION ////
////////////////////////////

    if (state === "noSelection") {

//// hover noSelection nodeOrig////

        if (targetType === "nodeOrig") {

        var connectedNodes = getNodesForNode(adm2, "orig");
        
         //send grey areas
         Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !connectedNodes.includes(areaName) && adm2 !== areaName;
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, false, adm2);
            }
        });

        //send red areas
        connectedNodes.forEach(admin => {
            updateMapOrClickState(admin, "red", false, false, adm2);
        })

        //send blue area
        updateMapOrClickState(adm2, "blue", false, false, adm2); 

//// hover noSelection nodeDest////

        } else if (targetType === "nodeDest") {

            massStyleSorter("hover", "noSelection", "mapUnselected", adm2)

//// hover noSelection link////

        } else if (targetType === "link") {

            //redundant
            //we don't pass the event target, and we work out all linked admins, not specific
            //so link behavior can't be done inside massStyleSorter
            //instead use sankeyLinkHover()


////////////////////////////////////////
//// hover noSelection mapUnselected////
////////////////////////////////////////

        } else if (targetType === "mapUnselected") {

             //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);

            console.log(origAdms)

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = !origAdms.includes(areaName) && adm2 !== areaName;
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send red area
            updateMapOrClickState(adm2, "red", false, false, adm2); 
            
//// hover noSelection mapPrevSelected////

        } else if (targetType === "mapPrevSelected") {
            //no action

//// hover noSelection mapLinkedOrig////

        } else if (targetType === "mapLinkedOrig") {
            //no action

        } else {console.log("error massStyleChanger 02")}

////////////////////////////////
//// HOVER singleSelection /////
////////////////////////////////

    } else if (state === "singleSelection") {

//// hover singleSelection nodeOrig /////

        if (targetType === "nodeOrig") {

        //same as noSelection

        var connectedNodes = getNodesForNode(adm2, "orig");
        
         //send grey areas
         Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !connectedNodes.includes(areaName) && adm2 !== areaName;
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, false, adm2);
            }
        });

        //send red areas
        connectedNodes.forEach(admin => {
            updateMapOrClickState(admin, "red", false, false, adm2);
        })

        //send blue area
        updateMapOrClickState(adm2, "blue", false, false, adm2); 

//// hover singleSelection nodeDest /////

        } else if (targetType === "nodeDest") {
            
            //can only be the selected node
            massStyleSorter("hover", "singleSelection", "mapPrevSelected", adm2)

//// hover singleSelection link /////

        } else if (targetType === "link") {

            //redundant

//// hover singleSelection mapUnselected /////

        } else if (targetType === "mapUnselected") {

            //single selection and multi selection are the same

            //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);

            var origAdmsforSelection = [];
            //there'll only be one, but keep this here to help with merge with multiSelection
            currentProperties.forEach(area => {
                var origAdmsTemp = getOrigsForDest(area,"dest");
                origAdmsforSelection.push(...origAdmsTemp);            
            }
            )
            // Remove duplicates within origAdmsforSelection and values already in origAdms
            origAdmsforSelection = [...new Set(origAdmsforSelection)].filter(orig => !origAdms.includes(orig));

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = adm2 !== areaName && (!origAdms.includes(areaName) && !origAdmsforSelection.includes(areaName));
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas for hovered admin
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send blue areas for previous selection
            origAdmsforSelection.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2, true);
            })

            currentProperties.forEach(admin => {
                //if a selected admin is not an origin for the hovered admin, we'll show it as red with no highlight
                if (!origAdms.includes(admin)) {
                updateMapOrClickState(admin, "red", false, false, adm2, true);
                }
                })
                
            //send red areas
            updateMapOrClickState(adm2, "red", false, false, adm2);
            
            
//// hover singleSelection mapPrevSelected /////

        } else if (targetType === "mapPrevSelected") {

            //if we haven't seen an out yet, keep red (prevents hover from changing view back to blue after selecting an admin)
            if (noRefreshSelection === false) {

                            //send red areas
            updateMapOrClickState(adm2, "blue", false, false, adm2);    
                

            } else {
                return;
        }

//// hover singleSelection mapLinkedOrig /////

        } else if (targetType === "mapLinkedOrig") {

            //pasted from singleSelection mapUnselected, not changed
            //single selection and multi selection are the same

            //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);

            var origAdmsforSelection = [];
            //there'll only be one, but keep this here to help with merge with multiSelection
            currentProperties.forEach(area => {
                var origAdmsTemp = getOrigsForDest(area,"dest");
                origAdmsforSelection.push(...origAdmsTemp);            
            }
            )
            // Remove duplicates within origAdmsforSelection and values already in origAdms
            origAdmsforSelection = [...new Set(origAdmsforSelection)].filter(orig => !origAdms.includes(orig));

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = adm2 !== areaName && (!origAdms.includes(areaName) && !origAdmsforSelection.includes(areaName));
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas for hovered admin
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send blue areas for previous selection
            origAdmsforSelection.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2, true);
            })

            currentProperties.forEach(admin => {
                //if a selected admin is an origin for the hovered admin, we'll show it as red with no highlight
                if (!origAdms.includes(admin)) {
                updateMapOrClickState(admin, "red", false, false, adm2, true);
                }
                })
                
            //send red areas
            updateMapOrClickState(adm2, "red", false, false, adm2);

        } else {console.log("error massStyleChanger 03")}

    ///////////////////////////////
    //// HOVER multi-selection ////
    ///////////////////////////////

    } else if (state === "multiSelection") {

//// hover multiSelection nodeOrig /////

        if (targetType === "nodeOrig") {

            //same as noSelection
            var connectedNodes = getNodesForNode(adm2, "orig");
        
         //send grey areas
         Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !connectedNodes.includes(areaName) && adm2 !== areaName;
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, false, adm2);
            }
        });

        //send red areas
        connectedNodes.forEach(admin => {
            updateMapOrClickState(admin, "red", false, false, adm2);
        })

        //send blue area
        updateMapOrClickState(adm2, "blue", false, false, adm2); 

//// hover multiSelection nodeDest /////

        } else if (targetType === "nodeDest") {
            //this is the same as hover single/multiSelection mapUnSelected
            //making changes now

            //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);

            var origAdmsforSelection = [];
            //there'll only be one, but keep this here to help with merge with multiSelection
            currentProperties.forEach(area => {
                var origAdmsTemp = getOrigsForDest(area,"dest");
                origAdmsforSelection.push(...origAdmsTemp);            
            }
            )
            // Remove duplicates within origAdmsforSelection and values already in origAdms
            origAdmsforSelection = [...new Set(origAdmsforSelection)].filter(orig => !origAdms.includes(orig));

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = adm2 !== areaName && (!origAdms.includes(areaName) && !origAdmsforSelection.includes(areaName));
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas for hovered admin
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send blue areas for previous selection
            origAdmsforSelection.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2, true);
            })

            currentProperties.forEach(admin => {
                //if a selected admin is an origin for the hovered admin, we'll show it as red but with no highlight
                if (!origAdms.includes(admin)) {
                updateMapOrClickState(admin, "red", false, false, adm2, true);
                }
                })

            //send red areas
            updateMapOrClickState(adm2, "red", false, false, adm2);
            


//// hover multiSelection link /////

        } else if (targetType === "link") {


//// hover multiSelection mapUnselected /////

        } else if (targetType === "mapUnselected") {

            //I think single selection and multi selection are the same

            //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);


            var origAdmsforSelection = [];

            //there'll only be one, but keep this here to help with merge with multiSelection
            currentProperties.forEach(area => {
                var origAdmsTemp = getOrigsForDest(area,"dest");
                origAdmsforSelection.push(...origAdmsTemp);            
            }
            )
            // Remove duplicates within origAdmsforSelection and values already in origAdms
            origAdmsforSelection = [...new Set(origAdmsforSelection)].filter(orig => !origAdms.includes(orig));

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = adm2 !== areaName && (!origAdms.includes(areaName) && !origAdmsforSelection.includes(areaName)) && !currentProperties.includes(areaName);
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas for hovered admin
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send blue areas for previous selection
            origAdmsforSelection.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2, true);
            })
            
            currentProperties.forEach(admin => {
                //if a selected admin is not an origin for the hovered admin, we'll show it as red with no highlight
                if (!origAdms.includes(admin)) {
                updateMapOrClickState(admin, "red", false, false, adm2, true);
                }
                })

            //send red areas
            updateMapOrClickState(adm2, "red", false, false, adm2);
            
//// hover multiSelection mapPrevSelected /////

        } else if (targetType === "mapPrevSelected") {

                        //same as singleSelection
                        //if we haven't seen an out yet, keep red (prevents hover from changing view back to blue after selecting an admin)
                        if (noRefreshSelection === false) {

                            //send red areas
            updateMapOrClickState(adm2, "blue", false, false, adm2);    
                

            } else {
                return;
        }

//// hover multiSelection mapLinkedOrig /////

        } else if (targetType === "mapLinkedOrig") {

            //pasted from singleSelection mapUnselected, not changed
            //single selection and multi selection are the same

            //pass new temporary data to getOrigs
            var tempData = getFlowsForAdmin(adm2);
            var origAdms = getOrigsForDest(adm2,"dest", tempData);

            var origAdmsforSelection = [];
            //there'll only be one, but keep this here to help with merge with multiSelection
            currentProperties.forEach(area => {
                var origAdmsTemp = getOrigsForDest(area,"dest");
                origAdmsforSelection.push(...origAdmsTemp);            
            }
            )
            // Remove duplicates within origAdmsforSelection and values already in origAdms
            origAdmsforSelection = [...new Set(origAdmsforSelection)].filter(orig => !origAdms.includes(orig));

            //send grey areas
            Object.entries(admin2Layers).forEach(([areaName, layer]) => {
                const isGrey = adm2 !== areaName && (!origAdms.includes(areaName) && !origAdmsforSelection.includes(areaName));
                if (isGrey) {
                    //console.log("GREY: "+areaName);
                    updateMapOrClickState(areaName, "grey", false, false, adm2);
                }
            });
    
            //send blue areas for hovered admin
            origAdms.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2);
            })

            //send blue areas for previous selection
            origAdmsforSelection.forEach(admin => {
                updateMapOrClickState(admin, "blue", false, false, adm2, true);
            })

            currentProperties.forEach(admin => {
                //if a selected admin is an origin for the hovered admin, we'll show it as red with no highlight
                if (!origAdms.includes(admin)) {
                updateMapOrClickState(admin, "red", false, false, adm2, true);
                }
                })
                
            //send red areas
            updateMapOrClickState(adm2, "red", false, false, adm2);

        } else {console.log("error massStyleChanger 04")}

    }


///////////////////////////////////////////////////////////////////////////
/////////////////////////////////// out ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////

} else if (action === "out") {
//reset to correct state

noRefreshSelection = false;

if (state === "noSelection") {
    admin2Map.resetStyle();
    gridMap.resetStyle();
} else if (state === "singleSelection" || state === "multiSelection") {
    applyClickState();
} else {console.log("error massStyleChanger 00")}




///////////////////////////////////////////////////////////////////////////
////////////////////////////////// click //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

} else if (action === "click") {

    noRefreshSelection = true;

         //Store click states
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

    ////////////////////////////
    //// CLICK noSelection ////
    ////////////////////////////

if (state === "noSelection") {

//// click noSelection nodeOrig /////

    if (targetType === "nodeOrig") {

//// click noSelection nodeDest /////

    } else if (targetType === "nodeDest") {

        massStyleSorter("click", "noSelection", "mapUnselected", adm2)

        //okay for map but sankey doesn't update

//// click noSelection link /////

    } else if (targetType === "link") {

        //no action

//// click noSelection mapUnselected /////

    } else if (targetType === "mapUnselected") {

        currentProperties.push(adm2);
        updateDataCollection();

        var origAdms = getOrigsForDest(adm2,"dest");

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !origAdms.includes(areaName) && adm2 !== areaName;
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //send blue areas
        origAdms.forEach(admin => {
            updateMapOrClickState(admin, "blue", false, true, adm2);
        })

        //send red area
        updateMapOrClickState(adm2, "red", false, true, adm2);

        applyClickState();


//// click noSelection mapPrevSelected /////

    } else if (targetType === "mapPrevSelected") {
        //not possible

//// click noSelection mapLinkedOrig /////

    } else if (targetType === "mapLinkedOrig") {
        //not possible


    } else {console.log("error massStyleChanger 08")}

    ////////////////////////////////
    //// CLICK singleSelection ////
    ////////////////////////////////


    } else if (state === "singleSelection") {
 
//// click singleSelection nodeOrig /////

    if (targetType === "nodeOrig") {

//// click singleSelection nodeDest /////

    } else if (targetType === "nodeDest") {

        //can only be a previously selected node

        massStyleSorter("click", "singleSelection", "mapPrevSelected", adm2)

//// click singleSelection link /////

    } else if (targetType === "link") {

        //!!!!!

//// click singleSelection mapUnselected /////

    } else if (targetType === "mapUnselected") {

        currentProperties.push(adm2);
        updateDataCollection();

        //expand this to get orgs for all reds

        var origAdms = [];

        currentProperties.forEach(area => {
            var origAdmsTemp = getOrigsForDest(area,"dest");
            origAdms.push(...origAdmsTemp);            
        }
        )

        // Remove duplicates
        origAdms = [...new Set(origAdms)];

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            //!!!?
            const isGrey = !origAdms.includes(areaName) && !currentProperties.includes(areaName);
            if (isGrey) {
                console.log(areaName+" should be grey");
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //send blue areas
            //!!!?
        origAdms.forEach(admin => {
            console.log(admin+" should be blue")
            updateMapOrClickState(admin, "blue", false, true, adm2);
        })

        //send red area
        //expanded this to send multiple reds
        currentProperties.forEach(admin => {
        updateMapOrClickState(admin, "red", false, true, adm2);
        })

        applyClickState();

//// click singleSelection mapPrevSelected /////

    } else if (targetType === "mapPrevSelected") {

        currentProperties = [];
        updateDataCollection();
        admin2Map.resetStyle();
        gridMap.resetStyle();


//// click singleSelection mapLinkedOrig /////

    } else if (targetType === "mapLinkedOrig") {

        //same as unselected

        currentProperties.push(adm2);
        updateDataCollection();

        //expand this to get orgs for all reds

        var origAdms = [];

        currentProperties.forEach(area => {
            var origAdmsTemp = getOrigsForDest(area,"dest");
            origAdms.push(...origAdmsTemp);            
        }
        )

        // Remove duplicates
        origAdms = [...new Set(origAdms)];

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !origAdms.includes(areaName) && !currentProperties.includes(areaName);
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //send blue areas
        origAdms.forEach(admin => {
            updateMapOrClickState(admin, "blue", false, true, adm2);
        })

        //send red area
        //expand this to send multiple reds
        currentProperties.forEach(admin => {
        updateMapOrClickState(admin, "red", false, true, adm2);
        })

        applyClickState();        

    } else {console.log("error massStyleChanger 09")}

    /////////////////////////
    //// CLICK multi-selection ////
    /////////////////////////


    } else if (state === "multiSelection") {
    
//// click multiSelection nodeOrig /////

    if (targetType === "nodeOrig") {


//// click multiSelection nodeDest /////

    } else if (targetType === "nodeDest") {

        massStyleSorter("click", "multiSelection", "mapPrevSelected", adm2)

//// click multiSelection link /////

    } else if (targetType === "link") {


//// click multiSelection mapUnselected /////

    } else if (targetType === "mapUnselected") {
        //same as singleSelection
        //I think only multiSelection mapPrevSelected will be different, so might be able to kill off the others

        currentProperties.push(adm2);
        updateDataCollection();

        //expand this to get orgs for all reds

        var origAdms = [];

        currentProperties.forEach(area => {
            var origAdmsTemp = getOrigsForDest(area,"dest");
            origAdms.push(...origAdmsTemp);            
        }
        )
        
        // Remove duplicates
        origAdms = [...new Set(origAdms)];

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !origAdms.includes(areaName) && !currentProperties.includes(areaName);
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //old fashioned for loops
        //send blue areas
        for (i in origAdms) {
            updateMapOrClickState(origAdms[i], "blue", false, true, adm2);
        }

        //send red area
        //expand this to send multiple reds
        for (i in currentProperties) {
        updateMapOrClickState(currentProperties[i], "red", false, true, adm2);
        }

        applyClickState();

//// click multiSelection mapPrevSelected /////


    } else if (targetType === "mapPrevSelected") {

        currentProperties = currentProperties.filter(property => property !== adm2);
        updateDataCollection();

        var origAdms = [];

        currentProperties.forEach(area => {
            var origAdmsTemp = getOrigsForDest(area,"dest");
            origAdms.push(...origAdmsTemp);            
        }
        )
        
        // Remove duplicates
        origAdms = [...new Set(origAdms)];

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !origAdms.includes(areaName) && !currentProperties.includes(areaName);
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //send blue areas
        origAdms.forEach(admin => {
            updateMapOrClickState(admin, "blue", false, true, adm2);
        })

        //send red area
        //expanded this to send multiple reds
        currentProperties.forEach(admin => {
        updateMapOrClickState(admin, "red", false, true, adm2);
        })

        applyClickState(); 

//// click multiSelection mapLinkedOrig /////


    } else if (targetType === "mapLinkedOrig") {

        //same again

        currentProperties.push(adm2);
        updateDataCollection();
        //expand this to get orgs for all reds

        var origAdms = [];

        currentProperties.forEach(area => {
            var origAdmsTemp = getOrigsForDest(area,"dest");
            origAdms.push(...origAdmsTemp);            
        }
        )
        
        // Remove duplicates
        origAdms = [...new Set(origAdms)];

        //send grey areas
        Object.entries(admin2Layers).forEach(([areaName, layer]) => {
            const isGrey = !origAdms.includes(areaName) && !currentProperties.includes(areaName);
            if (isGrey) {
                //console.log("GREY: "+areaName);
                updateMapOrClickState(areaName, "grey", false, true, adm2);
            }
        });

        //send blue areas
        origAdms.forEach(admin => {
            updateMapOrClickState(admin, "blue", false, true, adm2);
        })

        //send red area
        //expand this to send multiple reds
        currentProperties.forEach(admin => {
        updateMapOrClickState(admin, "red", false, true, adm2);
        })

        applyClickState();

    } else {console.log("error massStyleChanger 10")}

}

updateTitle();
updateSankeyAll();
disaggCall ()


//error check
} else (console.log("error massStyleChanger 01"))








}













    //////////////////////
    //// OUT no selection ////
    /////////////////////

/* if (state === "noSelection") {
    if (targetType === "nodeOrig") {

        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else if (targetType === "nodeDest") {

        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else if (targetType === "link") {

        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else if (targetType === "mapUnselected") {

        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else if (targetType === "mapPrevSelected") {

        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else if (targetType === "mapLinkedOrig") {
        //is this possible?
        admin2Map.resetStyle();
        gridMap.resetStyle();

    } else {console.log("error massStyleChanger 05")}

    //////////////////////////
    //// OUT single selection ////
    //////////////////////////


} else if (state === "singleSelection") {
    if (targetType === "nodeOrig") {

        applyClickState();

    } else if (targetType === "nodeDest") {

        applyClickState();

    } else if (targetType === "link") {

        applyClickState();

    } else if (targetType === "mapUnselected") {

        applyClickState();

    } else if (targetType === "mapPrevSelected") {

        applyClickState();

    } else if (targetType === "mapLinkedOrig") {

        applyClickState();

    } else {console.log("error massStyleChanger 06")}

    /////////////////////////
    //// OUT multi-selection ////
    /////////////////////////

} else if (state === "multiSelection") {
    if (targetType === "nodeOrig") {

        applyClickState();

    } else if (targetType === "nodeDest") {

        applyClickState();

    } else if (targetType === "link") {

        applyClickState();

    } else if (targetType === "mapUnselected") {

        applyClickState();

    } else if (targetType === "mapPrevSelected") {

        applyClickState();

    } else if (targetType === "mapLinkedOrig") {

        applyClickState();

    } else {console.log("error massStyleChanger 07")}

} */