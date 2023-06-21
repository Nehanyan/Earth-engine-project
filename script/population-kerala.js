var Kerala = boundary.filter(ee.Filter.eq('ADM1_NAME','Kerala'))

// Load population density data
var popDensity = ee.ImageCollection("WorldPop/GP/100m/pop").select("population");

// Filter population density data to Kerala boundary
var popDensityKerala = popDensity.filterBounds(Kerala.geometry());

// Create a chart of population density in Kerala over time
var chart = ui.Chart.image.series({
  imageCollection: popDensityKerala,
  region: Kerala.geometry(),
  reducer: ee.Reducer.mean(),
  scale: 200,
  xProperty: 'system:time_start',
})
.setChartType('LineChart')
.setOptions({
  title: 'Population Density in Kerala (2000-2020)',
  vAxis: {title: 'Population Density (people/km²)'},
  hAxis: {title: 'Date', format: 'MMM yyyy', gridlines: {count: 7}},
  lineWidth: 1,
  pointSize: 3,
});

print(chart);

