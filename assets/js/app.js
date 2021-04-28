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

var chosenXAxis = "age";

function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(stateData, d => d[chosenXAxis]));

    return xLinearScale;

};

function renderAxes(newXscale, xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);

    return xAxis;
};

function renderCircles(circleGroup, newXscale, chosenXAxis) {

    circleGroup.transition()
        .duration(500)
        .attr("cx", d => newXscale(d[chosenXAxis]));
    
    return circleGroup;
};

function renderAbbr(abbrGroup, newXscale, chosenXAxis) {

    abbrGroup.transition()
        .duration(500)
        .attr("x", d => newXscale(d[chosenXAxis]));
    
    return abbrGroup;
};

function updateToolTip(chosenXAxis, circleGroup) {

    var label;

    if (chosenXAxis === "age") {
        label = "Median Age:";
    }
    else if (chosenXAxis === "poverty") {
        label = "Poverty Percentage:";
    }
    else {
        label = "Median Household Income:";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80,-80])
    .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
        .on("mouseout", function(data,index) {
            toolTip.hide(data);
        });

    return circleGroup;
};


d3.csv("assets/data/data.csv").then(function(stateData, err) {
    if (err) throw err;

    console.log(stateData);

    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = xScale(stateData, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(stateData, d => d.smokes));

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y1-axis to the left side of the display
    chartGroup.append("g").call(leftAxis);

    var circleGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var abbrGroup = chartGroup.selectAll("null")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 8)
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

    var circleGroup = updateToolTip(chosenXAxis, circleGroup);

    var abbrGroup = updateToolTip(chosenXAxis, abbrGroup);

    xLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                chosenXAxis = value;

                console.log(chosenXAxis);

                xLinearScale = xScale(stateData, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circleGroup = renderCircles(circleGroup, xLinearScale, chosenXAxis);

                circleGroup = updateToolTip(chosenXAxis, circleGroup);

                abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis);

                abbrGroup = updateToolTip(chosenXAxis, abbrGroup);

                if (chosenXAxis === "poverty") {
                    povertyLevel
                    .classed("active", true)
                    .classed("inactive", false);
                    medianAge
                    .classed("active", false)
                    .classed("inactive", true);
                    income
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    income
                    .classed("active", true)
                    .classed("inactive", false);
                    povertyLevel
                    .classed("active", false)
                    .classed("inactive", true);
                    medianAge
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    income
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLevel
                    .classed("active", false)
                    .classed("inactive", true);
                    medianAge
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });


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