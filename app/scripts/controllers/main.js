'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
