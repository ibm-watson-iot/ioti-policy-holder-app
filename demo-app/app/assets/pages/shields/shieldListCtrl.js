/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.shields').controller('ShieldListCtrl', ShieldListCtrl);

function ShieldListCtrl($rootScope, $uibModal, editableThemes, toastr, shieldService, shieldAssociationService) {
  var vm = this;
  vm.allShields = [];
  vm.userShields = [];
  vm.activeShields = {};
  var shieldAssociations = [];
  var shieldToAssociationMap = {};

  shieldService.findAll().success(function(data) {
    vm.allShields = data.shields;

    shieldAssociationService.findAll($rootScope.loggedInUser.username).success(function(data) {
      shieldAssociations = data.shieldassociations;

      _.each(shieldAssociations, function(shieldAssociation) {
        _.each(vm.allShields, function(shield) {
          if (shield.UUID === shieldAssociation.shieldUUID) {
            vm.userShields.push(shield);
            vm.activeShields[shield.UUID] = true;
          }
        });
        shieldToAssociationMap[shieldAssociation.shieldUUID] = shieldAssociation;
      });

    }).error(function(err) {
      console.error("Fetching all shields is failed!");
    });

  }).error(function(err) {
    console.error("Fetching all shields is failed!");
  });

  vm.activate = function(shield) {
    var shieldAssociation = {
      shieldUUID: shield.UUID,
      username: $rootScope.loggedInUser.username,
      hazardDetectionOnCloud: true
    };
    shieldAssociationService.save(shieldAssociation).success(function(savedAssociation) {
      shieldAssociation._id = savedAssociation.id;
      vm.userShields.push(shield);
      vm.activeShields[shield.UUID] = true;
      shieldAssociations.push(savedAssociation);
      shieldToAssociationMap[shieldAssociation.shieldUUID] = shieldAssociation;
      toastr.success(null, "Activating the shield is successful.");
    }).error(function(err) {
      console.error("Saving shieldassociation is failed!");
    });
  };

  vm.deactivate = function(shield) {
    var shieldAssociation = shieldToAssociationMap[shield.UUID];
    shieldAssociationService.remove(shieldAssociation._id).success(function(savedAssociation) {
      delete vm.activeShields[shield.UUID];
      _.remove(vm.userShields, function(userShield) {
          return userShield.UUID === shield.UUID;
      });
      toastr.success(null, "Deactivating the shield is successful.");
    }).error(function(err) {
      console.error("Deleting shieldassociation is failed!");
    });
  };

  vm.deleteShield = function(shield) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'pages/shields/shield-delete.html',
      controller: 'ShieldDeleteCtrl',
      size: 'sm',
      resolve: {
        shield: function () {
          return shield;
        }
      }
    });
    modalInstance.result.then(function(shieldToDelete) {
      shieldService.remove(shieldToDelete._id).success(function(data) {
        delete vm.activeShields[shield.UUID];
        _.remove(vm.allShields, function(shield) {
            return shield.UUID === shieldToDelete.UUID;
        });
        _.remove(vm.userShields, function(userShield) {
            return userShield.UUID === shieldToDelete.UUID;
        });
        toastr.success(null, "Deleting the shield is successful.");
      }).error(function(err) {
        console.error("Deleting the shield is failed!");
      });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

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
