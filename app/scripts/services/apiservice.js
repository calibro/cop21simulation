'use strict';

/**
 * @ngdoc service
 * @name cop21App.apiService
 * @description
 * # apiService
 * Factory in the cop21App.
 */
angular.module('cop21App')
  .factory('apiService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
