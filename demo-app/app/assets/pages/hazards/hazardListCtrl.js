/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl($rootScope, $scope, $interval, editableThemes, toastr, hazardService, shieldService) {
  var vm = this;
  vm.hazards = [];
  vm.isLoading = true;
  vm.uuidToShieldMap = {};

  function getHazards() {
    hazardService.findAll().success(function(data) {
      vm.isLoading = false;
      vm.hazards = data.hazardEvents;
      _.each(vm.hazards, function(hazard) {
        // TODO: remove this hack when we have proper timestamps.
        var date = new Date(hazard.timestamp);
        hazard.eventTime = date.getTime();
        hazard.eventTimeStr = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
      });
    }).error(function(err) {
      console.error("Fetching all hazards is failed!");
    });
  }

  getHazards();

  shieldService.findAll().success(function(data) {
    _.each(data.shields, function(shield) {
      vm.uuidToShieldMap[shield.UUID] = shield;
    });
  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  var refreshingHazards = $interval(function() {
    getHazards();
  }, 10000);

  $scope.$on('$destroy', function () {
    $interval.cancel(refreshingHazards);
  });

  vm.saveHazard = function(hazard) {
    hazardService.save(hazard).success(function(savedHazard) {
      _.merge(hazard, savedHazard);
      toastr.success(null, "Saving hazard is successful.");
    }).error(function(err) {
      console.error("Saving hazard is failed!");
      toastr.error("Saving hazard is failed!", "Error");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
