(function(){

  var cop21 = window.cop21 || (window.cop21 = {});

  cop21.network = function(){

    var height = 600,
        width = 600


    function network(selection){
      selection.each(function(data){

        var chart;
        var margin = {top: 5, right: 5, bottom: 5, left: 5},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        data.nodes.forEach(function(d){
          if(d.fixed){
            d.x = parseInt(d.type) * (chartWidth / 13)
            d.y = chartHeight / 2}
            d.radius = 10
          }else{
            d.radius=Math.random() * 12 + 4
          }
        })

        var nodes = data.nodes

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .nodes(nodes)
            .size([chartWidth, chartHeight]);

        force.start();

        force.on("tick", function(e) {
          var q = d3.geom.quadtree(nodes),
              k = e.alpha * .1,
              i = 0,
              n = nodes.length,
              o;

          while (++i < n) {
            o = nodes[i];
            if (o.fixed) continue;
            c = nodes[o.type];
            o.x += (c.x - o.x) * k;
            o.y += (c.y - o.y) * k;
            q.visit(collide(o));
          }

          chart.selectAll("circle")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        });

        chart.selectAll("circle")
            .data(nodes)
          .enter().append("circle")
            .attr("r", function(d) { return d.radius - 2; })
            //.attr("r", function(d) { return d.radius })
            .style("fill", function(d, i) { return color(d.type); });

      }); //end selection
    } // end network

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
    }

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

  return network;

  }

})();



var w = 960,
    h = 500;

var nodes = d3.range(5).map(function(i) {
  return {type: Math.random() * 5 | 0,
          radius: 30,
          fixed:true,
          type:i,
          x: (i+1) * (w / 6),
          y: h / 2};
    }),
    color = d3.scale.category10();

var force = d3.layout.force()
    .gravity(0)
    .charge(0)
    .nodes(nodes)
    .size([w, h]);

force.start();

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h);

svg.selectAll("circle")
    .data(nodes)
  .enter().append("svg:circle")
    .attr("r", function(d) { return d.radius - 2; })
    .style("fill", function(d, i) { return color(d.type); });

force.on("tick", function(e) {
  var q = d3.geom.quadtree(nodes),
      k = e.alpha * .1,
      i = 0,
      n = nodes.length,
      o;

  while (++i < n) {
    o = nodes[i];
    if (o.fixed) continue;
    c = nodes[o.type];
    o.x += (c.x - o.x) * k;
    o.y += (c.y - o.y) * k;
    q.visit(collide(o));
  }

  svg.selectAll("circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
});

var p0;
svg.on("mousemove", function() {
  var p1 = d3.svg.mouse(this),
      node = {radius:Math.random() * 12 + 4, type: Math.random() * 5 | 0, x: p1[0], y: p1[1], px: (p0 || (p0 = p1))[0], py: p0[1]};

  p0 = p1;

  svg.append("svg:circle")
      .data([node])
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.radius - 2; })
      .style("fill", function(d) {return color(d.type);})
      .transition()
        .delay(3000)
        .attr("r", 1e-6)
        .each("end", function() { nodes.splice(6, 1); })
        .remove();

  nodes.push(node);
  force.resume();
});

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
}
