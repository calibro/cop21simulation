'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:VizCtrl
 * @description
 * # VizCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('VizCtrl', function ($scope, $interval, EDGES_ID, TABLES_ID, DELEGATIONS_ID, apiService, getStepsFilter, parseSankeyFilter, tableNetworkFilter, cfpLoadingBar) {

    cfpLoadingBar.start();
    $scope.sankeyFull = false;

    $scope.allTables;
    $scope.allDelegations;
    $scope.allEdges;

    $scope.allTablesMap = {};
    $scope.allDelegationsMap = {};

    $scope.steps;
    $scope.lastSteps;
    $scope.currentStep;
    $scope.maxSize = 10;

    $scope.graphData = {};
    $scope.sankeyData;

    $scope.update = true;
    $scope.autoplay = false;

    $scope.playModel = 0;
    $scope.pauseModel = 1;

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
      $scope.playModel = 1;
      $scope.pauseModel = 0;
      timer = $interval(function(){
        if($scope.currentStep == $scope.lastSteps){
          killtimer();
          $scope.playModel = 0;
          $scope.pauseModel = 1;
        }else{
          $scope.currentStep++
          $scope.updateData()
          }
        },3000);
    }

    $scope.stopplay = function(){
      killtimer();
      $scope.playModel = 0;
      $scope.pauseModel = 1;
    };
    $scope.updateStep = function(){
      cfpLoadingBar.start();
      apiService.getTable(DELEGATIONS_ID).then(
        function(delegationsData){
          $scope.allDelegations = delegationsData;
          cfpLoadingBar.set(0.3)
      apiService.getTable(TABLES_ID).then(
        function(tablesData){
          $scope.allTablesStep = tablesData;
          cfpLoadingBar.set(0.6)
          apiService.getTable(EDGES_ID).then(
            function(edgesData){
              cfpLoadingBar.set(0.9)
              cfpLoadingBar.complete()
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

              $scope.delegationsHistory = d3.nest().key(function(d){return d.entity}).entries($scope.allEdges)

              $scope.delegationsHistory = $scope.delegationsHistory.map(function(d){
                return {entity:d.key, history: d.values.map(function(e){return $scope.allTablesMap[e.delegation]})}
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

    $scope.openSankey = function(){
      $scope.sankeyFull = true;
    }

    $scope.closeSankey = function(){
      $scope.sankeyFull = false;
    }

    $scope.updateStep()

  });
