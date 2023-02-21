// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left:50, right:50, top:50, bottom:50};
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right);

// create svg in vis1 div
const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// read scatter plot data
d3.csv("data/scatter-data.csv").then((DATA) => {

    // Scaling constants
    const X_SCALE = d3.scaleLinear()
        .domain([0, 10])
        .range([0, VIS_WIDTH]);
    const Y_SCALE = d3.scaleLinear()
        .domain([10, 0])
        .range([0, VIS_HEIGHT]);

	// Plots each of the data points
	FRAME1.selectAll("points")
        .data(DATA)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top) ; })
        .attr("r", 10)
        .attr("class", "point");

	// Add both axis' to vis1
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(10))
        .attr("font-size", "15px");
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
        .attr("font-size", "15px");

    // function for adding last point text
    function clickedPoint() {
        // Print this point coordinates on the right side
        let x_coord = d3.select(this).attr("cx");
        let y_coord = d3.select(this).attr("cy");

        x_coord = Math.round(X_SCALE.invert(x_coord - MARGINS.left));
        y_coord = Math.round(Y_SCALE.invert(y_coord - MARGINS.top));
        
        document.getElementById("recent_point").innerHTML = "Last Point Clicked: (" + x_coord + "," + y_coord + ")";

        // Toggles the border for each click of the point by adding a new class to the point
        this.classList.toggle('point-border');
    }

    // function to add new point to the scatter
    function newPoint() {
        let x_coord = document.getElementById("x-coord").value;
        let y_coord =  document.getElementById("y-coord").value;

        FRAME1.append("circle")
            .attr("cx", (d) => { return (X_SCALE(x_coord) + MARGINS.left); })
            .attr("cy", (d) => { return (Y_SCALE(y_coord) + MARGINS.top) ; })
            .attr("r", 10)
            .attr("class", "point")
            .on("click", clickedPoint);
    }
    
    // event listener for adding and clicking the points in vis1
    d3.selectAll("#submit").on("click", newPoint);
    d3.selectAll(".point").on("click", clickedPoint);
});

// create svg in vis2 div
const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// read bar chart data
d3.csv("data/bar-data.csv").then((DATA) => {
    // find the max Y for the scaling
	const MAX_Y = d3.max(DATA, (d) => { return parseInt(d.amount); });

    // Scaling constants
	const X_SCALE = d3.scaleBand()
        .domain(DATA.map(function(d) { return d.category; }))
        .range([0, VIS_WIDTH])
        .padding(.2);
	const Y_SCALE = d3.scaleLinear()
        .domain([(MAX_Y+1), 0])
        .range([0, VIS_HEIGHT]);

    // Plots each of the bars
    FRAME2.selectAll("bars")  
        .data(DATA)
        .enter()       
        .append("rect")  
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left; }) 
            .attr("y", (d) => { return Y_SCALE(d.amount) +  MARGINS.top; })
            .attr("width", X_SCALE.bandwidth())
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
            .attr("class", "bar") 

	// Add both axis' to vis2
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(7))
		.attr("font-size", '15px');  
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
		.attr("font-size", '15px');

	// Tooltip for bar plot
    const TOOLTIP = d3.select("#vis2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Show tool tip when mouse hovers over a bar
    function showToolTip(){
        TOOLTIP.style("opacity", 1);
    }

    // Hide tool tip when mouse leaves the area of a bar
    function hideToolTip(){
        TOOLTIP.style("opacity", 0);
    }

    // Moves the tool tip based on where the mouse is, and shows the values of the bar
    function moveToolTip(event, d){
        TOOLTIP.html("Category " + d.category + "<br>Value: " + d.amount)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px");
    }

    // Add event listeners for the mouse events on the bars
    d3.selectAll(".bar")
        .on("mouseover", showToolTip)
        .on("mouseleave", hideToolTip)
        .on("mousemove", moveToolTip);
});  