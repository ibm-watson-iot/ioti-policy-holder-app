(function() {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardViewCtrl', HazardViewCtrl);

function HazardViewCtrl($stateParams, $filter, toastr, hazardService, shieldService, userService, claimService) {
  var vm = this;
  vm.hazard = {};

  if ($stateParams.hazardEventId) {
    hazardService.find($stateParams.hazardEventId).success(function(hazard) {
      vm.hazard = hazard;
      // TODO: remove this hack when we have proper timestamps.
      var date = new Date(vm.hazard.timestamp);
      vm.hazard.eventTime = date.getTime();
      vm.hazard.eventTimeStr = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();

      initializeLocationMap(hazard.username);

      shieldService.find(vm.hazard.shieldUUID).success(function(shield) {
        vm.shield = shield;
      });
    });
    claimService.findByHazardId($stateParams.hazardEventId).success(function(claims) {
      vm.claims = claims;
    }).error(function(err) {
      console.log("Failed to get the claim of the hazard!");
    });
  }

  vm.acknowledgeHazard = function(hazard) {
    hazard.ishandled = true;
    hazardService.updateAttribute(hazard, 'ishandled', true).success(function(data) {
      toastr.success("Acknowledged.");
    }).error(function(err) {
      toastr.error("Saving hazard is failed!", "Error");
    });
  };

  function initializeLocationMap(username) {
    // get user location
    userService.findAll(username).success(function(user) {
      var map;
      var address = user.address.street + ", " + user.address.zipcode
                    + " " + user.address.city + ", " + user.address.country;
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(-34.397, 150.644);
      var myOptions = {
        zoom: 14,
        center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("google-maps"), myOptions);
      if (geocoder) {
        geocoder.geocode({'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
              map.setCenter(results[0].geometry.location);
              var infowindow = new google.maps.InfoWindow(
                  {
                    content: '<b>' + address + '</b>',
                    size: new google.maps.Size(150, 50)
                  });
              var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: address
              });
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
              });
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
      }
    }).error(function(err) {
      console.log("Fetching user details failed, error:", err);
    });
  }
}

})();
