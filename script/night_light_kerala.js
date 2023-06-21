// Define the area of interest as a point (Kerala)
var kerala = boundary.filter(ee.Filter.eq('ADM1_NAME','Kerala'));

// Load the nighttime lights dataset
var nighttime = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG')
  .select('avg_rad')
  .filterDate('2014-01-01', '2021-12-01')
  .filterBounds(kerala.geometry());

// Create a function to add the year and month as properties to the image
var addYearMonth = function(image) {
  var year = ee.Date(image.get('system:time_start')).get('year');
  var month = ee.Date(image.get('system:time_start')).get('month');
  return image.set('year', year).set('month', month);
};

// Apply the addYearMonth function to each image in the collection
var nighttimeWithYearMonth = nighttime.map(addYearMonth);

// Create a chart showing the average nighttime lights by month
var chart = ui.Chart.image.seriesByRegion({
  imageCollection: nighttimeWithYearMonth,
  regions: kerala,
  reducer: ee.Reducer.mean(),
  band: 'avg_rad',
  scale: 30,
  xProperty: 'system:time_start',
}).setChartType('LineChart')
  .setOptions({
    title: 'Monthly Nighttime Lights in Kerala (2014-2021)',
    vAxis: {title: 'Average Radiance'},
    hAxis: {title: 'Month'},
    legend: {position: 'none'}
  });

// Add the chart to the map
Map.add(chart);