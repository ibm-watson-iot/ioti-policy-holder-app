(function () {
'use strict';

angular.module('BlurAdmin.pages.claims').controller('ClaimListCtrl', ClaimListCtrl);

function ClaimListCtrl(claimService) {
  var vm = this;
  vm.claims = [];

  claimService.findAll().success(function(data) {
    vm.claims = data;
  }).error(function(err) {
    console.error("Fetching all claims is failed!");
  });
}

})();
