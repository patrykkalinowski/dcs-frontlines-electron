const mgrs = require('mgrs')
// var map = require('./map')

module.exports = {
    receiveData: function(data) {
        data = JSON.parse(data)
        keys = Object.keys(data)

        for (key of keys) {
            var mgrs_string = data[key].mgrs_position.UTMZone + data[key].mgrs_position.MGRSDigraph + data[key].mgrs_position.Easting + data[key].mgrs_position.Northing
            
            var coords = mgrs.toPoint(mgrs_string)
            // map.addFeature(coords)

        }
    }
}