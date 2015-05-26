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
      var output = {nodes:[], links:[]};

      var delegationNested = d3.nest()
                              .key(function(d){return d.entity})
                              //.key(function(d){return d.step})
                              //.key(function(d){return d.table})
                              .entries(input)


      var links = [];
      delegationNested.forEach(function(d){
        var step = d.values.length;

        for (var i = step - 1; i > 0; i--)
          {
            var elm = {}
            var target = d.values[i].delegation + "_" + d.values[i].step;
            var source = d.values[i-1].delegation + "_" + d.values[i-1].step;
            elm.source = source
            elm.target = target
            links.push(elm)

          }
      })

      var linksNested = d3.nest()
                        .key(function(d){return d.source + "-" + d.target})
                        .entries(links)

      linksNested.forEach(function(d){
        var st = d.key.split("-")
        var elm = {}
        elm.source = st[0]
        elm.target = st[1]
        elm.value = d.values.length
        output.links.push(elm)
      })

      var sourcesNested = d3.nest()
                        .key(function(d){return d.source})
                        .entries(links)

      sourcesNested = sourcesNested.map(function(d){return  d.key})

      var targetsNested = d3.nest()
                        .key(function(d){return d.target})
                        .entries(links)

      targetsNested = targetsNested.map(function(d){return  d.key})

      var nodes = sourcesNested.concat(targetsNested)

      nodes.forEach(function(d, i){
        if(d){output.nodes.push({name: d, id:i})}
      })

      var nodeMap = {};
      output.nodes.forEach(function(x) { nodeMap[x.name] = x; });
      output.links = output.links.map(function(x) {
        return {
          // source: nodeMap[x.source].id,
          // target: nodeMap[x.target].id,
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });
      return output;
    };
  });
