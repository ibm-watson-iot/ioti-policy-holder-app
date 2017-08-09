/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, $uibModal, editableThemes, toastr, shieldService, shieldActivationService) {
  var vm = this;
  vm.allShields = [];
  vm.userShields = [];
  vm.activeShields = {};
  var shieldActivations = [];
  var shieldToActivationMap = {};

  shieldService.findAll().success(function(data) {
    vm.allShields = data.items;

    shieldActivationService.findAll().success(function(data) {
      shieldActivations = data.items;

      _.each(shieldActivations, function(shieldActivation) {
        _.each(vm.allShields, function(shield) {
          if (shield._id === shieldActivation.shieldId) {
            if (!vm.activeShields[shield._id]) {
              vm.activeShields[shield._id] = true;
              vm.userShields.push(shield);
            }
          }
        });
        shieldToActivationMap[shieldActivation.shieldId] = shieldActivation;
      });

    }).error(function(err) {
      console.error("Fetching all shields was failed!");
    });

  }).error(function(err) {
    console.error("Fetching all shields has failed!");
  });

  vm.activate = function(shield) {
    var shieldActivation = {
      shieldId: shield._id,
      hazardDetectionOnCloud: true
    };
    shieldActivationService.save(shieldActivation).success(function(savedActivation) {
      vm.userShields.push(shield);
      vm.activeShields[shield._id] = true;
      shieldActivations.push(savedActivation);
      shieldToActivationMap[savedActivation.shieldId] = savedActivation;
      toastr.success(null, "Activating the shield was successful.");
    }).error(function(err) {
      console.error("Saving shieldActivation has failed!");
    });
  };

  vm.deactivate = function(shield) {
    var shieldActivation = shieldToActivationMap[shield._id];
    shieldActivationService.remove(shieldActivation._id).success(function() {
      delete vm.activeShields[shield._id];
      _.remove(vm.userShields, function(userShield) {
          return userShield._id === shield._id;
      });
      toastr.success(null, "Deactivating the shield was successful.");
    }).error(function(err) {
      console.error("Deleting shieldActivation has failed!");
    });
  };


  editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
  editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

}

})();
