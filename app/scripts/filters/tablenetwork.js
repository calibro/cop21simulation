'use strict';

/**
 * @ngdoc filter
 * @name cop21App.filter:tableNetwork
 * @function
 * @description
 * # tableNetwork
 * Filter in the cop21App.
 */
angular.module('cop21App')
  .filter('tableNetwork', function () {
    return function (input, tables) {
      var output = {'nodes':[], 'links': []};

      var steps = d3.nest()
        .key(function(d){ return d.step})
        .entries(input)
        .map(function(d){return d.key});

      var lastSteps = [steps[steps.length-2],steps[steps.length-1]];

      var lastEdges = input.filter(function(d){return d.step.toString() == lastSteps[0] || d.step.toString() == lastSteps[1]});

      var delegationNested = d3.nest()
        .key(function(d){return d.delegation})
        .key(function(d){return d.table})
        .entries(lastEdges);

      var tempEdges = [];

      delegationNested.forEach(function(d){
        if(d.values.length > 1){
          var tables = [d.values[0].key,d.values[1].key];
          tables.sort(function(a,b){
            return d3.ascending(parseInt(a.split('_')[1]), parseInt(b.split('_')[1]));
          })
          var elm = {'source': tables[0], 'target':tables[1]};
          tempEdges.push(elm);
        }
      });

      var mapTable = {};

      tables.forEach(function(d,i){
        mapTable[d.id] = i;
      });


      var links = d3.nest()
        .key(function(d){return d.source + '-' + d.target})
        .entries(tempEdges)
        .map(function(d){
          return {'source': mapTable[d.key.split('-')[0]], 'target': mapTable[d.key.split('-')[1]], 'value': d.values.length}
        });

      output.nodes = tables;
      output.links = links;

      return output;
    };
  });
