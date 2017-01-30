/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl($rootScope, editableThemes, toastr, hazardService) {
  var vm = this;
  vm.hazards = [];

  hazardService.findAll().success(function(data) {
    vm.hazards = data.hazardEvents;
  }).error(function(err) {
    console.error("Fetching all hazards is failed!");
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
