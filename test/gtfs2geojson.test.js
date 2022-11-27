var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var gtfs2geojson = require('../');

test('#routes', function(t) {
  var shapesInput = fs.readFileSync(path.join(__dirname, 'fixtures/shapes.input'), 'utf8')
  var routesInput = fs.readFileSync(path.join(__dirname, 'fixtures/routes.input'), 'utf8')
  var tripsInput = fs.readFileSync(path.join(__dirname, 'fixtures/trips.input'), 'utf8')

  var result = gtfs2geojson.routes(shapesInput, routesInput, tripsInput);

  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, 'fixtures/routes.geojson'),
      JSON.stringify(result, null, 2));
  }

  t.deepEqual(result, JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/routes.geojson'))));
  t.end();
});

test('#shapes', function(t) {
  var result = gtfs2geojson.lines(fs.readFileSync(path.join(__dirname, 'fixtures/shapes.input'), 'utf8'));

  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, 'fixtures/shapes.geojson'),
      JSON.stringify(result, null, 2));
  }

  t.deepEqual(result, JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/shapes.geojson'))));
  t.end();
});

test('#stops', function(t) {
  var result = gtfs2geojson.stops(
    fs.readFileSync(path.join(__dirname, 'fixtures/stops.input'), 'utf8'));

  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, 'fixtures/stops.output.geojson'),
      JSON.stringify(result, null, 2));
  }

  t.deepEqual(result, JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/stops.output.geojson'))));
  t.end();
});
