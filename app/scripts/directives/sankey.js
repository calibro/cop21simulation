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

        var sankey = cop21.sankey()
        .width(element.width())
        .height(element.height())


        var chart = d3.select(element[0])

        scope.$watch("update", function(newValue, oldValue){
          if(newValue != oldValue){

              var step = scope.currentStep == 1?2:scope.currentStep;
              sankey.allTablesMap(scope.allTablesMap).currentStep(step)
              chart.datum(scope.sankeyData).call(sankey)

            }
          })

      }
    };
  });
