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

    $scope.allTablesMap = {};
    $scope.allDelegationsMap = {};

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
            $scope.allEdges = edgesData;

            $scope.allDelegations.map(function(d){
              $scope.allDelegationsMap[d.id] = d.name;
            })

            $scope.allTables.map(function(d){
              $scope.allTablesMap[d.id] = d.name;
            })

            $scope.delegationsHistory = d3.nest().key(function(d){return d.delegation}).entries($scope.allEdges)

            $scope.delegationsHistory = $scope.delegationsHistory.map(function(d){
              return {delegation:d.key, history: d.values.map(function(e){return $scope.allTablesMap[e.table]})}
            })

            $scope.graphData.tables = tableNetworkFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}), $scope.allTables);
            $scope.graphData.delegations = $scope.allEdges.filter(function(d){return d.step == $scope.currentStep;});
            $scope.sankeyData = parseSankeyFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}))
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

  $scope.updateData = function(){
    $scope.graphData.tables = tableNetworkFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}), $scope.allTables);
    $scope.graphData.delegations = $scope.allEdges.filter(function(d){return d.step == $scope.currentStep;});
    $scope.sankeyData = parseSankeyFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}))
    $scope.update = $scope.update ? false : true;
  }
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
