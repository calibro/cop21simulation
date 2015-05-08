'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:VizCtrl
 * @description
 * # VizCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('VizCtrl', function ($scope, EDGES_ID, TABLES_ID, DELEGATIONS_ID, apiService, parseGdocDataFilter, parseSankeyFilter, tableNetworkFilter) {
    $scope.graphData;
    $scope.sankeyData;

    apiService.getGoogleDriveDoc(TABLES_ID, {tqx:'responseHandler:JSON_CALLBACK'}).then(
      function(data){
        var tables = parseGdocDataFilter(data);
        //console.log(data)
        apiService.getGoogleDriveDoc(DELEGATIONS_ID, {tqx:'responseHandler:JSON_CALLBACK'}).then(
          function(datac){
            console.log(datac)
            //var testc = parseGdocDataFilter(datac);
            // tableNetworkFilter(test, tables);
            //console.log(test)

            apiService.getGoogleDriveDoc(EDGES_ID, {tqx:'responseHandler:JSON_CALLBACK'}).then(
              function(data){
                var test = parseGdocDataFilter(data);

                console.log(tableNetworkFilter(test, tables));

              },
              function(err){
                console.log(err);
              }
            );

          },
          function(err){
            console.log(err);
          }
        );

      },
      function(err){
        console.log(err);
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
