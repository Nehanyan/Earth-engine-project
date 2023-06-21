

var Maharashtra = boundary.filter(ee.Filter.eq('ADM1_NAME','Maharashtra'))

// Load population density data
var popDensity = ee.ImageCollection("WorldPop/GP/100m/pop").select("population");

// Filter population density data to Maharashtra boundary
var popDensityMaharashtra = popDensity.filterBounds(Maharashtra.geometry());

// Create a chart of population density in Maharashtra over time
var chart = ui.Chart.image.series({
  imageCollection: popDensityMaharashtra,
  region: Maharashtra.geometry(),
  reducer: ee.Reducer.mean(),
  scale: 200,
  xProperty: 'system:time_start',
})
.setChartType('LineChart')
.setOptions({
  title: 'Population Density in Maharashtra (2000-2020)',
  vAxis: {title: 'Population Density (people/km²)'},
  hAxis: {title: 'Date', format: 'MMM yyyy', gridlines: {count: 7}},
  lineWidth: 1,
  pointSize: 3,
});

print(chart);