/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.theme.components').controller('MsgCenterCtrl', MsgCenterCtrl);

function MsgCenterCtrl($scope, $filter, $interval, toastr, hazardService, webSocketService) {

  function getHazards() {
    hazardService.findAll().success(function(data) {
      // TODO: remove this hack when we have proper timestamps.
      _.each(data.items, function(hazard) {
        if (hazard.ishandled === 'true') {
          hazard.ishandled = true;
        }
      });
      data.items = $filter('filter')(data.items, {ishandled: false});
      $scope.hazards = $filter('orderBy')(data.items, 'createdAt', true);
    }).error(function(err) {
      console.error("Fetching all hazards has failed!");
    });
  }

  getHazards();

  webSocketService.on('new-hazard', getHazards);

  $scope.$on('$destroy', function () {
    webSocketService.removeEventListener('new-hazard', getHazards);
  });

  $scope.acknowledgeAll = function() {
    _.each($scope.hazards, function(hazard){
      hazardService.updatePartial(hazard._id, {'ishandled': true}).success(function(data) {
        hazard.ishandled = true;
      }).error(function(err) {
        toastr.error("Saving hazard has failed!", "Error");
      });
    });
  };

}

})();
