/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($rootScope, $scope, $timeout, $filter,
    baConfig, baUtil, shieldService, hazardService) {

    $scope.charts = [];
    $scope.isLoading = true;
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

    hazardService.findAll().success(function(data) {
      var shieldToHazardMap = {};
      _.each(data.hazardEvents, function(hazard) {
        shieldToHazardMap[hazard.shieldUUID] = true;
      });

      shieldService.findAll($rootScope.loggedInUser.username).success(function(shields) {
        _.each(shields, function(shield) {
          shield.hasHazard = shieldToHazardMap[shield.UUID];
        });

        shields = $filter('orderBy')(shields, 'hasHazard');

        _.each(shields, function(shield) {
          var date = new Date(shield.createdAt);
          $scope.charts.push({
            color: pieColor,
            description: shield.name,
            stats: 'Last updated at ' + $filter('date')(date, 'h:mm a MMM d, y'),
            icon: shieldToHazardMap[shield.UUID] ? (shield.image + 'Alert') : shield.image,
          });
        });
        $scope.isLoading = false;
      }).error(function(err) {
        console.error("Fetching user's shields is failed!");
      });
    }).error(function(err) {
      console.error("Fetching all hazards is failed!");
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
    }, 1000);
  }
})();
