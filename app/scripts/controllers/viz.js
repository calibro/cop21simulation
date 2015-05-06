'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:VizCtrl
 * @description
 * # VizCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('VizCtrl', function ($scope, apiService, parseSankeyFilter) {
    $scope.graphData;
    $scope.sankeyData;

    apiService.getFile('data/net.json').then(
      function(data){
        $scope.graphData = data;
      },
      function(error){
        console.log(error)
      }
    );

    apiService.getFile('data/sankey.json').then(
      function(data){
        $scope.sankeyData = parseSankeyFilter(data);
      },
      function(error){
        console.log(error)
      }
    );

  });
