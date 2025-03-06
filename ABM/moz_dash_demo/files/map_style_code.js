/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Map styling    /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
// Style function for total_arrivals
function styleTest(feature) {
    console.log("styleTester")
    return {
        fillColor: 'green',
        weight: 2,
        opacity: 1,
        color: 'green',
        dashArray: '3',
        fillOpacity: 0.7,
        test: 'green!'
    };
}

var arrivalMultiplier = maxValues.maxArrivals/6
var departureMultiplier = maxValues.maxDepartures/6

console.log("departureMultiplier" + departureMultiplier)

//colorbrewer Multi-hue bottom right
function gridColorDefault(d) {
    return d > arrivalMultiplier*5  ? 'rgba(189, 0, 38, 1)' :      // '#BD0026'
           d > arrivalMultiplier*4  ? 'rgba(227, 26, 28, 1)' :     // '#E31A1C'
           d > arrivalMultiplier*3  ? 'rgba(252, 78, 42, 1)' :     // '#FC4E2A'
           d > arrivalMultiplier*2   ? 'rgba(253, 141, 60, 1)' :    // '#FD8D3C'
           d > arrivalMultiplier*1   ? 'rgba(254, 178, 76, 1)' :    // '#FEB24C'
   //        d > 0   ? 'rgba(254, 217, 118, 1)' :   // '#FED976'
         d > 20   ? 'rgba(255, 237, 160, 1)' :   // '#FFEDA0'
                      'rgba(255, 255, 255, 0.5)';    // '#FFEDA0'
} 

 //single hue top left
function gridColorDepartures(d) {
    return d > departureMultiplier*5 ? 'rgba(8,48,107)' :       
           d > departureMultiplier*4  ? 'rgba(8,81,156)' :     
           d > departureMultiplier*3  ? 'rgba(33,113,181)' :    
           d > departureMultiplier*2  ? 'rgba(66,146,198)' :    
           d > departureMultiplier*1   ? 'rgba(107,174,214)' :   
           d > 0   ? 'rgba(158,202,225)' :
                      'rgba(255, 255, 255)';   
}

/* //test all dark red
function gridColorDefault(d) {
    return d > arrivalMultiplier*6  ? 'rgba(189, 0, 38, 1)' :      // '#BD0026'
           d > arrivalMultiplier*5  ? 'rgba(189, 0, 38, 1)' :     // '#E31A1C'
           d > arrivalMultiplier*4  ? 'rgba(189, 0, 38, 1)' :     // '#FC4E2A'
           d > arrivalMultiplier*3   ? 'rgba(189, 0, 38, 1)' :    // '#FD8D3C'
           d > arrivalMultiplier*2   ? 'rgba(189, 0, 38, 1)' :    // '#FEB24C'
           d > 0   ? 'rgba(189, 0, 38, 1)' :   // '#FED976'
                      'rgba(255, 255, 255, 0.5)';    // '#FFEDA0'
   //                   'rgba(255, 237, 160, 0.7)';    // '#FFEDA0'
}

//test all dark blue
function gridColorDepartures(d) {
    return d > departureMultiplier*6 ? 'rgba(8,48,107)' :       
           d > departureMultiplier*5  ? 'rgba(8,48,107)' :     
           d > departureMultiplier*4  ? 'rgba(8,48,107)' :    
           d > departureMultiplier*3  ? 'rgba(8,48,107)' :     
           d > departureMultiplier*2   ? 'rgba(8,48,107)' :    
           d > 0   ? 'rgba(8,81,156)' : 
                      'rgba(255,255,255)';   
}
 */

/* function gridColorDefault(d) {
    return d > arrivalMultiplier*7 ? 'rgba(128, 0, 38, 1)' :      // '#800026'
           d > arrivalMultiplier*6  ? 'rgba(189, 0, 38, 1)' :      // '#BD0026'
           d > arrivalMultiplier*5  ? 'rgba(227, 26, 28, 1)' :     // '#E31A1C'
           d > arrivalMultiplier*4  ? 'rgba(252, 78, 42, 1)' :     // '#FC4E2A'
           d > arrivalMultiplier*3   ? 'rgba(253, 141, 60, 1)' :    // '#FD8D3C'
           d > arrivalMultiplier*2   ? 'rgba(254, 178, 76, 1)' :    // '#FEB24C'
           d > arrivalMultiplier   ? 'rgba(254, 217, 118, 1)' :   // '#FED976'
                      'rgba(255, 255, 255, 0.5)';    // '#FFEDA0'
   //                   'rgba(255, 237, 160, 0.7)';    // '#FFEDA0'
} */

/* function gridColorDepartures(d) {
    return d > departureMultiplier*7 ? 'rgba(8,69,148)' :       
           d > departureMultiplier*6  ? 'rgba(33,113,181)' :     
           d > departureMultiplier*5  ? 'rgba(66,146,198)' :    
           d > departureMultiplier*4  ? 'rgba(107,174,214)' :    
           d > departureMultiplier*3   ? 'rgba(158,202,225)' :   
           d > departureMultiplier*2   ? 'rgba(198,219,239)' :   
           d > departureMultiplier   ? 'rgba(222,235,247)' :  
                      'rgba(247,251,255)';   
} */



// Style function for total_arrivals
function styleTotalArrivals(feature) {
    return {
        fillColor: gridColorDefault(feature.properties.total_arrivals),
        weight: 1,
        opacity: 1,
        color: 'lightgrey',
        //dashArray: '3',
        fillOpacity: 1
    };
}

// Style function for other properties
function styleOtherProperty(feature) {
    //console.log(feature.properties.ADM2_PT);
    return {
        fillColor: gridColorDepartures(propStlying(feature)),
        weight: 1,
        opacity: 1,
        color: 'lightgrey',
        //dashArray: '3',
        //fillOpacity: 0.7
    };
}


function propStlying(feature) {    
    //this is for each grid square
//for each current pop (or selected poly) create new total for that grid squre from to_x and to_y
//sum and return
//get styleOtherProperty to call it
//create new scale?

//is selectedPolygon or current props is empty, use the hover list?


var totalDepartures = 0;
for (i in currentProperties) {

var tempTotal

//test1 = feature.properties
//test2 = "to_"+[selectedPolygon[i].feature.properties.ADM2_PT]

//console.log(test1);
//console.log(test2);
//console.log(feature.properties[test2])

tempTotal = feature.properties["to_"+[currentProperties[i]]]
//console.log(tempTotal);

totalDepartures += tempTotal;
}

//console.log("total= "+totalDepartures);
return totalDepartures;

}

// Main style function
//leaflet calls this on gridMap and hands it each feature one by one
function styleGrid(feature) {
    //console.log("styleGrid call")
    //if cP empty, everything to arrivals
    if (currentProperties.length == 0) {
        //console.log("styleGrid setting to arrivals")
        return styleTotalArrivals(feature);
    } else {
    //if not everything to depatures
    //console.log("styleGrid setting to departures")
        return styleOtherProperty(feature);
    }
}


function styleAdmin2(feature) {
    return {
		fill: true,
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0
    };
}