var parseCSV = require('dsv').csv.parse;


var gtfs2geojson = {
  /**
 * Parse GTFS shapes.txt data given as a string and return a GeoJSON FeatureCollection
 * of features with LineString geometries.
 *
 * @param {string} gtfs csv content of shapes.txt
 * @returns {Object} geojson featurecollection
 */
  lines: function(gtfs) {
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
  },

  /**
 * Parse GTFS stops.txt data given as a string and return a GeoJSON FeatureCollection
 * of features with Point geometries.
 *
 * @param {string} gtfs csv content of stops.txt
 * @returns {Object} geojson featurecollection
 *
 */

  stops: function(gtfs) {
    var stops = parseCSV(gtfs)
    return {
      type: 'FeatureCollection',
      features: Object.keys(stops).map(function(id) {
        return {
          type: 'Feature',
          id: stops[id].stop_id,
          properties: {
            stop_id: stops[id].stop_id,
            stop_name: stops[id].stop_name
          },
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(stops[id].stop_lon),
              parseFloat(stops[id].stop_lat)
            ]
          }
        };
      })
    };
  }
}

module.exports = gtfs2geojson;
