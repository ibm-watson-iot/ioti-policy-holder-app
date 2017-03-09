/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl($scope, $timeout, $interval, baConfig, layoutPaths, toastr,
  hazardService, shieldService, userService, cityLocationService) {

  var vm = this;
  var latlong;
  vm.hazards = [];
  vm.isLoading = true;
  vm.uuidToShieldMap = {};

  shieldService.findAll().success(function(data) {
    _.each(data.shields, function(shield) {
      vm.uuidToShieldMap[shield.UUID] = shield;
    });
  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  vm.acknowledgeHazard = function(hazard) {
    hazard.ishandled = true;
    hazardService.updateAttribute(hazard, 'ishandled', true).success(function(data) {
      toastr.success("Acknowledged.");
    }).error(function(err) {
      toastr.error("Saving hazard is failed!", "Error");
    });
  };

  function getHazards() {
    // get all hazards and find hazard city
    hazardService.findAll().success(function(data) {
      vm.isLoading = false;
      vm.hazards = data.hazardEvents;
      var cityHazardCount = {};
      _.each(vm.hazards, function(hazard) {
        // TODO: remove this hack when we have proper timestamps.
        var date = new Date(hazard.timestamp);
        hazard.eventTime = date.getTime();
        hazard.eventTimeStr = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
        var userInfo = vm.userMap[hazard.username];
        if (userInfo) {
          if (!cityHazardCount[userInfo.cityId]) {
            cityHazardCount[userInfo.cityId] = 0;
          }
          cityHazardCount[userInfo.cityId] = cityHazardCount[userInfo.cityId] + 1;
        } else {
          vm.userMap[hazard.username] = {
            customer: '-',
            cityName: '-'
          };
        }
      });
      // populate the map data
      var mapData = [];
      for (var city in cityHazardCount) {
        var mapDataEntry = {};
        mapDataEntry.name = city;
        mapDataEntry.value = cityHazardCount[city];
        mapDataEntry.code = city;
        mapDataEntry.color = baConfig.colors.primaryDark;
        mapData.push(mapDataEntry);
      }

      if (mapData.length > 0) {
        loadMap(mapData);
      }
    }).error(function(err) {
      console.error("Fetching all hazards failed!");
    });
  }

  cityLocationService.me().success(function(data) {
    latlong = data;

    // get all users and cash user location
    userService.findAll().success(function(data) {
      var allUsers = data.users;
      vm.userMap = {};
      _.each(allUsers, function(user) {
        if (!user.address) {
          console.warn('user ' + user.username + ' does not have an address');
        }
        var city = user.address.city;
        vm.userMap[user.username] = {
          customer: user.fullname,
          cityName: city,
          cityId: city.replace(/\s+/g, '').toLowerCase()
        }
      });

      getHazards();

    }).error(function(err) {
      console.error("Fetching all users failed!");
    });
  }).error(function(err) {
    console.error("Fetching city locations failed!");
  });

  var refreshingHazards = $interval(function() {
    getHazards();
  }, 10000);

  $scope.$on('$destroy', function () {
    $interval.cancel(refreshingHazards);
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

    // build map
    AmCharts.theme = AmCharts.themes.blur;
    map = new AmCharts.AmMap();

    //map.addTitle('Hazards ', 14);
    //map.addTitle('source: Gapminder', 11);
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
