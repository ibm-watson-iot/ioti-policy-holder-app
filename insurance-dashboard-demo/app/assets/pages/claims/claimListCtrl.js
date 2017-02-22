(function () {
'use strict';

angular.module('BlurAdmin.pages.claims').controller('ClaimListCtrl', ClaimListCtrl);

function ClaimListCtrl($timeout, baConfig, layoutPaths, claimService, cityLocationService) {
  var vm = this;
  var latlong;
  vm.claims = [];

  claimService.findAll().success(function(data) {
    vm.claims = data;
  }).error(function(err) {
    console.error("Fetching all claims is failed!");
  });

  cityLocationService.me().success(function(data) {
    latlong = data;

    claimService.findAll().success(function(data) {
      vm.claims = data;
      var cityClaimCount = {};
      _.each(vm.claims, function(claim) {
        var addressWords = claim.address.split(',');
        var city = addressWords[addressWords.length - 1].replace(/\s+/g, '').toLowerCase();
        if (city) {
          if (!cityClaimCount[city]) {
            cityClaimCount[city] = 0;
          }
          cityClaimCount[city] = cityClaimCount[city] + 1;
        }
      });

      // populate the map data
      var mapData = [];
      for (var city in cityClaimCount) {
        var mapDataEntry = {};
        mapDataEntry.name = city;
        mapDataEntry.value = cityClaimCount[city];
        mapDataEntry.code = city;
        mapDataEntry.color = baConfig.colors.primaryDark;
        mapData.push(mapDataEntry);
      }

      if (mapData.length > 0) {
        loadMap(mapData);
      }
    }).error(function(err) {
      console.error("Fetching all claims failed!");
    });
  }).error(function(err) {
    console.error("Fetching city locations failed!");
  });

  function loadMap(mapData) {
    var map;
    var minBulletSize = 3;
    var maxBulletSize = 10;
    var min = Infinity;
    var max = -Infinity;

    // get min and max values
    for (var i = 0; i < mapData.length; i++) {
      var value = mapData[i].value;
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }

    AmCharts.theme = AmCharts.themes.blur;
    map = new AmCharts.AmMap();

    map.areasSettings = {
      unlistedAreasColor: '#000000',
      unlistedAreasAlpha: 0.1
    };
    map.imagesSettings.balloonText = '<span style="font-size:14px;"><b>[[title]]</b>: [[value]]</span>';
    map.pathToImages = layoutPaths.images.amMap;

    var dataProvider = {
      mapVar: AmCharts.maps.worldLow,
      images: []
    };
    // it's better to use circle square to show difference between values, not a radius
    var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
    var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

    // create circle for each country
    for (var i = 0; i < mapData.length; i++) {
      var dataItem = mapData[i];
      var value = dataItem.value;
      // calculate size of a bubble
      var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;
      if (square < minSquare) {
        square = minSquare;
      }
      var size = Math.sqrt(square / (Math.PI * 2));
      var id = dataItem.code.toLowerCase().replace(/\s/g, '');;
      var latitude = latlong[id].lat;
      var longitude = latlong[id].lon;

      dataProvider.images.push({
        type: 'circle',
        width: size,
        height: size,
        color: dataItem.color,
        longitude: longitude,
        latitude: latitude,
        title: dataItem.name.capitalizeFirstLetter(),
        value: value
      });
    }

    map.dataProvider = dataProvider;
    map.export = {
      enabled: true
    };

    $timeout(function() {
      map.write('map-bubbles');
    }, 100);
  }

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

}

})();
