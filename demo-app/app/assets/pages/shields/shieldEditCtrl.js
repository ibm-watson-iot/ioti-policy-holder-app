/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

function ShieldEditCtrl($state, $stateParams, toastr, uuid4, shieldService) {
  var vm = this;
  vm.shield = { };
  vm.actions = ["WaterLeakAction"];

  if($stateParams.shieldId && $stateParams.shieldId !== 'new') {
    shieldService.find($stateParams.shieldId).success(function(shield) {
      vm.shield = shield;
    });
  } else {
    vm.isNewShield = true;
    vm.shield = {
      image: "shieldWater",
      canBeDisabled: false,
      hazardDetectionOnCloud: true,
      services: [],
      shieldHazards: [],
      sensorType: "",
      shieldParameters: []
    };
  }

  vm.saveShield = function() {
    shieldService.save(vm.shield).success(function(savedShield) {
      _.merge(vm.shield, savedShield);
      toastr.success(null, "Saving shield is successful.");
      $state.go('main.shields');
    }).error(function(err) {
      toastr.error("Saving shield has failed!", "Error");
    });
  };

}

})();
