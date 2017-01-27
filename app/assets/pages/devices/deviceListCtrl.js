/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.devices').controller('DeviceListCtrl', DeviceListCtrl);

function DeviceListCtrl($rootScope, editableThemes, toastr, deviceService) {
  var vm = this;
  vm.devices = [];

  deviceService.findAll($rootScope.loggedInUser.username).success(function(devices) {
    vm.devices = devices;
  }).error(function(err) {
    console.error("Fetching all devices is failed!");
  });

  vm.saveDevice = function(device) {
    deviceService.save(device).success(function(savedDevice) {
      _.merge(device, savedDevice);
      toastr.success(null, "Saving device is successful.");
    }).error(function(err) {
      console.error("Saving device is failed!");
      toastr.error("Saving device is failed!", "Error");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
