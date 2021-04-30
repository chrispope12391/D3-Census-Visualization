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


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Apend an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokes";

//function used for updated x-scale var upon clock on acis label
function xScale(stateData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(stateData, d => d[chosenXAxis]));

    return xLinearScale;

};

//function used for updated y-scale var upon clock on axis label
function yScale(stateData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(stateData, d => d[chosenYAxis]));

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXscale, xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);

    return xAxis;
};

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYscale, yAxis) {
    var leftAxis = d3.axisLeft(newYscale);

    yAxis.transition()
        .duration(500)
        .call(leftAxis);

    return yAxis;
};

// function used for updating circles group with a transition to
// new circles by xaxis change
function renderCircles(circleGroup, newXscale, chosenXAxis) {

    circleGroup.transition()
        .duration(500)
        .attr("cx", d => newXscale(d[chosenXAxis]));
    
    return circleGroup;
};

// function used for updating circles group with a transition to
// new circles by yaxis change
function renderYCircles(circleGroup, newYscale, chosenYAxis) {

    circleGroup.transition()
        .duration(500)
        .attr("cy", d => newYscale(d[chosenYAxis]));
    
    return circleGroup;
};


function renderAbbr(abbrGroup, newXscale, chosenXAxis) {

    abbrGroup.transition()
        .duration(500)
        .attr("x", d => newXscale(d[chosenXAxis]) - 8);
    
    return abbrGroup;
};

function renderYAbbr(abbrGroup, newYscale, chosenYAxis) {

    abbrGroup.transition()
        .duration(500)
        .attr("y", d => newYscale(d[chosenYAxis]) + 4);
    
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

function updateYToolTip(chosenYAxis, circleGroup) {

    var label;

    if (chosenYAxis === "smokes") {
        label = "Smokes Percentage:";
    }
    else if (chosenYAxis === "healthcare") {
        label = "Percentae Lacking Healthcare:";
    }
    else {
        label = "Obesity Percentage:";
    }

    if (chosenXAxis === "age") {
        labelX = "Median Age:";
    }
    else if (chosenXAxis === "poverty") {
        labelX = "Poverty Percentage:";
    }
    else {
        labelX = "Median Household Income:";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80,-80])
    .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenYAxis]}<br>${labelX} ${d[chosenXAxis]}`);
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

    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Add y1-axis to the left side of the display
    var yAxis = chartGroup.append("g").call(leftAxis);

    var circleGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .attr("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("opacity", ".5");

    var abbrGroup = chartGroup.selectAll("null")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 8)
    .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
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

    var obesePercent = yLabels.append("text")
    .attr("x", 0- 280)
    .attr("y", 0 - 80)
    .attr("value", "obesity")
    .classed("inactive", true)
    .style("font-size", "16px")
    .text("Obese (%)");

    var healthcarePercent = yLabels.append("text")
    .attr("x", 0- 280)
    .attr("y", 0 - 55)
    .attr("value", "healthcare")
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

    var circleGroup = updateYToolTip(chosenYAxis, circleGroup);

    var abbrGroup = updateYToolTip(chosenYAxis, abbrGroup);

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

        yLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                chosenYAxis = value;

                console.log(chosenYAxis);

                yLinearScale = yScale(stateData, chosenYAxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circleGroup = renderYCircles(circleGroup, yLinearScale, chosenYAxis);

                circleGroup = updateYToolTip(chosenYAxis, circleGroup);

                abbrGroup = renderYAbbr(abbrGroup, yLinearScale, chosenYAxis);

                abbrGroup = updateYToolTip(chosenYAxis, abbrGroup);

                if (chosenYAxis === "healthcare") {
                    healthcarePercent
                    .classed("active", true)
                    .classed("inactive", false);
                    smokePercent
                    .classed("active", false)
                    .classed("inactive", true);
                    obesePercent
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    obesePercent
                    .classed("active", true)
                    .classed("inactive", false);
                    healthcarePercent
                    .classed("active", false)
                    .classed("inactive", true);
                    smokePercent
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    obesePercent
                    .classed("active", false)
                    .classed("inactive", true);
                    healthcarePercent
                    .classed("active", false)
                    .classed("inactive", true);
                    smokePercent
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });


}).catch(function(error) {
    console.log(error);
});