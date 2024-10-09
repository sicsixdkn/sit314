// store_data.js

// Get the sensors ID from the topic
let sensorId = msg.topic.split('/').pop();

// Get the sensor data from the flow, or create an empty object if it doesn't exist
let sensorData = flow.get('sensorData') || {};

// Store the reading in the sensor data object
sensorData[sensorId] = msg.payload;

// Store the updated sensor data object back in the flow
flow.set('sensorData', sensorData);

return msg;