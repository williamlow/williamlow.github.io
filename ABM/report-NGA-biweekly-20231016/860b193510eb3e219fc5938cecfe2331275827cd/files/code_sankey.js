//Initially added a function into the sankey anychart js file to call this function when the focus node or link changed
//Since I moved the graphs into the tooltips there's no need for it (or jquery)
//function callChart(chart) {
//    console.log(chart);
//	$('#graphUpper').html('<img src="Locations/Overall/'+chart+'.png"/>')
//	$('#graphLower').html('<img src="Locations/Overall/'+chart+'.png"/>')
//}

//https://stackoverflow.com/questions/52720034/sum-similar-keys-in-an-array-of-objects-in-javascript
//adjusted solution to function called with 'from' or 'to' strong to create array of locations and total flows/disagg
function storeNodeDisagg(direction) {
var keys = ['weight', 'male', 'female', 'under5', '5to17', 'under18','18plus'];
var stats = Object.values(sankeyData.reduce((result, object) => {
        result[object[direction]] = result[object[direction]] || { location: object[direction] };
        keys.forEach(key => result[object[direction]][key] = (result[object[direction]][key] || 0) + object[key]);
        return result;
    }, Object.create(null)));
return stats;
}

//actually from and to need to be combined into one array as the node tooltip titles for from and to use the same code
var locStats = storeNodeDisagg('from').concat(storeNodeDisagg('to'));



// create a chart and set the data
var chart = anychart.sankey(sankeyData);

// set the width of nodes
chart.nodeWidth("45%");

chart.node().normal().labels().fontSize(12);
chart.node().labels().useHtml(true);
chart.node().labels().format(function() {
//replaces _s with spaces and gets rid of any Nigeria country codes (note applies to both inflow and outflow sides)
  return "<span style='font-weight:bold; color: black'>" + this.name.replaceAll('_',' ').replaceAll('(NGA)','') + "</span>"
});


chart.flow().normal().labels().fontColor('black');


    // configure tooltips of flows
	chart.flow().tooltip().useHtml(true).format(function() {
	
	selectedFlow = (this.getData('name'));
	//console.log(selectedFlow);
      return '<div class="grid-container">' + 
	'<div class="grid-item">' +
	  '<span class="all">Total displaced flow: ' + this.value.toLocaleString() + '</span>' +
	  '</br><span class="u18">Under 18s: '+getFlowDisagg(selectedFlow,'under18') + '</span>' +
	  '</br><span class="u5">Under 5s: '+getFlowDisagg(selectedFlow,'under5') + '</span>' +
	  '</br><span class="female">Female: '+getFlowDisagg(selectedFlow,'female') + '</span>' +
	  '</br><span class="male">Male: '+getFlowDisagg(selectedFlow,'male') + '</span>' +
	'</div>' +
	'<div class="grid-item gridGraph"><figure><img src="plots/sankey/flow/overall/'+ selectedFlow +'.png"/><figcaption>Daily flow during simulation</figcaption></figure></div>' +
	'<div class="grid-item gridGraph"><figure><img src="plots/sankey/flow/age/'+ selectedFlow +'.png"/><figcaption>% daily share by age</figcaption></figure></div>' +
	'<div class="grid-item gridGraph"><figure><img src="plots/sankey/flow/gender/'+ selectedFlow +'.png"/><figcaption>% daily share by sex</figcaption></figure></div>' +
	'</div>'
	  
    });

	chart.flow().tooltip().titleFormat(function() {
	return "<div style='text-align:center'><span style='font-weight:bold'>"+this.getData("full_name")+"</span></div><hr>";
	});

	

//Get disagg for node tooltip titles
//second argument to match col names
function getNodeDisagg(location,request) {
 result = locStats.filter(Obj => {
  return Obj.location === location
})[0][request].toLocaleString();
return result}


    // configure tooltip titles of nodes
    chart.node().tooltip().titleFormat(function() {
      return "<div style='text-align:center'><span style='font-weight:bold'>" + this.name.replaceAll('_',' ') + "</span></br><span class='all'>Total flow: " + this.value.toLocaleString() + '</span>' +
	  //add disagg
	  "</br><span class='u18'>Under 18s: " + getNodeDisagg(this.name,'under18') + "</span> | <span class='u5'>Under 5s: " + getNodeDisagg(this.name,'under5') + "</span>" +
	  "</br><span class='female'>Female: " + getNodeDisagg(this.name,'female') + "</span> | <span class='male'>Male: " + getNodeDisagg(this.name,'male') + "</span>" +
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
				" | <span class='u18'>"+getFlowDisagg(this.income[i].name+"-"+this.name.slice(0, -6),'under18')+"</span>"
				//console.log(this.income[i].name+"-"+this.name.slice(0, -6))
				;
              income += this.income[i].value;
            }
            tooltip += 'Displaced arrivals:' + list + '</div>'+
			'<div class="grid-item gridGraph">' +
			//slice removes the country code but leaves a single space to differentiate the inflow nodes from the outflow to avoid error
			//ie. 'name' vs 'name '
			//check this above comment - removing trailing space too for graph location
			'<figure><img src="plots/sankey/in/overall/'+this.name.slice(0, -6) +'.png"/><figcaption>Daily arrivals during simulation</figcaption></figure></div>' +
			'<div class="grid-item gridGraph"><figure><img src="plots/sankey/in/age/'+this.name.slice(0, -6) +'.png"/><figcaption>% daily share by age</figcaption></figure></div>' +
			'<div class="grid-item gridGraph"><figure><img src="plots/sankey/in/gender/'+this.name.slice(0, -6) +'.png"/><figcaption>% daily share by sex</figcaption></figure></div>' +
			'</div>';
          }
		  
		  //nodes with outflow
          if (this.outcome.length) {
            outcome = 0;
            list = '';
            for (i = 0; i < this.outcome.length; i++) {
              list +=
                '</br>- ' +
				//remove underscores and and Nigeria country codes
                this.outcome[i].name.replaceAll('_',' ').replaceAll(' (NGA)','') +
                ':  <span class="all">' + this.outcome[i].value + '</span>' +
				//adding disagg (<18s only)
				" | <span class='u18'>"+getFlowDisagg(this.name+"-"+this.outcome[i].name.slice(0, -6),'under18')+"</span>"
				;
              outcome += this.outcome[i].value;
			  //console.log(this.name+"-"+this.outcome[i].name.slice(0, -6))
			  //console.log(this.outcome[i])
            }
			//console.log('<img src="plots/sankey/out/total/'+this.name+'.png"/>');
            tooltip += 'Displaced departures:' + list + '</div>' +
			'<div class="grid-item gridGraph">' +
			'</br><figure><img src="plots/sankey/out/overall/'+this.name+'.png"/><figcaption>Daily departures during simulation</figcaption></figure></div>' +
			'<div class="grid-item gridGraph"><figure><img src="plots/sankey/out/age/'+this.name+'.png"/><figcaption>% daily share by age</figcaption></figure></div>' +
			'<div class="grid-item gridGraph"><figure><img src="plots/sankey/out/gender/'+this.name+'.png"/><figcaption>% daily share by sex</figcaption></figure></div>' +
			'</div>';
          }
		  
          return tooltip;
        });


chart.background().fill(null);

// set the container id
chart.container("sankeyContainer");

// initiate drawing the chart
chart.draw();


//Get disagg for flows
function getFlowDisagg(flowName,request) {
result = sankeyData.filter(Obj => {
return Obj.name === flowName
})[0][request].toLocaleString();
return result}