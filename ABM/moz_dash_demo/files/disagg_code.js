/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Disagg     /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

//automate it - switch both to this once done !!!!
//anychart.onDocumentReady(function () {

//get total number of displaced shown for percentages
    var totalDisplaced = 0;
for (var i = 0; i < topFlows.length; i++) {
    totalDisplaced += topFlows[i].weight;   
    }



// create data
var dataDisaggTest = anychart.data.set([
  ["January", 0.7, 6.1],
  ["February", 0.6, 6.3],
  ["March", 1.9, 8.5],
  ["April", 3.1, 10.8],
  ["May", 5.7, 14.4]
]);

var testData = ["June", 7.7, 16.4] 

//dataDisaggTest.append(testData)

var disaggDataCalc

/* function getDisaggfromFLows (sex, age) {
for (i in topFlows)





} */


/* function calculateDisaggTotals() {
    var records
    if (currentProperties.length > 0) {records = dataCollection} else {records = topFlows};
    return records.reduce((totals, record) => {
        // Accumulate totals for each male category
        totals.male_under18 += record.male_under18;
        totals.male_18to60 += record.male_18to60;
        totals.male_over60 += record.male_over60;
        // Accumulate totals for each female category
        totals.female_under18 += record.female_under18;
        totals.female_18to60 += record.female_18to60;
        totals.female_over60 += record.female_over60;
        return totals;
    }, {
        male_under18: 0,  // Initial total for male_under18
        male_18to60: 0,   // Initial total for male_18to60
        male_over60: 0,    // Initial total for male_over60
        female_under18: 0,  // Initial total for female_under18
        female_18to60: 0,   // Initial total for female_18to60
        female_over60: 0    // Initial total for female_over60
    });
}


//          { male_under18: 131.55, male_18to60: 175.4, male_over60: 131.55,
    //        female_under18: 131.55, female_18to60: 175.4, female_over60: 131.55 }


var testx

function transformDisaggTotals() {

    var disaggData = calculateDisaggTotals();
    testx = disaggData
    console.log(disaggData);

    var data = [];
    for (var i = 0; i < 3; i++) {
    
        data.push({
            x: disaggData[i][2],
            low: center,
            high: center + value,
            value: value,
            // add the calculated percentage value
            percentValue: percentValue
          });


          

    }

    console.log(data)

} */

/* function calculateTotals() {
    // Select the appropriate data source based on currentProperties
    const dataSource = currentProperties.length === 0 ? topFlows : dataCollection;

    // Initialize the result array
    const result = [
        [0, 0, "Over 60"],
        [0, 0, "18 to 60"],
        [0, 0, "Under 18"]
    ];

    // Iterate over the selected dataset
    dataSource.forEach(item => {
        // Sum the counts for each age category
        result[0][0] += item.male_over60;    // Male Over 60
        result[0][1] += item.female_over60;  // Female Over 60

        result[1][0] += item.male_18to60;    // Male 18 to 60
        result[1][1] += item.female_18to60;  // Female 18 to 60

        result[2][0] += item.male_under18;    // Male Under 18
        result[2][1] += item.female_under18;  // Female Under 18
    });

    return result;
} */


function calculateDisaggTotals() {
    //console.log("calculateDisaggTotals firing")
    // Select the appropriate data source based on currentProperties
    const dataSource = currentProperties.length === 0 ? topFlows : dataCollection;

//console.log(dataSource)

    // Initialize the result array
    const result = [
        [0, 0, "Over 60", 0, 0],   // Male total, Female total, Age group, Male percentage, Female percentage
        [0, 0, "18 to 60", 0, 0],
        [0, 0, "Under 18", 0, 0]
    ];

    // Initialize the total population weight sum
    let totalPopulationWeight = 0;

    // Iterate over the selected dataset to calculate totals and sum of all weights (male + female)
    dataSource.forEach(item => {
        // Sum the total weight for the current object (male and female combined for all categories)
        totalPopulationWeight += 
            (item.male_over60 + item.male_18to60 + item.male_under18) +
            (item.female_over60 + item.female_18to60 + item.female_under18);

        // Sum the counts for each age category
        result[0][0] += item.male_over60;    // Male Over 60
        result[0][1] += item.female_over60;  // Female Over 60

        result[1][0] += item.male_18to60;    // Male 18 to 60
        result[1][1] += item.female_18to60;  // Female 18 to 60

        result[2][0] += item.male_under18;   // Male Under 18
        result[2][1] += item.female_under18; // Female Under 18
    });

    // Round the totals to avoid floating-point precision issues
    result.forEach(category => {
        category[0] = parseFloat(category[0].toFixed(0)); // Round male total to 2 decimal places
        category[1] = parseFloat(category[1].toFixed(0)); // Round female total to 2 decimal places
    });

    // Now calculate the percentage for both males and females in each age group based on total population weight
    if (totalPopulationWeight > 0) {
        result[0][3] = ((result[0][0] / totalPopulationWeight) * 100).toFixed(2);  // Male Over 60 percentage
        result[0][4] = ((result[0][1] / totalPopulationWeight) * 100).toFixed(2); // Female Over 60 percentage

        result[1][3] = ((result[1][0] / totalPopulationWeight) * 100).toFixed(2);  // Male 18 to 60 percentage
        result[1][4] = ((result[1][1] / totalPopulationWeight) * 100).toFixed(2); // Female 18 to 60 percentage

        result[2][3] = ((result[2][0] / totalPopulationWeight) * 100).toFixed(2);  // Male Under 18 percentage
        result[2][4] = ((result[2][1] / totalPopulationWeight) * 100).toFixed(2); // Female Under 18 percentage
    }

//console.log(result)

    //console.log(result)
    return result;
}



// Declare chartDisagg globally to access and update it
var chartDisagg;

//these are held globally so anchart will update automatically on change, removing the need for 



function updatePopulationPyramidChart(data) {
    //console.log("updatePopulationPyramidChart firing")
    // Check if the chart already exists, if not, create it
    if (!chartDisagg) {
        chartDisagg = anychart.bar();
        
        // Customize chart appearance (initial setup)
        //chartDisagg.title('Population Pyramid by Age Group and Gender');
        chartDisagg.title().enabled(false);
        chartDisagg.yScale().stackMode('value'); // Stack male and female on the same axis
        chartDisagg.yAxis().title('Population'); // Label for the population axis
        chartDisagg.xAxis().title('Age Groups'); // Label for the age group axis

        // Enable chart legend
        chartDisagg.legend(true);

        // Center the 0 axis (line marker at 0)
        chartDisagg.lineMarker()
            .value(0)
            .stroke('#CECECE');

        // Set the container id and draw the chart initially
        chartDisagg.container('disaggContainer');
        chartDisagg.draw();
    }

    // Prepare data for the chart based on the input data (male and female totals)
    var maleData = [];
    var femaleData = [];

    data.forEach(function(item) {
        var ageGroup = item[2]; // Age group label ("Over 60", "18 to 60", "Under 18")
        var maleTotal = item[0]; // Male total
        var femaleTotal = item[1]; // Female total
        var malePerc = item[3];
        var femalePerc = item[4]; 

        
        // Push the male and female range bar data into separate series
        maleData.push({x: ageGroup, low: 0, high: maleTotal, perc: malePerc, number: maleTotal});
        femaleData.push({x: ageGroup, low: -femaleTotal, high: 0, perc: femalePerc, number: femaleTotal});

        //console.log(maleData)
    });

    // Update the data for the male and female series
    var dataSetMale = anychart.data.set(maleData);
    var dataSetFemale = anychart.data.set(femaleData);


    //console.log(dataSetMale)

    // Remove previous series if they exist, to avoid duplicate series
    chartDisagg.removeAllSeries();

    // Create new series for males and females with the updated data
    var femaleSeries = chartDisagg.rangeBar(dataSetFemale.mapAs({x: 'x', low: 'low', high: 'high'}))
        .name('Female')
        .stroke('null')
        .color('#FDB827'); // Customize the female color

    var maleSeries = chartDisagg.rangeBar(dataSetMale.mapAs({x: 'x', low: 'low', high: 'high'}))
        .name('Male')
        .stroke('null')
        .color('#1e8f89'); // Customize the male color

////////////////////////////tooltips

    // customize the tooltip
    chartDisagg
      .tooltip()
      .useHtml(true)
      .fontSize(12)
      .titleFormat(function () {
        return this.getData('x') + ' ' + this.seriesName;
      })
      .format(function () {
        //console.log(this.getData().high)
        return (
          '<h6 style="font-size:12px; font-weight:400; margin: 0.25rem 0;">Total displaced ' +
          '<b>' +
          this.getData('number') +
          '</b></h6>' +
          '<h6 style="font-size:12px; font-weight:400; margin: 0.25rem 0;">% of displaced pop. ' +
          '<b>' +
          this.getData('perc') +
          ' %</b></h6>'
        );
      }); 



      chartDisagg
      .yAxis(0)
      .labels()
      .format(function () {
        return Math.abs(this.value);
      });

      chartDisagg
      .xAxis()
      .ticks(false);



}



function disaggCall () {

// data from the calculateDisaggTotals function
var disaggData = calculateDisaggTotals();

//console.log(disaggData);

// Call the update function to initially render the chart
updatePopulationPyramidChart(disaggData);


}

disaggCall();



//big paste

function disAttempt() {
    // create a bar chart
    var DISchart = anychart.bar();
    var disaggData = calculateDisaggTotals();
	//WL - find grand total of displaced for generating %s
	var totalDisplaced = 0;
	for (var i = 0; i < disaggData.length; i++) {
	totalDisplaced += disaggData[i][0] + disaggData[i][1];	
	}

    // configure a function to create series
    var createSeries = function (columnNumber, name) {
      var data = [];
      for (var i = 0; i < disaggData.length; i++) {
        // calculate percentages for the tooltip
        var percentValue;
        var val = disaggData[i][columnNumber] * 100;
        percentValue =
            val / totalDisplaced;
        percentValue = percentValue.toFixed(2);

        var value = disaggData[i][columnNumber];
        var center = 0;
        if (name === 'Male') {
          data.push({
            x: disaggData[i][2],
            low: center,
            high: center + value,
            value: value,
            // add the calculated percentage value
            percentValue: percentValue
          });
        } else {
          data.push({
            x: disaggData[i][2],
            low: -center,
            high: -center - value,
            value: value,
            // add the calculated percentage value
            percentValue: percentValue
          });
        }
      }

      var series = DISchart.rangeBar(data);
      series.name(name).stroke('null').selectionMode('none');
    };

    // create series
    createSeries(0, 'Female');
    createSeries(1, 'Male');

/*     // set the chart title
    chart
      .title()
      .enabled(true)
      .text('Disaggregation of displaced population by age and sex'); */

    // enable the chart legend
    DISchart
      .legend()
      .enabled(true);

    // create a stacked bar chart from the multi-series bar chart
    DISchart.yScale().stackMode('value');

    // customize the settings of the axes
    DISchart
      .xAxis()
      .ticks(false);
      DISchart
      .xAxis()
      .title()
      .enabled(true)
      .text('Age groups')
      .padding([0, 0, 10, 0]);
      DISchart
      .xAxis()
      .labels()
      .fontSize(11)
      .fontColor('#474747')
      .padding([0, 10, 0, 0]);
    //chart.yScale().maximum(80);
    DISchart
      .yAxis(0)
      .labels()
      .format(function () {
        return Math.abs(this.value);
      });

    // create a line marker at 0
    DISchart
      .lineMarker()
      .value(0)
      .stroke('#CECECE');

    // customize the tooltip
    DISchart
      .tooltip()
      .useHtml(true)
      .fontSize(12)
      .titleFormat(function () {
        return this.getData('x') + ' ' + this.seriesName;
      })
      .format(function () {
        return (
          '<h6 style="font-size:12px; font-weight:400; margin: 0.25rem 0;">Total displaced ' +
          '<b>' +
          this.getData('value') +
          '</b></h6>' +
          '<h6 style="font-size:12px; font-weight:400; margin: 0.25rem 0;">% of displaced pop. ' +
          '<b>' +
          this.getData('percentValue') +
          ' %</b></h6>'
        );
      });

    // set a custom color palette
    DISchart.palette(anychart.palettes.distinctColors().items(['#FDB827', '#1e8f89']));

	DISchart.background().fill(null);



    // set a container id for the chart
    DISchart.container('disaggContainer');

    // initiate chart drawing
    DISchart.draw();
  }


//end




function updateDisaggAll () {



};


//create disagg data from flow data

/* function updateSankeyAll () {
    
    if (currentProperties.length >0) {
    
        $('#noFlows').removeClass("invisible");
        var dataCollection = [];
    
        for (i in currentProperties) {
    
        var filteredData = getFlowsForAdmin(currentProperties[i]);
    
        //spread operator breaks the array up to add it
        dataCollection.push(...filteredData);
    
        }
    
        if (dataCollection.length > 0) {
                $('#noFlows').addClass("invisible");
            sankeyData.data(dataCollection);
        }
    
    
    } else {
        $('#noFlows').addClass("invisible");
        sankeyData.data(topFlows);
    
    }
    
    }; */



function spawnDisagg(data) {
    // create a bar chart
    var chartDis = anychart.bar();

// create a range bar series and set the data
    var series = chartDis.rangeBar(dataDisaggTest);

    // set a container id for the chart
    chartDis.container('disaggContainer');

    // initiate chart drawing
    chartDis.draw();

};


