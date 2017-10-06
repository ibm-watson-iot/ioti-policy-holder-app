(function() {
  'use strict';

  angular.module('BlurAdmin.pages.hazards').controller('HazardViewCtrl', HazardViewCtrl);

  function HazardViewCtrl($stateParams, $filter, toastr, hazardService, shieldService, gmapsHandler) {
    const vm = this;
    vm.hazard = {};

    if ($stateParams.hazardEventId) {
      hazardService.find($stateParams.hazardEventId).success((hazard) => {
        vm.hazard = hazard;
        showInMap(hazard);
        shieldService.find(vm.hazard.shieldId).success((shield) => {
          vm.shield = shield;
        });
      });
    }

    const showInMap = (hazard) => {
      gmapsHandler.initGmaps();
      if (hazard.locations) {
        hazard.locations.forEach((location) => {
          if (location.geometry && location.geometry.coordinates) {
            gmapsHandler.showInMap({
              type: 'latLng',
              latLng: {
                lat: location.geometry.coordinates[0],
                lng: location.geometry.coordinates[1]
              }
            });
          }
        });
      }
    };

    vm.acknowledgeHazard = (hazard) => {
      hazard.ishandled = true;
      hazardService.updatePartial(hazard._id, { ishandled: true }).success((data) => {
        toastr.success("Acknowledged.");
      }).error(err => toastr.error("Saving hazard has failed!", "Error"));
    };
  }

})();
