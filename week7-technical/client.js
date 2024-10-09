let request = require('request');

let url = `http://localhost:3000`;

//first create request new sensor reading with POST.
request.post(url, async function (err, response, body) {
    if(err){
        console.log('error:', err);
    } else {
        console.log("New sensor data requested");
    }
});

//first read the data using GET.
request(url, async function (err, response, body) {
    if(err){
        console.log('error:', err);
    } else {
        let sensorDocuments = JSON.parse(body);
        console.log(sensorDocuments);
    }
});

//first read the data using GET.
let url2 = `http://localhost:3000/66c92e8fe3053f5825311dce`;
request(url2, async function (err, response, body) {
    if(err){
        console.log('error:', err);
    } else {
        let sensorDocuments = JSON.parse(body);
        console.log(sensorDocuments);
    }
});

// PUT request to update a sensor reading by ID
request.put({
    url: url2,
    json: {name: "Updated Name", address: "Updated Address", time: new Date(), temperature: 25}
}, function (err, response, body) {
    if (err) {
        console.log('error:', err);
    } else {
        console.log("Sensor data updated:", body);
    }
});

// Read again using GET to see the updated data
request(url2, async function (err, response, body) {
    if(err){
        console.log('error:', err);
    } else {
        let sensorDocuments = JSON.parse(body);
        console.log(sensorDocuments);
    }
});

// DELETE request to delete a sensor reading by ID
request.delete(url2, function (err, response, body) {
    if (err) {
        console.log('error:', err);
    } else {
        console.log("Sensor data deleted:", body);
    }
});

// Try to read the data again using GET, should return an error
request(url2, async function (err, response, body) {
    if(err){
        console.log('error:', err);
    } else {
        let sensorDocuments = JSON.parse(body);
        console.log(sensorDocuments);
    }
});