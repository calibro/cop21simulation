'use strict';

/**
 * @ngdoc filter
 * @name cop21App.filter:parseSankey
 * @function
 * @description
 * # parseSankey
 * Filter in the cop21App.
 */
angular.module('cop21App')
  .filter('parseSankey', function () {
    return function (input) {
      return 'parseSankey filter: ' + input;
    };
  });
