/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.theme.components').controller('MsgCenterCtrl', MsgCenterCtrl);

function MsgCenterCtrl($scope, $filter, $interval, toastr, hazardService) {

  function getHazards() {
    hazardService.findAll().success(function(data) {
      // TODO: remove this hack when we have proper timestamps.
      _.each(data.hazardEvents, function(hazard) {
        hazard.eventTime = new Date(hazard.timestamp);
        hazard.eventTimestamp = hazard.eventTime.getTime();
        var date = new Date(hazard.timestamp);
        hazard.eventTimeStr = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
        if (hazard.ishandled === 'true') {
          hazard.ishandled = true;
        }
      });
      data.hazardEvents = $filter('filter')(data.hazardEvents, {ishandled: false});
      $scope.hazards = $filter('orderBy')(data.hazardEvents, 'eventTimestamp', true);
    }).error(function(err) {
      console.error("Fetching all hazards is failed!");
    });
  }

  getHazards();

  var refreshingHazards = $interval(function() {
    getHazards();
  }, 5000);

  $scope.$on('$destroy', function () {
    $interval.cancel(refreshingHazards);
  });

  $scope.acknowledgeAll = function() {
    _.each($scope.hazards, function(hazard){
      hazardService.updateAttribute(hazard, 'ishandled', true).success(function(data) {
        hazard.ishandled = true;
      }).error(function(err) {
        toastr.error("Saving hazard is failed!", "Error");
      });
    });
  };

}

})();
