(function(){

  var cop21 = window.cop21 || (window.cop21 = {});

  cop21.network = function(){

    var height = 600,
        width = 600,
        delRadius = 6,
        delPadding = 2,
        tabRadius = 20,
        showLabel = true,
        first,
        allDelegationsMap,
        delegationsHistory,
        forceTables = d3.layout.force()
            .charge(-2000)
            .linkDistance(function(d){return d.value*15 < 40 ? 10 : d.value*15;})
            .gravity(0.15)
            .friction(0.3),
        force = d3.layout.force()
                .gravity(0)
                 .charge(0)
                 .friction(0.88)


    function network(selection){
      selection.each(function(data){

        var chart;
        var margin = {top: 5, right: 5, bottom: 5, left: 5},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        var firstLap = true;

        var nodes = data.delegations,
            links = data.tables.links,
            nodesTables = data.tables.nodes;

        nodesTables.forEach(function(d){
          d.type = d.id;
          d.radius = tabRadius;
        })

        nodes.forEach(function(d){
          d.radius = delRadius;
        })

        nodes.sort(function(a,b){
          return d3.ascending(a.entity, b.entity)
        })

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append('g')
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select('g')
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        }

        forceTables.stop();
        force.stop();

        forceTables
            .nodes(nodesTables)
            .links(links)
            .size([chartWidth, chartHeight]);


        force
          .nodes(nodes)
          .size([chartWidth, chartHeight]);

        force.on('tick', function(e) {


          var q = d3.geom.quadtree(force.nodes().concat(forceTables.nodes())),
              k = e.alpha * 0.1,
              i = -1,
              n = force.nodes().length,
              o;

          while (++i < n) {
            //o = nodes[i];
            o = force.nodes()[i]
            c = forceTables.nodes().filter(function(d){return d.id == o.delegation})[0];
            o.x += (c.x - o.x)* k;
            o.y += (c.y - o.y)* k;
            q.visit(collide(o));
          }

          delNodes
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });

          delPointNodes
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });
        });

        forceTables.on('tick', function(e){

            force.start();

          var q = d3.geom.quadtree(forceTables.nodes()),
              i = -1,
              n = forceTables.nodes().length;

          while (++i < n) {
            q.visit(collide(forceTables.nodes()[i]));
            }

          tabNodes
            .attr('cx', function(d) { d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x)); return d.x; })
            .attr('cy', function(d) { d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y)); return d.y;});


          tableLabels
          .attr('x', function(d) { d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x)); return d.x; })
          .attr('y', function(d) { d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y)); return d.y;});

          tableLabels
          .attr('transform', function(d) {
            d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x));
            d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y));
            return 'translate(' + d.x + ',' + d.y + ')'
            })

          //     chart.selectAll('.links').attr('x1', function(d) { return d.source.x; })
          // .attr('y1', function(d) { return d.source.y; })
          // .attr('x2', function(d) { return d.target.x; })
          // .attr('y2', function(d) { return d.target.y; });

        });

        force.on('end', function(){
          if(!first && firstLap){
            forceTables.start()
            firstLap = false;
          }
        });

        // var link = chart.selectAll('.links')
        //             .data(links)
        //           .enter().append('line')
        //           .attr('class', 'links')
        //           .attr('stroke', '#4d4d4d')
        //           .attr('stroke-opacity', 1)

        //delegation are always the same we don't need to remove them

        var delNodes = chart.selectAll('.del')
                                .data(force.nodes(), function(d){ return d.entity});


        delNodes.enter().append('circle')
            .attr('class', 'del')
            .attr('r', delRadius - delPadding)
            .attr('fill', '#00ffff')
            .attr('fill-opacity', 0.5)
            .attr('cx', 0)
            .attr('cy', 0)
            .each(function(d){
                 $(this).popover('destroy')
                 $(this).popover({
                   title: allDelegationsMap[d.entity],
                   content:delegationsHistory.filter(function(e){return e.entity == d.entity})[0].history.join(" > "),
                   placement:'auto',
                   container: 'body',
                   trigger: 'hover',
                   html: true
                   })
               });

        delNodes.exit().remove()


        var tabNodes = chart.selectAll('.tables')
                            //.data(nodesTables, function(d){return d.id});
                            .data(forceTables.nodes(), function(d){return d.id});

      tabNodes.transition().duration(200)
      .attr('fill-opacity', function(d){return d.degree >= 5 ? 1 : 0})
      .attr('stroke', function(d){return d.degree >= 5 ? 'none' : '#4d4d4d'})
      .attr('stroke-width', function(d){return d.degree >= 5 ? 0 : 1})

      tabNodes.enter().append('circle')
      .attr('class', 'tables')
      .attr('r', function(d){return d.radius-delPadding;})
      .attr('fill', function(d) { return '#4d4d4d' })
      .attr('fill-opacity', function(d){return d.degree >= 5 ? 1 : 0})
      .attr('stroke', function(d){return d.degree >= 5 ? 'none' : '#4d4d4d'})
      .attr('stroke-width', function(d){return d.degree >= 5 ? 0 : 1})
      .attr('cx', 0)
      .attr('cy', 0)
      //.call(drag)

      tabNodes.exit()
              .transition()
              .duration(200)
              .attr('fill-opacity', 0)
              .remove();

      var delPointNodes = chart.selectAll('.delPoint').data(force.nodes(), function(d){return d.entity});

      // delPointNodes.transition().duration(200)
      //     .attr('fill', function(d) { return 'black'; });

      delPointNodes
      .enter().append('circle')
    .attr('class', 'delPoint')
    .attr('r', 0.5)
    .attr('fill', function(d) { return 'black'; });

    delPointNodes.exit().remove()

    var tableLabels = chart.selectAll('.tabLabels').data(forceTables.nodes(), function(d){return d.id});

    tableLabels.transition().duration(200).attr('opacity', function(d){return d.degree >= 5 ? 1 : 0.5})

    tableLabels
    .enter().append('g')
    .attr('class', 'tabLabels')
    .attr('opacity', function(d){return d.degree >= 5 ? 1 : 0.5})

    tableLabels.exit().remove()

    tableLabels.select('text').remove()

    tableLabels
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .text(function(d){
      return d.name;
    })
    .call(wrap, 100);

    if(first){
      forceTables.start();
    }else {
      force.start()

    }


      }); //end selection
    }; // end network

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse();

        if(words.length < 2){
          return;
        }
          var  word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.7, // ems
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', lineHeight + dy + 'em').text(word);
          }
        }
      });
    }

  function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.px += x * l;
          node.py += y * l;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    };
  };

  network.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return network;
  }

  network.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return network;
  }

  network.delRadius = function(x){
    if (!arguments.length) return delRadius;
    delRadius = x;
    return network;
  }

  network.delPadding = function(x){
    if (!arguments.length) return delPadding;
    delPadding = x;
    return network;
  }

  network.tabRadius = function(x){
    if (!arguments.length) return tabRadius;
    tabRadius = x;
    return network;
  }

  network.allDelegationsMap = function(x){
    if (!arguments.length) return allDelegationsMap;
    allDelegationsMap = x;
    return network;
  }

  network.delegationsHistory = function(x){
    if (!arguments.length) return delegationsHistory;
    delegationsHistory = x;
    return network;
  }

  network.showLabel = function(x){
    if (!arguments.length) return showLabel;
    showLabel = x;
    return network;
  }

  network.first = function(x){
    if (!arguments.length) return first;
    first = x;
    return network;
  }

  return network;

  }

})();
