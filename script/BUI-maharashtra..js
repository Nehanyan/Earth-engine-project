var Maharashtra = boundary.filter(ee.Filter.eq('ADM1_NAME','Maharashtra'))

// Load Landsat 7 surface reflectance dataset
var collection = ee.ImageCollection("LANDSAT/LE07/C02/T1_RT")
  .filterDate("2014-01-01", "2020-12-31")
  .filterBounds(Maharashtra.geometry());

// Define the function to calculate BUI
var calculateBUI = function(image) {
  var nir = image.select("B4");
  var mir = image.select("B5");
  var bui = nir.subtract(mir).divide(nir.add(mir)).rename("BUI");
  return image.addBands(bui);
};

// Map over the image collection to calculate BUI for each image
var buiCollection = collection.map(calculateBUI);

// Define a reducer to calculate monthly means
var reducer = ee.Reducer.mean().group({
  groupField: 1,
  groupName: 'month'
});

// Aggregate to monthly means
var monthlyMeans = ee.ImageCollection(
  // Map over each month from January 2014 to December 2020
  ee.List.sequence(0, 83).map(function(n) {
    // Define start and end dates for each month
    var start = ee.Date.fromYMD(2014, 1, 1).advance(n, "month");
    var end = start.advance(1, "month");
    
    // Filter image collection to images within the current month
    var filtered = buiCollection.filterDate(start, end);
    
    // Calculate mean BUI for the current month
    var meanBUI = filtered.select("BUI").mean().set("system:time_start", start.millis());
    
    return meanBUI;
})
)
.sort("system:time_start");

// Plot monthly means over time
var chart = ui.Chart.image.series({
  imageCollection: monthlyMeans,
  region: Maharashtra,
  reducer: ee.Reducer.mean(),
  scale: 200,
}).setOptions({
  title: "Monthly Build Up Index (BUI) for Maharashtra (2014-2020)",
  vAxis: {title: "BUI"},
  hAxis: {title: "Date", format: "MMM yyyy", gridlines: {count: 7}},
  lineWidth: 1,
  pointSize: 3,
});

print(chart);