'use strict';

/**
 * @ngdoc filter
 * @name cop21App.filter:parseGdocData
 * @function
 * @description
 * # parseGdocData
 * Filter in the cop21App.
 */
angular.module('cop21App')
  .filter('parseGdocData', function () {
    return function (data) {
      var output = [];
      data.table.rows.forEach(function(d){
        var row = {};
        d.c.forEach(function(e,i){
          row[data.table.cols[i].label] = e.v;
        })
        output.push(row);
      })
      return output;
    };
  });
