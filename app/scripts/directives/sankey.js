'use strict';

/**
 * @ngdoc directive
 * @name cop21App.directive:sankey
 * @description
 * # sankey
 */
angular.module('cop21App')
  .directive('sankey', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        // var sankey = cop21.sankey()
        // .width(element.width())
        // .height(element.height())
        //
        // var chart = d3.select(element[0])

        scope.$watch("sankeyData", function(newValue, oldValue){
          if(newValue != oldValue){
            //chart.datum(newValue).call(sankey)
            }
          })

      }
    };
  });
