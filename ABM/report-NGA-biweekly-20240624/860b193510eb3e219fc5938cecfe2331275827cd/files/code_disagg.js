  anychart.onDocumentReady(function () {
    // create a bar chart
    var chart = anychart.bar();

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

      var series = chart.rangeBar(data);
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
    chart
      .legend()
      .enabled(true);

    // create a stacked bar chart from the multi-series bar chart
    chart.yScale().stackMode('value');

    // customize the settings of the axes
    chart
      .xAxis()
      .ticks(false);
    chart
      .xAxis()
      .title()
      .enabled(true)
      .text('Age groups')
      .padding([0, 0, 10, 0]);
    chart
      .xAxis()
      .labels()
      .fontSize(11)
      .fontColor('#474747')
      .padding([0, 10, 0, 0]);
    //chart.yScale().maximum(80);
    chart
      .yAxis(0)
      .labels()
      .format(function () {
        return Math.abs(this.value);
      });

    // create a line marker at 0
    chart
      .lineMarker()
      .value(0)
      .stroke('#CECECE');

    // customize the tooltip
    chart
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
    chart.palette(anychart.palettes.distinctColors().items(['#FDB827', '#1e8f89']));

	chart.background().fill(null);



    // set a container id for the chart
    chart.container('disaggContainer');

    // initiate chart drawing
    chart.draw();
  });