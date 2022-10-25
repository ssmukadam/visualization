const drawChart = async () => {
  // 1 Loading the csv data
  const deathdays_data = await d3.csv("./data/deathdays.csv");
  const deaths_age_sex_data = await d3.csv("./data/deaths_age_sex.csv");
  const pumps_data = await d3.csv("./data/pumps.csv");
  const streets_data = await d3.json("./data/streets.json");

  d3.csv("/data/deathdays.csv", function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].date);
      console.log(data[i].deaths);
    }
  });

  //Defined variables for map bar and pie chart
  const margins = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 20
  };

  let hoverValue = null;
  const tooltip = d3
    .select(".container")
    .append("div")
    .attr("class", "tooltip");

  //Dimensions of the Map
  const dimensions = {
    Map_Height: 600,
    Map_Width: 700,
    Pie_Height: 300,
    Pie_Width: 300,
  };

  //To hover the age group details
  const map_labels = ["Male", "Female", "Pump", "Brewery", "Work House"];

  const ages = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["0-10", "11-21", "21-40", "41-60", "61-80", ">80"]);

  //Giving colors to different age groups(pie-chart)  
  const pieColors = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["Red", "Blue", "Green", "Orange", "Pink", "Yellow"]);

  const mapLegendColorScale = d3
    .scaleOrdinal()
    .domain(map_labels)
    .range(["Blue", "Orange"]);

  const svg = d3
    .select("#chart-map")
    .append("svg")
    .attr("width", dimensions.Map_Width)
    .attr("height", dimensions.Map_Height);

  //scales for x and y
  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(
        streets_data.reduce((acc, curr) => acc.concat(curr), []),
        (d) => d.x
      )
    )
    .range([0, dimensions.Map_Width]);

  const y = d3
    .scaleLinear()
    .domain(
      d3.extent(
        streets_data.reduce((acc, curr) => acc.concat(curr), []),
        (d) => d.y
      )
    )
    .range([dimensions.Map_Height - margins.top, 0]);

  const mapLines = d3
    .line()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  const mapLegend = svg
    .append("g")
    .attr("class", "map-legend")
    .attr("transform", `translate(10, ${margins.top / 2})`);

  //Circle Icons above the Map  
  mapLegend
    .selectAll("circle")
    .data(map_labels)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => i * (dimensions.Map_Width / map_labels.length))
    .attr("cy", (d, i) => i * (dimensions.Map_Width / map_labels.length))
    .attr("r", 10)
    .attr("fill", (d) => mapLegendColorScale(d));

  mapLegend
    .selectAll("text")
    .data(map_labels)
    .enter()
    .append("text")
    .attr("x", (d, i) => 15 + i * (dimensions.Map_Width / map_labels.length))
    .attr("y", 0)
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .text((d) => d);

  const mapContainer = svg
    .append("g")
    .attr("class", "map-container")
    .attr("transform", `translate(0, ${margins.top})`);

  //Drawing the street lines of the map  
  streets_data.forEach((street) => {
    mapContainer
      .append("path")
      .attr("d", mapLines(street))
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("fill", "none");

  });

  // Adds a work-house circle in the map
  mapContainer
    .append("circle")
    .attr("class", "work-house-circle")
    .attr("cx", 150)
    .attr("cy", 200)
    .attr("r", "10px")
    .attr("fill", "Black")
    .attr("stroke", "none")
    .style("pointer-event", "none");

  //Adds a Brewery circle in the map  
  mapContainer
    .append("circle")
    .attr("class", "brewery-circle")
    .attr("cx", 300)
    .attr("cy", 500)
    .attr("r", "10px")
    .attr("fill", "Grey")
    .attr("stroke", "none")
    .style("pointer-event", "none");

  // Adds the street name Broad Street
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15 px")
    .attr("transform", "translate(380,250) rotate(-22)")
    .text("BROAD STREET")

  // Adds the street name Brewer Street
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(450,400) rotate(-36)")
    .text("BREWER STREET");

  // Adds the street name Dean Street
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(655,200) rotate(60)")
    .text("DEAN STREET");

  // Adds the street name Soho Square
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(620,100) rotate(-20)")
    .text("SOHO SQUARE")

  //Adds the street name Recents Quadrant  
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(400,480) rotate(0)")
    .text("RECENTS QUADRANT");

  // Adds the street name Oxford Street
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(350,55) rotate(-6)")
    .text("OXFORD STREET");

  //Adds the street name Recent Street  
  mapContainer
    .append("text")
    .style("fill", "Black")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(180,320) rotate(58)")
    .text("RECENT STREET");

  const pump = mapContainer
    .append("g")
    .selectAll(".pump-circle")
    .data(pumps_data);

  pump
    .enter()
    .append("circle")
    .attr("class", "pump-circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 6)
    .attr("fill", "Darkgreen")
    .style("cursor", "pointer");

  const death = svg
    .append("g")
    .selectAll(".age-sex-circle")
    .data(deaths_age_sex_data);

  death
    .enter()
    .append("circle")
    .attr("class", "age-sex-circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 6)
    .attr("fill", (d) =>
      +d.gender === 0
        ? mapLegendColorScale("Male")
        : mapLegendColorScale("Female")
    )
    .style("cursor", "pointer")
    .on("mouseover", function (event, data) {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Age: ${ages(data.age)}<br/>Sex: ${data.gender === "0" ? "Male" : "Female"
          }`
        )
        .style("left", `${event.pageX - 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .style("border", "Red")
        .style("background-color", "Black")
        .style("color", "white")
        .style("border-radius", "2px")
        .style("padding", "3px");
    })
    .on("mousemove", function (event, data) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function (event) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  const pieSvgOne = d3
    .select("#second-pie")
    .append("svg")
    .attr("width", dimensions.Pie_Width)
    .attr("height", dimensions.Pie_Height);

  const pieSvgTwo = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", dimensions.Pie_Width)
    .attr("height", dimensions.Pie_Height);

  const ageArcGroups = d3.sort(d3.group(deaths_age_sex_data, (d) => +d.age), (d) => +d[0]);
  const sexArcGroup = d3.group(deaths_age_sex_data, (d) => +d.gender);

  const ageGroupContainer = pieSvgOne
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.Pie_Width / 2}, ${dimensions.Pie_Height / 2})`
    );
  //Creating charts

  // Naming the Pie chart   
  pieSvgOne
    .append("text")
    .attr("x", dimensions.Pie_Width / 2)
    .attr("y", margins.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .style("font-weight", "semi-bold")
    .text("Number of Deaths by Age Group");

  pieSvgTwo
    .append("text")
    .attr("x", dimensions.Pie_Width / 2)
    .attr("y", margins.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .style("font-weight", "semi-bold")
    .text("Number of Deaths by Sex");

  const pie = d3
    .pie()
    .value((d) => d[1].length)
    .sort(null);

  const path = d3
    .arc()
    .outerRadius(dimensions.Pie_Height / 2 - margins.top)
    .innerRadius(0);

  const ageArcs = ageGroupContainer
    .selectAll(".arcs")
    .data(pie(ageArcGroups))
    .enter()
    .append("g")
    .attr("class", "arcs");

  ageArcs
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => pieColors(d.data[0]))
    .attr("opacity", 0.5)
    // .attr("stroke", "#ddd")
    .attr("stroke-width", "0.5px")
    .style("cursor", "pointer")
    .on("mouseover", function (event, data) {
      hoverValue = data.data[0];
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", (d) => (hoverValue === +d.age ? 1 : 0));
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Age Range: ${ages(data.data[0])}<br/>Percentage: ${(data.data[1].length / deaths_age_sex_data.length).toFixed(2) *
          100 +
          "%"
          }<br>No. of Deaths: ${data.data[1].length}`
        )
        .style("left", `${event.pageX - 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .style("border", "1px solid #8A0100")
        .style("background-color", "Black")
        .style("color", "Black")
        .style("border-radius", "5px")
        .style("padding", "5px");
    })
    .on("mousemove", function (event, data) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function (event) {
      hoverValue = "";
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  ageArcs
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text((d) => ages(d.data[0]))
    .style("pointer-events", "none");

  const sexGroupContainer = pieSvgTwo
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.Pie_Width / 2}, ${dimensions.Pie_Height / 2})`
    );

  const sexArcs = sexGroupContainer
    .selectAll(".sex-arcs")
    .data(pie(sexArcGroup))
    .enter()
    .append("g")
    .attr("class", "sex-arcs");

  sexArcs
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.data[0] === 0
        ? mapLegendColorScale("Male")
        : mapLegendColorScale("Female")
    )
    .attr("opacity", 0.8)
    .attr("stroke", "#ddd")
    .attr("stroke-width", "0.5px")
    .style("cursor", "pointer")
    .on("mouseover", function (event, data) {
      hoverValue = data.data[0];
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", (d) => (hoverValue === +d.gender ? 1 : 0));
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Sex: ${data.data[0] === 0 ? "Male" : "Female"}<br/>Deaths: ${data.data[1].length
          }`
        )
        // .style("left", `${event.pageX - 10}px`)
        // .style("top", `${event.pageY - 10}px`)
        .style("border", "1px solid black")
        .style("background-color", "white")
        .style("color", "black")
        .style("border-radius", "2px")
    })
    .on("mousemove", function (event, data) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function (event) {
      hoverValue = "";
      d3.selectAll(".age-sex-circle")
        // .transition()
        // .duration(100)
        .attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  sexArcs
    //Appending the text horizontally
    .append("text")
    .attr(
      "transform",
      (d) => `translate(${path.centroid(d)[0]}, ${path.centroid(d)[1] - 30})`
    )
    //Adding the Male Female tag to the pie chart
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-color", "black")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text((d) => (+d.data[0] === 0 ? "Male" : "Female"));

  //Adding the percentage details in the pie chart(deaths by sex)
  sexArcs
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-color", "white")
    .attr("font-weight", "bold")
    .text(
      (d) =>
        Math.round((d.data[1].length / deaths_age_sex_data.length) * 100) + "%"
    )
    .style("pointer-events", "none");

  //timeline graph

};

drawChart(); 