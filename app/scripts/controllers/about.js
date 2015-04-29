'use strict';

/**
 * @ngdoc function
 * @name cop21App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cop21App
 */
angular.module('cop21App')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
