(function() {
  'use strict';

  angular.module('BlurAdmin.pages.claims').controller('ClaimAddCtrl', ClaimAddCtrl);

  function ClaimAddCtrl($state, $stateParams, toastr, uuid4, claimService) {
    var vm = this;
    vm.claim = {};

    if ($stateParams.username) {
      vm.claim = {
        username: $stateParams.username,
        damageDate: new Date(),
        damageTime: (new Date()).getTime()
      };

      claimService.findAll($stateParams.username).success(function(claims) {
        vm.claims = claims;
      }).error(function(err) {
        console.log("Failed to get claims history or user !");
      })
    }

    vm.saveClaim = function() {
      claimService.save(vm.claim).success(function(savedClaim) {
        _.merge(vm.claim, savedClaim);
        toastr.success(null, "Saving claim is successful.");
        $state.go('main.claims');
      }).error(function(err) {
        toastr.error("Saving claim is failed!", "Error");
      });
    };

  }

})();
