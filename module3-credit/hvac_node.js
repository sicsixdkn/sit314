const express = require("express");

const app = express();

const port = 3002;

// Air conditioner state
let airConState = "off";

app.put("/airConHeat", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (airConState === "heat") {
        res.end(JSON.stringify({state: "No change"}));
        return;
    }
    // Set air conditioner to heat mode and log the state
    airConState = "heat";
    console.log("Air conditioner is heating");
    res.end(JSON.stringify({state: "heat"}));
});

app.put("/airConCool", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (airConState === "cool") {
        res.end(JSON.stringify({state: "No change"}));
        return;
    }
    // Set air conditioner to cool mode and log the state
    airConState = "cool";
    console.log("Air conditioner is cooling");
    res.end(JSON.stringify({state: "cool"}));
});

app.put("/airConDry", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (airConState === "dry") {
        res.end(JSON.stringify({state: "No change"}));
        return;
    }
    // Set air conditioner to dry mode and log the state
    airConState = "dry";
    console.log("Air conditioner is drying");
    res.end(JSON.stringify({state: "dry"}));
});

app.put("/airConOff", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (airConState === "off") {
        res.end(JSON.stringify({state: "No change"}));
        return;
    }
    // Turn off air conditioner and log the state
    airConState = "off";
    console.log("Air conditioner is off");
    res.end(JSON.stringify({state: "off"}));
});

app.listen(port, () => {
    console.log(`HVAC Node listening on port ${port}`);
});
