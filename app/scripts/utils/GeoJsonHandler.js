'use strict';

angular.module('BlurAdmin.utils').factory('geoJsonHandler', () => {

  function convertToGeoJson(address, latLng) {
    const geoJsonObject = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [latLng.lat(), latLng.lng()]
      },
      "properties": {
        "address": address
      }
    };

    return geoJsonObject;
  }

  return {
    prepareLocation: (address, callback) => {
      const geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({ 'address': address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
              callback(convertToGeoJson(address, results[0].geometry.location));
            } else {
              console.log("No results found");
              callback({});
            }
          } else {
            console.log(`Geocode was not successful for the following reason: ${status}`);
            callback({});
          }
        });
      } else {
        console.log("geocoder is undefined");
        callback({});
      }
    }
  };

});
