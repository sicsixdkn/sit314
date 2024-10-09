// Get the truck ID from the parameters, default to 1
const truckId = process.argv[2] || "1";

// Cloud server address
const serverAddress = "http://34.203.203.24/api/";

let currentGPS = {
    latitude:  0,
    longitude: 0
};

// Just going to emulate a simple linear journey from start to end
let startGPS = {
    latitude:  0,
    longitude: 0
};

let endGPS = {
    latitude:  10,
    longitude: 10
};

let startedJourney = false;

setInterval(function () {

    if (!startedJourney) {
        currentGPS.latitude  = startGPS.latitude;
        currentGPS.longitude = startGPS.longitude;
        startedJourney       = true;
    }
    // Check if within +- 0.1 of the end GPS
    else if (Math.abs(currentGPS.latitude - endGPS.latitude) <= 0.1 && Math.abs(currentGPS.longitude - endGPS.longitude) <= 0.1) {
        startedJourney       = false;
        currentGPS.latitude  = endGPS.latitude;
        currentGPS.longitude = endGPS.longitude;
    } else {
        // Gradually move towards the end GPS
        currentGPS.latitude += (endGPS.latitude - startGPS.latitude) / 10;
        currentGPS.longitude += (endGPS.longitude - startGPS.longitude) / 10;
    }

    const payload = JSON.stringify({truckId, current_gps: currentGPS});

    try {
        // Send the GPS data
        fetch(serverAddress + "delivery/gps-update", {
            method:  "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:    payload
        }).then(function (res) {
            console.log(`POST Complete - URL: truck/update-location, Payload: ${payload}, Response: ${res.status}`);
        });
    } catch (error) {
        console.error(error);
    }
}, 1000);
