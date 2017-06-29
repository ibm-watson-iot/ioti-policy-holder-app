/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldEditCtrl', ShieldEditCtrl);

function ShieldEditCtrl($state, $stateParams, toastr, uuid4, shieldService, shieldCodeService, actionService) {
  var vm = this;
  vm.shield = { };
  vm.shieldcodes = [];

  actionService.findAll().then(function (resp) {
    vm.actions = resp.data.items;
  });


  if($stateParams.shieldId && $stateParams.shieldId !== 'new') {
    shieldCodeService.findAll({shieldId: $stateParams.shieldId}).then(function (resp) {
      vm.shieldcodes = resp.data.items;
    });
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
    shieldService.save(vm.shield)
    .then(function(resp) {
      _.merge(vm.shield, resp.data);
      toastr.success('Saving shield was successful');
    })
    .catch(function(err) {
      toastr.error("Saving shield is failed!", "Error");
    });
  };

}

})();
