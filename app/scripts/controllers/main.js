'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('MainCtrl', function ($scope, apiService, EDGES_ID) {
    apiService.getGoogleDriveDoc(EDGES_ID, {tqx:'responseHandler:JSON_CALLBACK'}).then(
      function(data){
        console.log(data.table.rows);
      },
      function(err){
        console.log(err);
      }
    );
  });
