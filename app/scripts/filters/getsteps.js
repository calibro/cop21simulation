'use strict';

/**
 * @ngdoc filter
 * @name cop21App.filter:getSteps
 * @function
 * @description
 * # getSteps
 * Filter in the cop21App.
 */
angular.module('cop21App')
  .filter('getSteps', function () {
    return function (input) {
      var output;

      var steps = d3.nest()
        .key(function(d){return d.step})
        .entries(input)
        .map(function(d){return parseInt(d.key)})

      output = steps.sort(function(a,b){return d3.ascending(a,b);});

      return output;
    };
  });
