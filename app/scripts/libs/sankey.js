(function(){

  var cop21 = window.cop21 || (window.cop21 = {});

  cop21.sankey = function(){

    var height = 600,
        width = 600,
        delRadius = 6,
        delPadding = 2,
        tabRadius = 20,
        allTablesMap,
        currentStep,
        margin = {top: 5, right: 5, bottom: 5, left: 5},
        showLabel = true;


    function sankey(selection){
      selection.each(function(data){

        var chart;
        var viz;
        var legend;
        var marginLegend = 20;
        var units = "Delegations";
        var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();
        var linkG;
        var currentSteps = [currentStep-1, currentStep];

        var chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          if(currentStep){
            legend = chart.append('g')
              .attr('class', 'legend')

            legend.append('circle')
              .attr('r', 8)
              .attr('fill', 'none')
              .attr('stroke', 'white')
              .attr('stroke-width', 1)
              .attr('cx', 5)
              .attr('cy', 8)

            legend.append('circle')
                .attr('r', 8)
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .attr('cx', chartWidth-5)
                .attr('cy', 8)

            legend.append('line')
              .attr('x1', 13)
              .attr('y1', 8)
              .attr('x2', chartWidth-13)
              .attr('y2', 8)
              .attr('stroke', 'white')
              .attr('stroke-width', 1)

              legend.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('class', 'stepLeft')
                .attr('x', 5)
                .attr('y', 8)
                .attr('dy', '3px')

              legend.append('text')
                  .attr('text-anchor', 'middle')
                  .attr('fill', 'white')
                  .attr('class', 'stepRight')
                  .attr('x', chartWidth-5)
                  .attr('y', 8)
                  .attr('dy', '3px')
              }

          viz = chart.append('g')
            .attr("transform", "translate(0," + marginLegend +")")
            .attr('class', 'sanviz')

          linkG = viz.append('g').attr('class','linkG');
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

          legend = chart.select('.legend');
          viz = chart.select('.sanviz')
          linkG = viz.select('.linkG');
        }

        if(currentStep){
          var stepLeft = legend.select('.stepLeft').text(currentSteps[0])
          var stepRight = legend.select('.stepRight').text(currentSteps[1])
        }
                // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(5)
            .nodePadding(2)
            .size([chartWidth, chartHeight-marginLegend]);

        var path = sankey.link();

        sankey
             .nodes(data.nodes)
             .links(data.links)
             .layout(32);

       // add in the links
         var link = linkG.selectAll(".link")
             .data(data.links)

           link.transition().duration(500)
             .attr("d", path)
             .attr("stroke-width", function(d) { return Math.max(1, d.dy); })
             .sort(function(a, b) { return b.dy - a.dy; });

           link.enter().append("path")
             .attr("class", "link")
             .attr("d", path)
             .attr("stroke-width", function(d) { return Math.max(1, d.dy); })
             .attr('stroke-opacity',0.5)
             .sort(function(a, b) { return b.dy - a.dy; })

          link.exit().remove()


       // add in the nodes
         var node = viz.selectAll(".node")
             //.data(data.nodes, function(d){return d.name})
             .data(data.nodes)


          node
          .each(function(d){
               $(this).popover('destroy')
               $(this).popover({
                 title: allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]],
                 content:format(d.value),
                 placement:'auto top',
                 container: 'body',
                 trigger: 'hover'
                 })
             })
            .on('mouseover',function(d){
              var name = d.name;
              var type = d.sourceLinks.length?'source':'target';
              link.transition()
              .attr('stroke-opacity', 0.2)
              .filter(function(e){
                return e[type].name == name;
              }).transition()
               .attr('stroke-opacity', 0.9)
            })
            .on('mouseout', function(d){
              link.transition()
              .attr('stroke-opacity', 0.5)
            })
          .transition().duration(500)
          .attr("height", function(d) { return d.dy; })
          .attr('x', function(d){return d.x})
          .attr('y', function(d){return d.y})


         node.enter().append("rect")
             .attr("height", function(d) {return d.dy; })
             .attr("width", sankey.nodeWidth())
             .attr('x', function(d){return d.x})
             .attr('y', function(d){return d.y})
             .attr('class', 'node')
            .style("fill", "white")
            .each(function(d){
                 $(this).popover('destroy')
                 $(this).popover({
                   title: allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]],
                   content:format(d.value),
                   placement:'auto top',
                   container: 'body',
                   trigger: 'hover'
                   })
               })
              .on('mouseover',function(d){
                var name = d.name;
                var type = d.sourceLinks.length?'source':'target';
                link.transition()
                .attr('stroke-opacity', 0.2)
                .filter(function(e){
                  return e[type].name == name;
                }).transition()
                 .attr('stroke-opacity', 0.9)
              })
              .on('mouseout', function(d){
                link.transition()
                .attr('stroke-opacity', 0.5)
              })

               node.exit().remove()

       // add in the title for the nodes

       var labels = viz.selectAll(".tabLabels")
                    //.data(data.nodes, function(d){return d.name})
                    .data(data.nodes)

        labels.exit().remove()


         labels.transition().duration(500)
           .attr("y", function(d) { return d.y + d.dy / 2; })
           .text(function(d) { if(d.value >= 5){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]} })
         .filter(function(d) { return d.x < chartWidth / 2; })
            //.text(null)
            .text(function(d) {
              if(!currentStep){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]}
              else{return null;}
              })
           //.text(function(d) { if(d.value >= 5){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]} })


         labels.enter().append("text")
             .attr("x",function(d){return chartWidth -6 -  sankey.nodeWidth()  })
             .attr("y", function(d) { return d.y + d.dy / 2; })
             .attr("dy", ".35em")
             .attr('class', 'tabLabels')
             .attr("text-anchor", "end")
             .text(function(d) { if(d.value >= 5){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]} })
           .filter(function(d) { return d.x < chartWidth / 2; })
             .attr("x", function (d) {return d.x + 6 + sankey.nodeWidth()})
             .attr("text-anchor", "start")
             //.text(null)
             //.text(function(d) { if(d.value >= 5){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]} })
             .text(function(d) {
               if(!currentStep){return allTablesMap[d.name.split('_')[0] + '_' + d.name.split('_')[1]]}
               else{return null;}
               })

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

  sankey.currentStep = function(x){
    if (!arguments.length) return currentStep;
    currentStep = x;
    return sankey;
  }

  sankey.showLabel = function(x){
    if (!arguments.length) return showLabel;
    showLabel = x;
    return sankey;
  }

  sankey.allTablesMap = function(x){
    if (!arguments.length) return allTablesMap;
    allTablesMap = x;
    return sankey;
  }

  sankey.margin = function(x){
    if (!arguments.length) return margin;
    margin = x;
    return sankey;
  }

  return sankey;

  }

})();
