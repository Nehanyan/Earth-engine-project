var Manipur = boundary.filter(ee.Filter.eq('ADM1_NAME','Manipur'))

// Load population density data
var popDensity = ee.ImageCollection("WorldPop/GP/100m/pop").select("population");

// Filter population density data to Manipur boundary
var popDensityManipur = popDensity.filterBounds(Manipur.geometry());

// Create a chart of population density in Manipur over time
var chart = ui.Chart.image.series({
  imageCollection: popDensityManipur,
  region: Manipur.geometry(),
  reducer: ee.Reducer.mean(),
  scale: 200,
  xProperty: 'system:time_start',
})
.setChartType('LineChart')
.setOptions({
  title: 'Population Density in Manipur (2000-2020)',
  vAxis: {title: 'Population Density (people/km²)'},
  hAxis: {title: 'Date', format: 'MMM yyyy', gridlines: {count: 7}},
  lineWidth: 1,
  pointSize: 3,
});

print(chart);



