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

        data.nodes.forEach(function(d){
            d.radius = delRadius
            d.type = parseInt(d.type)
        })

        var nodes = data.nodes,
            links = data.links;

        var nodesTables = [{"id":1,"name":"Equatorial Guinea","type":1,"radius":20},
        {"id":2,"name":"Yemen","type":2,"radius":20},
        {"id":3,"name":"Canada","type":3,"radius":20},
        {"id":4,"name":"Australia","type":4,"radius":20},
        {"id":5,"name":"Japan","type":5,"radius":20},
        {"id":6,"name":"Russia","type":6,"radius":20},
        {"id":7,"name":"Russia","type":7,"radius":20},
        {"id":8,"name":"Indonesia","type":8,"radius":20},
        {"id":9,"name":"Pakistan","type":9,"radius":20},
        {"id":10,"name":"China","type":10,"radius":20},
        {"id":11,"name":"Honduras","type":11,"radius":20},
        {"id":12,"name":"Ukraine","type":12,"radius":20},
        {"id":13,"name":"China","type":13,"radius":20},
        {"id":14,"name":"Japan","type":14,"radius":20},
        {"id":15,"name":"Philippines","type":15,"radius":20},
        {"id":16,"name":"Belarus","type":16,"radius":20},
        {"id":17,"name":"China","type":17,"radius":20},
        {"id":18,"name":"Iran","type":18,"radius":20},
        {"id":19,"name":"Indonesia","type":19,"radius":20},
        {"id":20,"name":"China","type":20,"radius":20},
        {"id":21,"name":"China","type":21,"radius":20},
        {"id":22,"name":"Sweden","type":22,"radius":20},
        {"id":23,"name":"Philippines","type":23,"radius":20},
        {"id":24,"name":"Czech Republic","type":24,"radius":20},
        {"id":25,"name":"Costa Rica","type":25,"radius":20},
        {"id":26,"name":"Bhutan","type":26,"radius":20},
        {"id":27,"name":"Palestinian Territory","type":27,"radius":20},
        {"id":28,"name":"Sweden","type":28,"radius":20},
        {"id":29,"name":"Czech Republic","type":29,"radius":20},
        {"id":30,"name":"Portugal","type":30,"radius":20},
        {"id":31,"name":"China","type":31,"radius":20},
        {"id":32,"name":"Kuwait","type":32,"radius":20},
        {"id":33,"name":"China","type":33,"radius":20},
        {"id":34,"name":"Brazil","type":34,"radius":20},
        {"id":35,"name":"Philippines","type":35,"radius":20},
        {"id":36,"name":"Peru","type":36,"radius":20},
        {"id":37,"name":"Brazil","type":37,"radius":20},
        {"id":38,"name":"Peru","type":38,"radius":20},
        {"id":39,"name":"Azerbaijan","type":39,"radius":20},
        {"id":40,"name":"Poland","type":40,"radius":20}]

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var forceTables = d3.layout.force()
            .charge(-2000)
            .linkDistance(function(d){
              if(d.value*15 < 40){
                return 40
              }else{
              return d.value*15
                }
              })
            .gravity(10)
            .nodes(nodesTables)
            .links(links)
            .size([chartWidth, chartHeight]);

        forceTables.start();

        var force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .nodes(nodes)
            .size([chartWidth, chartHeight]);

        force.start();

        force.on("tick", function(e) {

          var q = d3.geom.quadtree(nodes.concat(nodesTables)),
              k = e.alpha * .1,
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

          chart.selectAll(".del")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });

              chart.selectAll(".delPoint")
                  .attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
        });

        forceTables.on("tick", function(){

          var q = d3.geom.quadtree(nodesTables),
              i = 0,
              n = nodesTables.length;

          while (++i < n) q.visit(collide(nodesTables[i]));

              chart.selectAll(".tables")
              .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(chartWidth - d.radius-delPadding-(delRadius*2), d.x)); })
              .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(chartHeight - d.radius-delPadding-(delRadius*2), d.y)); });

        chart.selectAll(".links").attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

        })

        forceTables.on("end", function(){
          force.resume();
          //force.start()
        })

        var link = chart.selectAll(".links")
      .data(links)
    .enter().append("line")
    .attr("class", "links")
    .attr("stroke", "#4d4d4d")
    .attr("stroke-opacity", 0.2)


        chart.selectAll(".del")
            .data(nodes)
          .enter().append("circle")
          .attr("class", "del")
            .attr("r", function(d) { return d.radius - delPadding; })
            .attr("fill", "#00ffff")
            .attr("fill-opacity", 0.5)
            .on("click", function(d){
            console.log(d)
          })

        chart.selectAll(".tables")
      .data(nodesTables)
    .enter().append("circle")
      .attr("class", "tables")
      .attr("r", function(d){return d.radius-delPadding})
      .style("fill", function(d) { return "#4d4d4d" })

      chart.selectAll(".delPoint")
    .data(nodes)
  .enter().append("circle")
    .attr("class", "delPoint")
    .attr("r", function(d){return 0.5})
    .style("fill", function(d) { return "black" })


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
