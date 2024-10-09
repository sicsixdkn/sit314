const plotlib = require("nodeplotlib");
const trace1  = {x: [1, 2, 3], y: [1, 2, 3], name: "Calvin", type: "scatter"};
const trace2  = {x: [1, 2, 3], y: [1, 2, 3], name: "Hobbes", type: "scatter"};
const layout  = {showlegend: true, legend: {x: 0.2, y: 0.5}};
const fig     = {data: [trace1, trace2], layout: layout};

plotlib.plot(fig);