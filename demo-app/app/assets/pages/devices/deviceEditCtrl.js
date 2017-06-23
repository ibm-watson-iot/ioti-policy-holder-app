/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.devices').controller('DeviceEditCtrl', DeviceEditCtrl);

function DeviceEditCtrl($state, $stateParams, toastr, uuid4, deviceService) {
  var vm = this;
  vm.device = { };
  vm.actions = ["WaterLeakAction"];

  if($stateParams.deviceId && $stateParams.deviceId !== 'new') {
    deviceService.find($stateParams.deviceId).success(function(device) {
      vm.device = device;
    });
  } else {
    vm.isNewDevice = true;
    vm.device = {
      type: 'gateway'
    };
  }

  vm.saveDevice = function() {
    deviceService.save(vm.device).success(function(savedDevice) {
      _.merge(vm.device, savedDevice);
      toastr.success(null, "Saving device is successful.");
      $state.go('main.devices');
    }).error(function(err) {
      toastr.error("Saving device has failed!", "Error");
    });
  };

  vm.validateJson = function (key, errorKey) {
    if (!vm.device[key]) {
      vm[errorKey] = 'not valid json';
    } else {
      vm[errorKey] = '';
    }
  };

}

})();
