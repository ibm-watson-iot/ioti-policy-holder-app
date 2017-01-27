/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, editableThemes, toastr, shieldService, shieldAssociationService) {
  var vm = this;
  vm.shields = [];

  shieldAssociationService.findAll($rootScope.loggedInUser.username).success(function(shieldAssociations) {
    vm.shieldAssociations = shieldAssociations;
  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  shieldService.findAll($rootScope.loggedInUser.username).success(function(shields) {
    vm.shields = shields;
  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  vm.saveShield = function(shield) {
    shieldService.save(shield).success(function(savedShield) {
      _.merge(shield, savedShield);
      toastr.success(null, "Saving shield is successful.");
    }).error(function(err) {
      console.error("Saving shield is failed!");
      toastr.error("Saving shield is failed!", "Error");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
