$( document ).ready(function() {
  console.log( "ready!" );

  var hopFarmMap = L.map('HopFarmMap').setView([49.955, -122.483], 7);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(hopFarmMap);

  var cdnHopsKgImportAnnualString = "&nbsp: 2009: 2010: 2011: 2012: 2013: 2014;" +
    "Pellets: 883,981: 875,052: 969,257: 938,702: 875,940: 1,032,549;" +
    "Ground, powdered: 66,736: 54,068: 48,664: 74,865: 106,472: 158,466;" +
    "Extract: 125,054: 69,281: 66,714: 67,314: 102,474: 47,310;" +
    "Cones: 24,296: 7,887: 11,961: 25,650: 70,323 : 57,523;";

  var cdnHopsKgImportAnnual = cdnHopsKgImportAnnualString.split(";");
  var n = cdnHopsKgImportAnnual;
  n.map(function(row) {
    var columns = row.split(':');
  });

  var data = "BC Hop Company / Valley Hops,Abbotsford,25,8,49.033161,-122.183740;" +
    "Cascadia Hops,Chilliwack,10,5,49.121378,-121.993238;" +
    "Cedar Valley Hop Yards,Nanaimo,10,6,49.071908,-123.833429;" +
    "Chilliwack Hop Farms,Chilliwack,20,7,49.106458,-121.998146;" +
    "Eagle Valley Hops Estate,Malakwa,7,5,50.934275,-118.807308;" +
    "Grandview Farm,Salt Spring Island,0,0,48.816662,-123.508876;" +
    "HOOH (Bitterbine),Lillooet,5,4,50.697840,-121.930905;" +
    "Hopaganagan Farms,Vernon,2,2,50.232536,-119.131042;" +
    "Hope Bay Hop Farm,Pender Island,0,0,48.775877,-123.255615;" +
    "Hops Canada,Kamlooops,240,20,50.721718,-120.337783;" +
    "Hops Connect,Pemberton,2,2,50.311208,-122.727220;" +
    "Left Fields Farm,Sorrento,2,2,50.881679,-119.505951;" +
    "Persephone Brewing Co.,Gibsons,7,6,49.396444,-123.512874;" +
    "Sartori Hop Farm,Lindell Beach,15,7,49.014637,-122.039888;" +
    "Section 10 Fieldworks,Sorrento,0,0,50.854196,-119.435291;" +
    "Topp's Hops,Abbotsford,13,6,49.069806, -122.139440;";

  var rows = data.split(";");
  var mapItems = [];

  var currentPopup;
  function getPopoverContent(item) {
    return '<strong>' + item.name + '</strong><br />' + item.region + '<br />' + item.acres + ' acres' ;
  }
  function openMapPopover(name) {
    mapItems.map(function(item) {

      if (item.name === name) {
        currentPopup = L.popup()
          .setLatLng([item.lat, item.long])
          .setContent(getPopoverContent(item))
          .openOn(hopFarmMap);
      }
    });
  }

  for (var i = 0;i < rows.length;i++) {

    var itemCollection = rows[i].split(',');

    if (itemCollection) {
      var mapItem = {
        name: itemCollection[0],
        region: itemCollection[1],
        acres: itemCollection[2],
        size: itemCollection[3],
        lat: itemCollection[4],
        long: itemCollection[5]
      };
      if (mapItem.lat) {
        var marker = L.marker([mapItem.lat, mapItem.long])
          .bindPopup(getPopoverContent(mapItem))
          .addTo(hopFarmMap);

        var circle = L.circle([mapItem.lat, mapItem.long], (mapItem.size * 4000), {
          color: '#658268',
          strokeWidth: 1,
          fillColor: '#437547',
          fillOpacity:.2
        }).addTo(hopFarmMap);

        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        marker.on('mouseout', function (e) {
          this.closePopup();
        });

        mapItems.push(mapItem);

      }
      else {
        console.log('NO LAT', mapItem);
      }





    }
  }

  //var x = d3.scale.linear().domain([1, 800]).range([10, 250]);

  function fireMouseOut(e) {
    console.log('out', e);

  }
  function fireMouseOver(e) {
    console.log('over', e);
  }

  var w = 900;
  var h = 400;
  var xScale = d3.scale.linear()
    .domain([0, 240])
    .range([0, w]);

  var svg = d3.select("#HopFarmChart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  mapItems.sort(function (a, b) {
    if (parseInt(a.acres) > parseInt(b.acres)) {
      return -1;
    }
    if (parseInt(a.acres) < parseInt(b.acres)) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  svg.selectAll("rect")
    .data(mapItems)
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("fill", "#658268")
    .attr("width", function(d, i) {
      return xScale(d.acres);
    })
    .attr("y", function(d, i) {
      return i * 21;
    })
    .attr("x", function(d, i) {
      return 168;
    })
    .attr('stroke','red')
    .attr('stroke-width',0)
    .on('mouseover',function(e) {
      fireMouseOver(e);
      openMapPopover(e.name);
      d3.select(this)
        .transition()
        .duration(50)
        .attr("fill", "#3B543E");

      d3.selectAll("text").style('fill', function(d) {
        if (d.name === e.name) {
          return '000000';
        }
      });
      d3.selectAll("text").style('font-size', function(d) {
        if (d.name === e.name) {
          return '12px';
        }
      });

    })
    .on('mouseout',function (e) {
      fireMouseOut(e);

      d3.select(this)
        .transition()
        .duration(400)
        .attr("fill", "#658268");

      d3.selectAll("text").style('fill', function(d) {
        if (d.name === e.name) {
          return '444444';
        }
      });
      d3.selectAll("text").style('font-size', function(d) {
        if (d.name === e.name) {
          return '11px';
        }
      });

    });

  svg.selectAll("text")
    .data(mapItems)
    .enter()
    .append("text")
    .text(function(d) {
      return d.name;
    })
    .attr("y", function(d, i) {
      if (i === 0) {
        return 12;
      }
      return ((i + .5) * 21);

    })
    .attr("x", function(d) {
      return 1;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "#444444")
    .on('mouseover',function(e) {
      fireMouseOver(e);
      openMapPopover(e.name);
      d3.select(this)
        .transition()
        .duration(50)
        .attr("font-size", "12px")
        .attr("fill", "#000000");

      d3.selectAll("rect").style('fill', function(d) {
        if (d.name === e.name) {
          return '3B543E';
        }
        //return '658268';
      });
    })
    .on('mouseout',function (e) {
      fireMouseOut(e);

      d3.select(this)
        .transition()
        .duration(300)
        .attr("font-size", "11px")
        .attr("fill", "#444444");


      d3.selectAll("rect").style('fill', function(d) {
        if (d.name === e.name) {
          return '658268';
        }
        //return '3B543E';
      });
      //.transition()
      //  .duration(400)
      //  .attr("fill", "#658268");
    });

  var p = mapItems;
  //
  //color: '#658268',
  //  stroke: 1,
  //  fillColor: '#437547',
  //  fillOpacity:.2


});
