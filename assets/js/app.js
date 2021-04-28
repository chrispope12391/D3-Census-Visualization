// @TODO: YOUR CODE HERE!
console.log("app.js loaded");


//if the svg area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
    svgArea.remove();
}

// svg wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = 900;
var svgHeight = 700;

var margin = {
    top: 50,
    right: 50,
    bottom: 120,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {

    console.log(stateData);

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(stateData, d => d.age));

    var yLinearScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(stateData, d => d.smokes));

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y1-axis to the left side of the display
    chartGroup.append("g").call(leftAxis);

    var circleGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var abbrGroup = chartGroup.selectAll("null")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.age) - 8)
    .attr("y", d => yLinearScale(d.smokes) + 7)
    .style("font-size", "13px")
    .style("font-weight", "bold");

    var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 30})`);

    var yLabels = chartGroup.append("g")
    .attr("transform", "rotate(-90)", `translate(${width}, ${height + 90})`);

    var medianAge = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .style("font-size", "16px")
    .text("Age (Median)");

    var povertyLevel = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .style("font-size", "16px")
    .text("In Poverty (%)");

    var income = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 70)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .style("font-size", "16px")
    .text("Household Income (Median)");

    var smokePercent = yLabels.append("text")
    .attr("x", 0- 280)
    .attr("y", 0 - 80)
    .attr("value", "smokes")
    .classed("inactive", true)
    .style("font-size", "16px")
    .text("Obese (%)");

    var smokePercent = yLabels.append("text")
    .attr("x", 0- 280)
    .attr("y", 0 - 55)
    .attr("value", "smokes")
    .classed("inactive", true)
    .style("font-size", "16px")
    .text("Lacks Healthcare (%)");

    var smokePercent = yLabels.append("text")
    .attr("x", 0- 280)
    .attr("y", 0 - 30)
    .attr("value", "smokes")
    .classed("active", true)
    .style("font-size", "16px")
    .text("Smokes (%)");


    // chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left - 4)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .classed("axis-text", true)
    // .text("Smokes (%)")
    // .style("font-size", "16px")
    // .style("font-weight", "bold");

}).catch(function(error) {
    console.log(error);
});