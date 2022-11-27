var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var gtfs2geojson = require('../');

test('#routes', function(t) {
  var result = gtfs2geojson.lines(path.join(__dirname, 'fixtures'), true);

  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, 'fixtures/routes.geojson'),
      JSON.stringify(result, null, 2));
  }

  t.deepEqual(result, JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/routes.geojson'))));
  t.end();
});

test('#shapes', function(t) {
  var result = gtfs2geojson.lines(path.join(__dirname, 'fixtures'));

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
