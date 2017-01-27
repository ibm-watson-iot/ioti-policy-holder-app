/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

function ShieldEditCtrl(toastr, shieldService) {
  var vm = this;
  vm.newShield = {
    dieselCost: 0,
    costs: []
  };

  vm.saveShield = function() {
    vm.newShield.shieldingDate = Date.now();

    shieldService.save(vm.newShield).success(function(savedShield) {
      _.merge(vm.newShield, savedShield);
      toastr.success(null, "Saving shield is successful.");
    }).error(function(err) {
      console.error("Saving shield is failed!");
      toastr.error("Saving shield is failed!", "Error");
    });
  };

}

})();
