'use strict';

/**
 * @ngdoc directive
 * @name cop21App.directive:graph
 * @description
 * # graph
 */
 angular.module('cop21App')
 .directive('graph', function () {
   return {
     restrict: 'A',
     link: function postLink(scope, element, attrs) {

       var net = cop21.network()
       .width(element.width())
       .height(element.height())

       var chart = d3.select(element[0])

       scope.$watch("update", function(newValue, oldValue){
         if(newValue != oldValue){
           chart.datum(scope.graphData).call(net)
           }
         })
      }
    };
  });
