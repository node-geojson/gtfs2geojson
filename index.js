var parseCSV = require("dsv").csv.parse;

const gtfs2geojson = {
  /**
   * Parse GTFS shapes.txt data given as a string and return a GeoJSON FeatureCollection
   * of features with LineString geometries.
   *
   * @param {string} gtfs csv content of shapes.txt
   * @returns {Object} geojson featurecollection
   */
  lines: function (gtfs) {
    var shapes = parseCSV(gtfs).reduce(function (memo, row) {
      memo[row.shape_id] = (memo[row.shape_id] || []).concat(row);
      return memo;
    }, {});
    return {
      type: "FeatureCollection",
      features: Object.keys(shapes).map(function (id) {
        return {
          type: "Feature",
          id: id,
          properties: {
            shape_id: id,
          },
          geometry: {
            type: "LineString",
            coordinates: shapes[id]
              .sort(function (a, b) {
                return +a.shape_pt_sequence - b.shape_pt_sequence;
              })
              .map(function (coord) {
                return [
                  parseFloat(coord.shape_pt_lon),
                  parseFloat(coord.shape_pt_lat),
                ];
              }),
          },
        };
      }),
    };
  },

  routes: function (shapesInput, routesInput, tripsInput) {
    const shapes = parseCSV(shapesInput).reduce(function (memo, row) {
      memo[row.shape_id] = (memo[row.shape_id] || []).concat(row);
      return memo;
    }, {});

    const routes = parseCSV(routesInput);
    const trips = parseCSV(tripsInput);

    const tripFeatureCollection = Object.keys(shapes).map(function (id) {
      return {
        id: id,
        coordinates: shapes[id]
          .sort(function (a, b) {
            return +a.shape_pt_sequence - b.shape_pt_sequence;
          })
          .map(function (coord) {
            return [
              parseFloat(coord.shape_pt_lon),
              parseFloat(coord.shape_pt_lat),
            ];
          }),
      };
    });
    const routeFeaturesCollection = {
      type: "FeatureCollection",
      features: [],
    };
    for (const route of routes) {
      const filteredTrips = trips.filter(
        (trip) => trip.route_id === route.route_id,
      );
      // const shapeIds = filteredTrips.map(trip => trip.shape_id);
      const routeFeatures = tripFeatureCollection // .filter(feature => shapeIds.includes(feature.id))
        .map((feature) => feature.coordinates);
      routeFeaturesCollection.features.push({
        type: "Feature",
        id: route.route_id,
        properties: {
          ...route,
        },
        geometry: {
          type: "MultiLineString",
          coordinates: routeFeatures,
        },
      });
    }
    return routeFeaturesCollection;
  },

  /**
   * Parse GTFS stops.txt data given as a string and return a GeoJSON FeatureCollection
   * of features with Point geometries.
   *
   * @param {string} gtfs csv content of stops.txt
   * @returns {Object} geojson featurecollection
   *
   */

  stops: function (gtfs) {
    var stops = parseCSV(gtfs);
    return {
      type: "FeatureCollection",
      features: Object.keys(stops).map(function (id) {
        return {
          type: "Feature",
          id: stops[id].stop_id,
          properties: {
            stop_id: stops[id].stop_id,
            stop_name: stops[id].stop_name,
            stop_lon: parseFloat(stops[id].stop_lon),
            stop_lat: parseFloat(stops[id].stop_lat),
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(stops[id].stop_lon),
              parseFloat(stops[id].stop_lat),
            ],
          },
        };
      }),
    };
  },
};

module.exports = gtfs2geojson;
