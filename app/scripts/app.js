'use strict';

/**
 * @ngdoc overview
 * @name cop21App
 * @description
 * # cop21App
 *
 * Main module of the application.
 */
angular
  .module('cop21App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/viz', {
        templateUrl: 'views/viz.html',
        controller: 'VizCtrl'
      })
      .when('/update', {
        templateUrl: 'views/update.html',
        controller: 'UpdateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
