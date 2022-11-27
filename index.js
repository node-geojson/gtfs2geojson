var parseCSV = require('dsv').csv.parse;
var fs = require('fs');

const fileToString = (fileLoc) => fs
		.readFileSync(fileLoc)
		.toString();

const gtfs2geojson = {
  /**
 * Parse GTFS shapes.txt data given as a string and return a GeoJSON FeatureCollection
 * of features with LineString geometries.
 *
 * @param {string} gtfs csv content of shapes.txt
 * @returns {Object} geojson featurecollection
 */
  lines: function(gtfsLoc, joinRoutes = false) {
		const shapesInput = fileToString(`${gtfsLoc}/shapes.txt`);
		let routes;
		let trips;

		if(joinRoutes){
			routes = parseCSV(fileToString(`${gtfsLoc}/routes.txt`));
			trips = parseCSV(fileToString(`${gtfsLoc}/trips.txt`));
		}

    const shapes = parseCSV(shapesInput).reduce(function(memo, row) {
      memo[row.shape_id] = (memo[row.shape_id] || []).concat(row);
      return memo;
    }, {});
		
    const tripFeatureCollection =  {
      type: 'FeatureCollection',
      features: Object.keys(shapes).map(function(id) {
        return {
          type: 'Feature',
          id: id,
          properties: {
            shape_id: id,
          },
          geometry: {
            type: 'LineString',
            coordinates: shapes[id].sort(function(a, b) {
              return +a.shape_pt_sequence - b.shape_pt_sequence;
            }).map(function(coord) {
              return [
                parseFloat(coord.shape_pt_lon),
                parseFloat(coord.shape_pt_lat),
              ];
            })
          }
        };
      })
    };
		if(!joinRoutes){
			return tripFeatureCollection;
		}else{
			const routeFeaturesCollection = {
				type: 'FeatureCollection',
				features: [],
			};
			for(const route of routes){
				const filteredTrips = trips.filter(trip => trip.route_id === route.route_id);
				const shapeIds = filteredTrips.map(trip => trip.shape_id);
				const routeFeatures = tripFeatureCollection.features.filter(feature => shapeIds.includes(feature.properties.shape_id))
						.map(feature => feature.geometry.coordinates);
							routeFeaturesCollection.features.push({
									type: 'Feature',
									id: route.route_id,
									properties: {
										...route
									},
									geometry: {
										type: 'MultiLineString',
										coordinates: routeFeatures
									}
								
							});
			}
			return routeFeaturesCollection;
		}
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
};

module.exports = gtfs2geojson;
