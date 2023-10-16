    anychart.onDocumentReady(function () {
      // create data set on our data
      var lineDataSet = anychart.data.set(lineData);

      // map data for the first series, take x from the zero column and value from the first column of data set
      var firstSeriesData = lineDataSet.mapAs({ x: 0, value: 3 });

      // create line chart
      var chart = anychart.line();

      // turn on chart animation
      chart.animation(true);

      // set chart padding
      chart.padding([10, 20, 5, 20]);

      // turn on the crosshair
      chart.crosshair().enabled(true).yLabel(false).yStroke(null);

      
	  var tooltip = chart.tooltip();
      tooltip.positionMode('point');
	  tooltip.titleFormat("Day {%x} of simulation");

      // set chart title text settings
      //chart.title(
      //  'Cumulative displaced population'
      //);

      // set yAxis title
      chart.yAxis().title('Displaced individuals');
      chart.xAxis().labels().padding(5);

      // create first series with mapped data
      var firstSeries = chart.line(firstSeriesData);
      firstSeries.name('Total displaced');
      firstSeries.hovered().markers().enabled(true).type('circle').size(4);
      firstSeries
	    .stroke('2 var(--main-color)')
        .tooltip()
        .position('right')
        .anchor('left-center')
        .offsetX(5)
        .offsetY(5);

      // turn the legend on
      //chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);



	chart.background().fill(null);

      // set container id for the chart
      chart.container('lineContainer');
      // initiate chart drawing
      chart.draw();
    });