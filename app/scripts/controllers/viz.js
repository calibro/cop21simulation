'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:VizCtrl
 * @description
 * # VizCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('VizCtrl', function ($scope, EDGES_ID, TABLES_ID, DELEGATIONS_ID, apiService, getStepsFilter, parseSankeyFilter, tableNetworkFilter) {

    $scope.allTables;
    $scope.allDelegations;
    $scope.allEdges;

    $scope.steps;
    $scope.lastSteps;
    $scope.currentStep;

    $scope.graphData = {};
    $scope.sankeyData;

    $scope.update = true;

    apiService.getTable(DELEGATIONS_ID).then(
      function(delegationsData){
        $scope.allDelegations = delegationsData;
    apiService.getTable(TABLES_ID).then(
      function(tablesData){
        $scope.allTables = tablesData;
        apiService.getTable(EDGES_ID).then(
          function(edgesData){
            $scope.steps = getStepsFilter(edgesData);
            $scope.lastSteps = $scope.steps[$scope.steps.length-1];
            $scope.currentStep = $scope.lastSteps;
            console.log($scope.steps, $scope.lastSteps, $scope.currentStep)
            $scope.allEdges = edgesData;
            $scope.graphData.tables = tableNetworkFilter($scope.allEdges.filter(function(d){return d.step >= $scope.currentStep-1;}), $scope.allTables);
            $scope.graphData.delegations = $scope.allEdges.filter(function(d){return d.step == $scope.currentStep;});
            $scope.sankeyData = parseSankeyFilter($scope.allEdges.filter(function(d){return d.step >= $scope.currentStep-1;}))
            $scope.update = $scope.update ? false : true;
          },
          function(err){
            console.log(err)
          }
        );
      },
      function(err){
        console.log(err)
      }
    );
  },
  function(err){
    console.log(err)
  }
  );

    // apiService.getFile('data/net.json').then(
    //   function(data){
    //     $scope.graphData = data;
    //   },
    //   function(error){
    //     console.log(error)
    //   }
    // );
    //
    // apiService.getFile('data/sankey.json').then(
    //   function(data){
    //     $scope.sankeyData = parseSankeyFilter(data);
    //   },
    //   function(error){
    //     console.log(error)
    //   }
    // );

  });
