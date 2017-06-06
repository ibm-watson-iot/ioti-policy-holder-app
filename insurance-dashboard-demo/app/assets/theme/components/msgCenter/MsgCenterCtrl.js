/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.theme.components').controller('MsgCenterCtrl', MsgCenterCtrl);

function MsgCenterCtrl($scope, $filter, $interval, toastr, hazardService, claimService) {

  function getHazards() {
    hazardService.findAll().success(function(data) {
      // TODO: remove this hack when we have proper timestamps.
      _.each(data.items, function(hazard) {
        hazard.eventTime = new Date(hazard.timestamp);
        hazard.eventTimestamp = hazard.eventTime.getTime();
        var date = new Date(hazard.timestamp);
        hazard.eventTimeStr = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
        if (hazard.ishandled === 'true') {
          hazard.ishandled = true;
        }
      });
      data.items = $filter('filter')(data.items, {ishandled: false});
      $scope.hazards = $filter('orderBy')(data.items, 'eventTimestamp', true);
    }).error(function(err) {
      console.error("Fetching all hazards is failed!");
    });
  }

  function getClaims() {
    claimService.findAll().success(function(data) {
      _.each(data.items, function(claim) {
        claim.eventTime = new Date(claim.damageDate);
      });
      $scope.claims = data.items;
    }).error(function(err) {
      console.error("Fetching all claims is failed!");
    });
  }

  getHazards();
  getClaims();

  var refreshingHazards = $interval(function() {
    //getHazards();
    //getClaims();
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


  $scope.users = {
    0: {
      name: 'Vlad',
    },
    1: {
      name: 'Kostya',
    },
    2: {
      name: 'Andrey',
    },
    3: {
      name: 'Nasta',
    }
  };

  $scope.messages = [
    {
      userId: 3,
      text: 'After you get up and running, you can place Font Awesome icons just about...',
      time: '1 min ago'
    },
    {
      userId: 0,
      text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
      time: '2 hrs ago'
    },
    {
      userId: 1,
      text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
      time: '10 hrs ago'
    },
    {
      userId: 2,
      text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
      time: '1 day ago'
    },
    {
      userId: 3,
      text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
      time: '1 day ago'
    },
    {
      userId: 1,
      text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
      time: '2 days ago'
    },
    {
      userId: 0,
      text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
      time: '1 week ago'
    }
  ];

}

})();
