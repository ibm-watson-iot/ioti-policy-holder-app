/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($rootScope, $scope, $timeout, baConfig, baUtil,
                                 shieldAssociationService, hazardService, deviceService, userService, claimService) {

    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    $scope.charts = [{
      color: pieColor,
      description: 'Active Shields',
      stats: '0',
      icon: 'shield',
    }, {
      color: pieColor,
      description: 'Devices',
      stats: '0',
      icon: 'device',
    }, {
      color: pieColor,
      description: 'Hazards',
      stats: '0',
      icon: 'attention',
    }, {
      color: pieColor,
      description: 'Claims',
      stats: '0',
      icon: 'refresh',
    }, {
      color: pieColor,
      description: 'Users',
      stats: '0',
      icon: 'user',
    }
    ];

    shieldAssociationService.findAll().success(function(shields) {
      $scope.charts[0].stats = shields.total;
    }).error(function(err) {
      console.error("Fetching user's shields is failed!");
    });

    deviceService.findAll().success(function(devices) {
      $scope.charts[1].stats = devices.total;
    }).error(function(err) {
      console.error("Fetching user's devices is failed!");
    });

    hazardService.findAll().success(function(hazards) {
      $scope.charts[2].stats = hazards.total;
    }).error(function(err) {
      console.error("Fetching user's hazards is failed!");
    });

    claimService.findAll().success(function(claims) {
      $scope.charts[3].stats = claims.length;
    }).error(function(err) {
      console.error("Fetching claims has failed!");
    });

    userService.findAll().success(function(users) {
      $scope.charts[4].stats = users.total;
    }).error(function(err) {
      console.error("Fetching users has failed!");
    });

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function () {
      loadPieCharts();
      updatePieCharts();
    }, 3000);
  }
})();
