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
var svgHeight = 500;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
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


    // var ageMax = d3.max(stateData, d => d.age);
    // var smokesMax = d3.max(stateData, d => d.smokes);

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

}).catch(function(error) {
    console.log(error);
});