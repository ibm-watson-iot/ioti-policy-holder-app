/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

function ShieldEditCtrl($state, toastr, uuid4, shieldService) {
  var vm = this;
  vm.newShield = {
    uuid: uuid4.generate(),
    image: "shieldWater",
    services: [],
    shieldHazards: [],
    sensorType: "",
    shieldParameters: []
  };

  vm.saveShield = function() {
    shieldService.save(vm.newShield).success(function(savedShield) {
      _.merge(vm.newShield, savedShield);
      toastr.success(null, "Saving shield is successful.");
      $state.go('main.shields');
    }).error(function(err) {
      toastr.error("Saving shield is failed!", "Error");
    });
  };

}

})();
