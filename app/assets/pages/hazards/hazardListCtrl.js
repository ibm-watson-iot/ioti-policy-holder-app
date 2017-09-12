/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl($rootScope, $scope, $interval, editableThemes, toastr,
                        hazardService, shieldService, webSocketService) {
  var vm = this;
  vm.hazards = [];
  vm.isLoading = true;
  vm.uuidToShieldMap = {};

  $scope.$watch("hazardListCtrlVm.currentPage", function() {
    vm.paginatedHazards = vm.hazards.slice((vm.currentPage-1)*vm.itemsPerPage, (vm.currentPage-1)*vm.itemsPerPage+vm.itemsPerPage);
  });

  function getHazards() {
    hazardService.findAll({descending: true}).then(function(res) {
      vm.isLoading = false;
      vm.hazards = res.data.items;
      vm.paginatedHazards = vm.hazards.slice(0, 10);
      vm.totalItems = res.data.totalItems;
      vm.currentPage = 1;
      vm.itemsPerPage = 10;
    }).catch(function(err) {
      console.error("Fetching all hazards has failed!");
    });
  }

  getHazards();

  shieldService.findAll().success(function(data) {
    _.each(data.items, function(shield) {
      vm.uuidToShieldMap[shield._id] = shield;
    });
  }).error(function(err) {
    console.error("Fetching all shields has failed!");
  });

  vm.saveHazard = function(hazard) {
    hazardService.save(hazard).success(function(savedHazard) {
      _.merge(hazard, savedHazard);
      toastr.success(null, "Saving hazard is successful.");
    }).error(function(err) {
      console.error("Saving hazard has failed!");
      toastr.error("Saving hazard has failed!", "Error");
    });
  };

  webSocketService.on('new-hazard', getHazards);


  $scope.$on('$destroy', function () {
    webSocketService.removeEventListener('new-hazard', getHazards);
  });


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
