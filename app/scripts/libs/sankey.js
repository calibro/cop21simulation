(function(){

  var cop21 = window.cop21 || (window.cop21 = {});

  cop21.sankey = function(){

    var height = 600,
        width = 600,
        delRadius = 6,
        delPadding = 2,
        tabRadius = 20,
        allTablesMap;


    function sankey(selection){
      selection.each(function(data){

        var chart;
        var units = "Delegations";
        var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

        var margin = {top: 5, right: 5, bottom: 5, left: 5},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

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

                // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(5)
            .nodePadding(2)
            .size([chartWidth, chartHeight]);

        var path = sankey.link();

        sankey
             .nodes(data.nodes)
             .links(data.links)
             .layout(32);

       // add in the links
         var link = chart.selectAll(".link")
             .data(data.links)

           link.transition().duration(200)
             .attr("d", path)
             .style("stroke-width", function(d) { return Math.max(1, d.dy); })
             .sort(function(a, b) { return b.dy - a.dy; });

           link.enter().append("path")
             .attr("class", "link")
             .attr("d", path)
             .style("stroke-width", function(d) { return Math.max(1, d.dy); })
             .sort(function(a, b) { return b.dy - a.dy; })
             .each(function(d){

                  $(this).tooltip('destroy')
                  $(this).tooltip({
                    title:tText(d),
                    placement:'top',
                    container: 'body'
                    })
                });

          link.exit().remove()

       // add the link titles
        //  link.append("title")
        //        .text(function(d) {
        //    		return "from table " + d.source.name.split("_")[1] + " to table " +
        //                d.target.name.split("_")[1] + "\n" + format(d.value);
        //           });

       // add in the nodes
         var node = chart.selectAll(".node")
             .data(data.nodes, function(d){return d.name})

        node.transition().duration(200)
                .attr("transform", function(d) {
          		  return "translate(" + d.x + "," + d.y + ")"; })

          node.enter().append("g")
             .attr("class", "node")
             .attr("transform", function(d) {
       		  return "translate(" + d.x + "," + d.y + ")";
             })

          node.exit().remove()
       // add the rectangles for the nodes
         node.append("rect")
             .attr("height", function(d) { return d.dy; })
             .attr("width", sankey.nodeWidth())
            .style("fill", "black")
            .each(function(d){
                 $(this).popover('destroy')
                 $(this).popover({
                   title: allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]],
                   content:format(d.value),
                   placement:'auto left',
                   container: 'body',
                   trigger: 'hover'
                   })
               });


       // add in the title for the nodes
         node.append("text")
             .attr("x", -6)
             .attr("y", function(d) { return d.dy / 2; })
             .attr("dy", ".35em")
             .attr('class', 'tabLabels')
             .attr("text-anchor", "end")
             .attr("transform", null)
             .text(function(d) { if(d.value > 5){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]} })
           .filter(function(d) { return d.x < width / 2; })
             .attr("x", 6 + sankey.nodeWidth())
             .attr("text-anchor", "start")
             .text(null)


      }); //end selection
    } // end sankey

  function tText(d){
    var source = d.source.name.split("_")[1],
        target = d.target.name.split("_")[1];

    if(source == target){
      return d.value + ' delegation(s) stayed at table ' + target
    }else{
      return d.value + ' delegation(s) moved from table ' + source + ' to table ' + target
    }
  };

  sankey.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return sankey;
  }

  sankey.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return sankey;
  }

  sankey.allTablesMap = function(x){
    if (!arguments.length) return allTablesMap;
    allTablesMap = x;
    return sankey;
  }

  return sankey;

  }

})();
