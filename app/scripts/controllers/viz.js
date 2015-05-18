'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:VizCtrl
 * @description
 * # VizCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('VizCtrl', function ($scope, $interval, EDGES_ID, TABLES_ID, DELEGATIONS_ID, apiService, getStepsFilter, parseSankeyFilter, tableNetworkFilter) {

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
    $scope.autoplay = false;

    $scope.updateData = function(){
      $scope.allTables = $scope.allTablesStep.filter(function(d){return d.step == $scope.lastSteps});
      $scope.allTables.map(function(d){
        $scope.allTablesMap[d.id] = d.name;
      });

      $scope.graphData.tables = tableNetworkFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}), $scope.allTables);
      $scope.graphData.delegations = $scope.allEdges.filter(function(d){return d.step == $scope.currentStep;});
      if($scope.currentStep == 1){
        $scope.sankeyData = parseSankeyFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep+1;}))
      }else{
        $scope.sankeyData = parseSankeyFilter($scope.allEdges.filter(function(d){return d.step == $scope.currentStep || d.step == $scope.currentStep-1;}))
      }
      $scope.update = $scope.update ? false : true;
    }

    var timer;
    var killtimer = function(){
      if(angular.isDefined(timer))
        {
          $interval.cancel(timer);
          timer=undefined;
        }
    };

    $scope.autoplay = function(){
      timer = $interval(function(){
        if($scope.currentStep == $scope.lastSteps){
          killtimer();
        }else{
          $scope.currentStep++
          $scope.updateData()
          }
        },3000);
    }

    $scope.stopplay = function(){
      killtimer();
    };
    $scope.updateStep = function(){
      apiService.getTable(DELEGATIONS_ID).then(
        function(delegationsData){
          $scope.allDelegations = delegationsData;
      apiService.getTable(TABLES_ID).then(
        function(tablesData){
          $scope.allTablesStep = tablesData;
          apiService.getTable(EDGES_ID).then(
            function(edgesData){
              $scope.steps = getStepsFilter(edgesData);
              $scope.lastSteps = $scope.steps[$scope.steps.length-1];
              $scope.currentStep = $scope.lastSteps;
              $scope.allEdges = edgesData;
              $scope.allTables = $scope.allTablesStep.filter(function(d){return d.step == $scope.lastSteps});

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
    }

    $scope.updateStep()

  });
