var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var gtfs2geojson = require('../');

test('gtfs2geojson', function(t) {
  var result = gtfs2geojson(
    fs.readFileSync(path.join(__dirname, 'fixtures/sample.input'), 'utf8'));

  if (process.env.UPDATE) {
    fs.writeFileSync(path.join(__dirname, 'fixtures/sample.output.geojson'),
      JSON.stringify(result, null, 2));
  }

  t.deepEqual(result, JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sample.output.geojson'))));
  t.end();
});
