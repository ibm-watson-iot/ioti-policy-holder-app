/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards').controller('HazardListCtrl', HazardListCtrl);

function HazardListCtrl(hazardService) {
  var vm = this;
  vm.hazards = [];

  hazardService.findAll().success(function(data) {
    vm.hazards = data.hazardEvents;
  }).error(function(err) {
    console.error("Fetching all hazards is failed!");
  });
}

})();
