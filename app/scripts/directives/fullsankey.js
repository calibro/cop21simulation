'use strict';

/**
 * @ngdoc directive
 * @name cop21App.directive:fullSankey
 * @description
 * # fullSankey
 */
angular.module('cop21App')
  .directive('fullSankey', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var sankey = cop21.sankey()
        .width(element.width())
        .height(element.height())
        .margin({top: 50, right: 50, bottom: 50, left: 50})


        var chart = d3.select(element[0])

        var step = scope.currentStep == 1?2:scope.currentStep;
        sankey.allTablesMap(scope.allTablesMap).currentStep(step)
        chart.datum(scope.sankeyData).call(sankey)

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
