/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Sankey     /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////




//Trim non-zero sankeydata to top x%

// Step 1: Remove records with zero weight
const nonZeroWeightData = sankeyDataDemo.filter(record => record.weight > 0);

// Step 2: Sort the remaining data by weight in descending order
const sortedData = nonZeroWeightData.sort((a, b) => b.weight - a.weight);

// Step 3: Calculate the number of records to include in the top eg. 20%
const topPercentage = 1;
const topCount = Math.ceil(sortedData.length * topPercentage);

// Step 4: Slice the top x% of records
const topFlows = sortedData.slice(0, topCount);

var sankeyData = anychart.data.set(topFlows);





function updateSankeyAll () {
    
if (currentProperties.length >0) {

    $('#noFlows').removeClass("invisible");

    //do we need here?
    updateDataCollection();

    if (dataCollection.length > 0) {
            $('#noFlows').addClass("invisible");
        sankeyData.data(dataCollection);
    }


} else {
    $('#noFlows').addClass("invisible");
    sankeyData.data(topFlows);

}

};





//? 
var chart;


var sankeyTest = anychart.data.set([
  {from: "Canada",  to: "France",  weight:  2230000},
  {from: "Canada",  to: "Germany", weight:  1990000},
  {from: "Canada",  to: "Italy",   weight:  1180000},
  {from: "Canada",  to: "Spain",   weight:   990000}
]);

var addTest = {from: "Canada",  to: "France",  weight:  2230000};

var replaceTest = [
  {from: "USA",  to: "France",  weight:  1230000},
  {from: "USA",  to: "Germany", weight:  2990000},
  {from: "Canada",  to: "Bermuda",   weight:  3180000},
  {from: "Canada",  to: "Lemura",   weight:   590000}
];

function addReplace() {

    for (i in replaceTest) {sankeyTest.append(replaceTest[i])}
}


//Looks like this was code to build a simple data collection to feed into the sankey direct from the admin2_data rather than having a dedicated file
//and then also directly spawned the sankey

/* function updateSankey(destAdmin2) {
    if (destAdmin2 == "all") {

    } else {
for (feature in admin2_data.features) {
    var featureAdmin2 = admin2_data.features[feature].properties.ADM2_PT
    var flowValue = admin2_data.features[feature].properties["to_"+destAdmin2]
    //might need to check what happens to 0 values
    if (flowValue != null) {
    if (destAdmin2 == featureAdmin2) {featureAdmin2 = featureAdmin2+" "};
    sankeyData.push({ from: featureAdmin2, to: destAdmin2, weight: flowValue });
    }
}

spawnSankey(sankeyData)

}
}; */

//https://stackoverflow.com/questions/52720034/sum-similar-keys-in-an-array-of-objects-in-javascript
//adjusted solution to function called with 'from' or 'to' strong to create array of locations and total flows/disagg
function storeNodeDisagg(direction) {
    var keys = ['weight', 'total_male', 'total_female', 'total_under18', 'total_18to60', 'total_over60'];
    var stats = Object.values(sankeyDataDemo.reduce((result, object) => {
            result[object[direction]] = result[object[direction]] || { location: object[direction] };
            keys.forEach(key => result[object[direction]][key] = (result[object[direction]][key] || 0) + object[key]);
            return result;
        }, Object.create(null)));
    return stats;
    }
    
    //actually from and to need to be combined into one array as the node tooltip titles for from and to use the same code
    var locStats = storeNodeDisagg('from').concat(storeNodeDisagg('to'));


    //Get disagg for flows
    function getFlowDisagg(flowName,request) {
        result = sankeyDataDemo.filter(Obj => {
        return Obj.name === flowName
        })[0][request].toLocaleString();
        return result}
        

//Get disagg for node tooltip titles
//second argument to match col names
function getNodeDisagg(location,request) {
    result = locStats.filter(Obj => {
     return Obj.location === location
   })[0][request].toLocaleString();
   return result}



function spawnSankey(data) {
        // create a chart and set the data
        chart = anychart.sankey(data);

// set the width of nodes
chart.nodeWidth("40%");

chart.node().normal().labels().fontSize(12);
chart.node().labels().useHtml(true);
chart.node().labels().format(function() {
//replaces _s with spaces and gets rid of any country code (note applies to both inflow and outflow sides)
//not sure Moz implmentation used country codes - check this
  return "<span class='sankeyLabels'>" + this.name.replaceAll('_',' ').replaceAll('(MOZ)','') + "</span>"
});

chart.node().normal().fill(function() {
    //this is a filthy hack based on the fact I'm already adding _ to the names to force it to allow the same location
    //at both ends of the sankey. Need to figure out how to remove it from display.

    var fillColor = calculateColorForPlace(this.name)

    return(fillColor);

  });


// configure tooltips of flows
chart.flow().tooltip().useHtml(true).format(function() {

        selectedFlow = (this.getData('name'));

        var total = this.value.toLocaleString()
        var under18 = getFlowDisagg(selectedFlow,'total_under18')
        var over60 = getFlowDisagg(selectedFlow,'total_over60')
        var female = getFlowDisagg(selectedFlow,'total_female')
        var male = getFlowDisagg(selectedFlow,'total_male')


        

        //console.log(selectedFlow);
          return '<div class="grid-container">' + 
        '<div class="grid-item">' +
          '<span class="all">Total displaced flow: ' + total + '</span>' +
          '</br><span class="u18">Under 18s: '+ under18 + '</span>' +
          '</br><span class="o60">Over 60s: '+ over60 + '</span>' +
          '</br><span class="female">Female: '+ female + '</span>' +
          '</br><span class="male">Male: '+ male + '</span>' +
        '</div>' +
        '</div>'
          
        });
    
chart.flow().tooltip().titleFormat(function() {
        return "<div style='text-align:center'><span style='font-weight:bold'>"+this.getData("name").replaceAll('-',' to ')+"</span></div><hr>";

        
        });


    //make weight value permanently visible on flows
    // Enable labels for flows (links)
    chart.flow().labels()
        .enabled(true)  // Turn on labels
        .format("{%weight}")  // Show the weight value
        .position("center")  // Place label in the middle of the link
        .offsetY(function () {
            return -this.height / 2;  // Moves text down to the middle of the flow
        })
        .fontSize(12)  // Adjust font size
        .fontColor("#000")  // Set font color (black)
        .hAlign("center")  // Center align text
        .vAlign("middle");  // Vertically center the text




// configure tooltip titles of nodes
chart.node().tooltip().useHtml(true).titleFormat(function() {
        return "<div style='text-align:center'><span style='font-weight:bold'>" + this.name.replaceAll('_',' ') + "</span></br><span class='all'>Total movement: " + this.value.toLocaleString() + '</span>' +
        //add disagg
        "</br><span class='u18'>Under 18s: " + getNodeDisagg(this.name,'total_under18') + "</span> | <span class='o60'>Over 60s: " + getNodeDisagg(this.name,'total_over60') + "</span>" +
        "</br><span class='female'>Female: " + getNodeDisagg(this.name,'total_female') + "</span> | <span class='male'>Male: " + getNodeDisagg(this.name,'total_male') + "</span>" +
        "</div><hr>";
      });


// enable HTML-mode for node's tooltip and set formatter for it
chart
.node()
.tooltip()
//think repetiton of useHtml can be removed
.useHtml(true)
.format(function () {
  var tooltip = '<div class="grid-container"><div class="grid-item">';
  var i;
  var list;
  var income;
  var outcome;
  var conflict;
  
  //nodes with inflow
  if (this.income.length) {
    income = 0;
    list = '';
    for (i = 0; i < this.income.length; i++) {
      list +=
        '</br>- ' +
        this.income[i].name.replaceAll('_',' ') +
        ': <span class="all">' + this.income[i].value + '</span>' +
        //adding disagg (<18s only)
        " | <span class='u18'>"+getFlowDisagg(this.income[i].name+"-"+this.name.slice(0, -1).replaceAll('_',' '),'total_under18')+"</span>"
        //console.log(this.income[i].name+"-"+this.name.slice(0,-1))
        ;
      income += this.income[i].value;
    }
    tooltip += 'Displaced arrivals from:' + list + '</div>'
  }
  
  //nodes with outflow
  if (this.outcome.length) {
    outcome = 0;
    list = '';
    for (i = 0; i < this.outcome.length; i++) {
      list +=
        '</br>- ' +
        //remove underscores and and any Moz country codes (don't think we use them)
        this.outcome[i].name.replaceAll('_',' ').replaceAll(' (MOZ)','') +
        ':  <span class="all">' + this.outcome[i].value + '</span>' +
        //adding disagg (<18s only)
        " | <span class='u18'>"+getFlowDisagg(this.name+"-"+this.outcome[i].name.slice(0, -1).replaceAll('_',' '),'total_under18')+"</span>"

        ;
      outcome += this.outcome[i].value;
    }
    tooltip += 'Displaced departures to:' + list + '</div>' 
  }
  
  return tooltip;
});









function calculateColorForPlace(placeName) {
    //this is called once for each node

    // Check if currentProperties is empty, and choose the dataset accordingly
    let dataset;
    if (currentProperties.length === 0) {
        dataset = topFlows; // If currentProperties is empty, use topFlows
    } else {
        dataset = dataCollection; // If currentProperties is not empty, use dataCollection
    }

    // Initialize maxFlow variable
    let maxFlow = 0;

    // Check if the place is a destination (ends with '_')
    let isDestination = placeName.endsWith('_');

/*     maxFlow = dataset.reduce((max, record) => {
        if (isDestination) {
            // Find the max 'weight' where the place is listed in the "to" field
            return record.to === placeName ? Math.max(max, record.weight) : max;
        } else {
            // Find the max 'weight' where the place is listed in the "from" field
            return record.from === placeName ? Math.max(max, record.weight) : max;
        }
    }, 0);
 */
    //console.log(placeName+maxFlow);




    // 


    
/*     var placeNameClean = cleanName(placeName)
    var gridSet = getGridSelection(placeNameClean);
    var maxGridFlow = 0; // Initialize maxGridFlow to store the largest value

    if (isDestination) {
        for (let i in gridSet._layers) {
            let arrivals = gridSet._layers[i].feature.properties.total_arrivals;
            if (arrivals > maxGridFlow) {
                maxGridFlow = arrivals; // Update maxGridFlow if a larger value is found
            }
        }
    } else {
        for (let i in gridSet._layers) {
            let flowValue = gridSet._layers[i].feature.properties["to_" + placeNameClean];
            console.log(flowValue)
            if (flowValue > maxGridFlow) {
                maxGridFlow = flowValue; // Update maxGridFlow if a larger value is found
                
            }
        }
        console.log(placeName+maxGridFlow)
    } */
    

    //console.log(gridSet);
    


    //console.log("cleaned " + placeNameClean)


    var placeNameClean = cleanName(placeName);
    var gridSet = getGridSelection(placeNameClean);
    var maxGridFlow = 0; // Initialize maxGridFlow to store the largest value
    
    if (isDestination) {
        //console.log(placeName + " is red");
        for (let i in gridSet._layers) {
            let arrivals = gridSet._layers[i].feature.properties.total_arrivals;
            if (arrivals > maxGridFlow) {
                maxGridFlow = arrivals; // Update maxGridFlow if a larger value is found
            }
        }
        //!!console.log("red"+placeName+maxGridFlow)
    } else {
        //console.log(placeName + " is blue");
        for (let i in gridSet._layers) {
            let properties = gridSet._layers[i].feature.properties;
    
            if (currentProperties.length > 0) {
                // Check only specific locations in currentProperties
                currentProperties.forEach(destination => {
                    let flowValue = properties["to_" + destination];
                    if (flowValue > maxGridFlow) {
                        maxGridFlow = flowValue;
                    }
                });
            } else {
                // Check all "to_" fields
                for (let key in properties) {
                    if (key.startsWith("to_")) {
                        let flowValue = properties[key];
                        if (flowValue > maxGridFlow) {
                            maxGridFlow = flowValue;
                        }
                    }
                }
            }
        }
        //!!console.log("blue"+placeName+maxGridFlow)
    }





    //console.log(gridMaxValues);

        // Use the appropriate color scale based on whether it's a destination or origin
        let color = isDestination ? gridColorDefault(maxGridFlow) : gridColorDepartures(maxGridFlow);

        // Return both the total flow and the corresponding color
        return { color };
}




// Helper function to remove opacity and return solid RGB color
function removeOpacity(colorObj) {
    // Extract the color string from the object
    let rgbaColor = typeof colorObj === 'object' && colorObj.color ? colorObj.color : colorObj;

    // Check if rgbaColor is a string and contains 'rgba'
    if (typeof rgbaColor === 'string' && rgbaColor.includes('rgba')) {
        // Convert rgba to rgb by removing the last part (opacity)
        return rgbaColor.replace(/rgba?\((\d+), (\d+), (\d+), [\d.]+\)/, 'rgb($1, $2, $3)');
    }
    // If rgbaColor is not a string or doesn't contain 'rgba', return the original color
    return rgbaColor;
}

/* // Helper function to get the lightest color based on whether it's an origin or destination
function getHoveredColor(node) {
    let placeName = node

    if (placeName.endsWith('_')) {
        // If it's a destination, return the lightest color from gridColorDefault
        return removeOpacity(gridColorDefault(1001));  // The first color is for weight <= 10 in your scale
    } else {
        // If it's an origin, return the lightest color from gridColorDepartures
        return removeOpacity(gridColorDepartures(51));  // The first color is for weight <= 1 in your scale
    }
}

// Example of applying this in the chart configuration
chart.node().hovered().fill(function() {
    return anychart.color.darken(getHoveredColor(this.name)); // Use the helper to get the correct color
});
 */

 chart.node().hovered().fill(function() {
    
    var colour = calculateColorForPlace(this.name)

    var noOpacity = removeOpacity(colour)
    //console.log(noOpacity)

    return noOpacity; // Use the helper to get the correct color

    //this is a filthy hack based on the fact I'm already adding _ to the names to force it to allow the same location
    //at both ends of the sankey. Need to figure out how to remove it from display.



  });


//});

chart.flow().hovered().fill("#cd502d");

// set the container id
chart.container("sankeyContainer");

// initiate drawing the chart
chart.draw();

}


spawnSankey(sankeyData);



