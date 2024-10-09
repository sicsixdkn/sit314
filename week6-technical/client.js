let request = require('request');

let url = `http://localhost:3000/sensorData`;

request(url, function (err, response, body) {
    if(err){
        console.log('error:', error);
    } else {
        let sensorData = JSON.parse(body);
        console.log(sensorData);
        console.log(sensorData.id);
        console.log(sensorData.name);
        console.log(sensorData.address);
        console.log(sensorData.time);
        console.log(sensorData.temperature);
    }
});