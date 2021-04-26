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
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

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

        var xLinearScale = d3.scaleLinear().range([0, width]);

        var ageMax = d3.max(stateData, d => d.age);

        xLinearScale.domain([0, ageMax]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.healthcare)])
            .range([height, 0]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale)
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Add y1-axis to the left side of the display
        chartGroup.append("g").call(leftAxis);

    

    
    })
}).catch(function(error) {
    console.log(error);
});