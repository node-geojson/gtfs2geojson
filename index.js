var parseCSV = require('dsv').csv.parse;

/**
 * Parse GTFS data given as a string and return a GeoJSON FeatureCollection
 * of features with LineString geometries.
 *
 * @param {string} gtfs csv content of shapes.txt
 * @returns {Object} geojson featurecollection
 */
function gtfs2geojson(gtfs) {
  var shapes = parseCSV(gtfs).reduce(function(memo, row) {
    memo[row.shape_id] = (memo[row.shape_id] || []).concat(row);
    return memo;
  }, {});
  return {
    type: 'FeatureCollection',
    features: Object.keys(shapes).map(function(id) {
      return {
        type: 'Feature',
        id: id,
        properties: {
          shape_id: id
        },
        geometry: {
          type: 'LineString',
          coordinates: shapes[id].sort(function(a, b) {
            return +a.shape_pt_sequence - b.shape_pt_sequence;
          }).map(function(coord) {
            return [
              parseFloat(coord.shape_pt_lon),
              parseFloat(coord.shape_pt_lat)
            ];
          })
        }
      };
    })
  };
}

module.exports = gtfs2geojson;
