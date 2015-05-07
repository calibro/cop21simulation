(function(){

  var cop21 = window.cop21 || (window.cop21 = {});

  cop21.network = function(){

    var height = 600,
        width = 600,
        delRadius = 6,
        delPadding = 2,
        tabRadius = 20;


    function network(selection){
      selection.each(function(data){

        var chart;
        var margin = {top: 5, right: 5, bottom: 5, left: 5},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        //to be removed start
        data.nodes.forEach(function(d){
            d.radius = delRadius;
            d.type = parseInt(d.type);
        });

        var nodes = data.nodes,
            links = data.links;

        var nodesTables = [{'id':1,'name':'Equatorial Guinea','type':1,'radius':tabRadius, degree:6},
        {'id':2,'name':'Yemen','type':2,'radius':tabRadius, degree:6},
        {'id':3,'name':'Canada','type':3,'radius':tabRadius, degree:6},
        {'id':4,'name':'Australia','type':4,'radius':tabRadius, degree:6},
        {'id':5,'name':'Japan','type':5,'radius':tabRadius, degree:6},
        {'id':6,'name':'Russia','type':6,'radius':tabRadius, degree:6},
        {'id':7,'name':'Russia','type':7,'radius':tabRadius, degree:6},
        {'id':8,'name':'Indonesia','type':8,'radius':tabRadius, degree:6},
        {'id':9,'name':'Pakistan','type':9,'radius':tabRadius, degree:6},
        {'id':10,'name':'China','type':10,'radius':tabRadius, degree:6},
        {'id':11,'name':'Honduras','type':11,'radius':tabRadius, degree:6},
        {'id':12,'name':'Ukraine','type':12,'radius':tabRadius, degree:2},
        {'id':13,'name':'China','type':13,'radius':tabRadius, degree:6},
        {'id':14,'name':'Japan','type':14,'radius':tabRadius, degree:6},
        {'id':15,'name':'Philippines','type':15,'radius':tabRadius, degree:6},
        {'id':16,'name':'Belarus','type':16,'radius':tabRadius, degree:6},
        {'id':17,'name':'China','type':17,'radius':tabRadius, degree:6},
        {'id':18,'name':'Iran','type':18,'radius':tabRadius, degree:2},
        {'id':19,'name':'Indonesia','type':19,'radius':tabRadius, degree:6},
        {'id':20,'name':'China','type':20,'radius':tabRadius, degree:6},
        {'id':21,'name':'China','type':21,'radius':tabRadius, degree:6},
        {'id':22,'name':'Sweden','type':22,'radius':tabRadius, degree:6},
        {'id':23,'name':'Philippines','type':23,'radius':tabRadius, degree:6},
        {'id':24,'name':'Czech Republic','type':24,'radius':tabRadius, degree:6},
        {'id':25,'name':'Costa Rica','type':25,'radius':tabRadius, degree:6},
        {'id':26,'name':'Bhutan','type':26,'radius':tabRadius, degree:6},
        {'id':27,'name':'Palestinian Territory','type':27,'radius':tabRadius, degree:6},
        {'id':28,'name':'Sweden','type':28,'radius':tabRadius, degree:6},
        {'id':29,'name':'Czech Republic','type':29,'radius':tabRadius, degree:6},
        {'id':30,'name':'Portugal','type':30,'radius':tabRadius, degree:6},
        {'id':31,'name':'China','type':31,'radius':tabRadius, degree:6},
        {'id':32,'name':'Kuwait','type':32,'radius':tabRadius, degree:6},
        {'id':33,'name':'China','type':33,'radius':tabRadius, degree:6},
        {'id':34,'name':'Brazil','type':34,'radius':tabRadius, degree:6},
        {'id':35,'name':'Philippines','type':35,'radius':tabRadius, degree:6},
        {'id':36,'name':'Peru','type':36,'radius':tabRadius, degree:6},
        {'id':37,'name':'Brazil','type':37,'radius':tabRadius, degree:6},
        {'id':38,'name':'Peru','type':38,'radius':tabRadius, degree:6},
        {'id':39,'name':'Azerbaijan','type':39,'radius':tabRadius, degree:6},
        {'id':40,'name':'Poland','type':40,'radius':tabRadius, degree:6}];

        //to be removed end

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

        var forceTables = d3.layout.force()
            .charge(-2000)
            .linkDistance(function(d){return d.value*15 < 40 ? 40 : d.value*15;})
            .gravity(8)
            .nodes(nodesTables)
            .links(links)
            .size([chartWidth, chartHeight]);

        forceTables.start();

        var force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .nodes(nodes)
            .size([chartWidth, chartHeight]);

        //force.start();

        force.on('tick', function(e) {

          var q = d3.geom.quadtree(nodes.concat(nodesTables)),
              k = e.alpha * 0.1,
              i = 0,
              n = nodes.length,
              o;

          while (++i < n) {
            o = nodes[i];
            //if (o.fixed) continue;
            c = nodesTables[o.type];
            o.x += (c.x - o.x) * k;
            o.y += (c.y - o.y) * k;
            q.visit(collide(o));
          }

          //chart.selectAll('.del')
          delNodes
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });

          delPointNodes
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });
        });

        forceTables.on('tick', function(){

          force.start();
          var q = d3.geom.quadtree(nodesTables),
              i = 0,
              n = nodesTables.length;

          while (++i < n) {q.visit(collide(nodesTables[i]));}

          tabNodes
          .attr('cx', function(d) { d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x)); return d.x; })
          .attr('cy', function(d) { d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y)); return d.y;});

          // tableLabels
          // .attr('x', function(d) { d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x)); return d.x; })
          // .attr('y', function(d) { d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y)); return d.y;});

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

        forceTables.on('end', function(){
          //force.resume();
        });

        // var link = chart.selectAll('.links')
        //             .data(links)
        //           .enter().append('line')
        //           .attr('class', 'links')
        //           .attr('stroke', '#4d4d4d')
        //           .attr('stroke-opacity', 0.2)

        //delegation are always the same we don't need to remove them

        var delNodes = chart.selectAll('.del')
                                .data(nodes, function(d){return d.id});


        delNodes.enter().append('circle')
            .attr('class', 'del')
            .attr('r', function(d) { return d.radius - delPadding; })
            .attr('fill', '#00ffff')
            .attr('fill-opacity', 0.5)
            .each(function(d){
                 $(this).popover('destroy')
                 $(this).popover({title: d.name, content:'il contenuto del popover', placement:'auto', container: 'body'})
               });

    var drag = d3.behavior.drag()
    .on('drag', dragmove);

    function dragmove(d) {
      d3.select(this)
        .attr('cx', d.x = Math.max(d.radius, Math.min(chartWidth - d.radius, d3.event.x)))
        .attr('cy', d.y = Math.max(d.radius, Math.min(chartHeight - d.radius, d3.event.y)));
        force.resume()
    }

        var tabNodes = chart.selectAll('.tables')
                            .data(nodesTables, function(d){return d.id});

      tabNodes.transition().duration(200)
      .attr('fill-opacity', function(d){return d.degree > 5 ? 1 : 0})
      .attr('stroke', function(d){return d.degree > 5 ? 'none' : '#4d4d4d'})
      .attr('stroke-width', function(d){return d.degree > 5 ? 0 : 1})

      tabNodes.enter().append('circle')
      .attr('class', 'tables')
      .attr('r', function(d){return d.radius-delPadding;})
      .attr('fill', function(d) { return '#4d4d4d' })
      .attr('fill-opacity', function(d){return d.degree > 5 ? 1 : 0})
      .attr('stroke', function(d){return d.degree > 5 ? 'none' : '#4d4d4d'})
      .attr('stroke-width', function(d){return d.degree > 5 ? 0 : 1})
      .call(drag)


      tabNodes.exit()
              .transition()
              .duration(200)
              .attr('fill-opacity', 0)
              .remove();



      var delPointNodes = chart.selectAll('.delPoint').data(nodes, function(d){return d.id});

      delPointNodes
      .enter().append('circle')
    .attr('class', 'delPoint')
    .attr('r', 0.5)
    .attr('fill', function(d) { return 'black'; });

    var tableLabels = chart.selectAll('.tabLabels').data(nodesTables, function(d){return d.id});

    var tGroup = tableLabels
    .enter().append('g')
    .attr('class', 'tabLabels')
    .attr('opacity', function(d){return d.degree > 5 ? 1 : 0.5})

    tGroup
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', 'white')
    .text(function(d){
      return d.name;
    })
    .call(wrap, 100);


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
            lineHeight = 0.8, // ems
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
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
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

  return network;

  }

})();
