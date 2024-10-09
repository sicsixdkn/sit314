let request = require("request");
const util  = require("util");

let url = `http://sit314loadbalancer-1592342266.us-east-1.elb.amazonaws.com/api/weather`;

// Promisify the request functions
const post = util.promisify(request.post);
const get  = util.promisify(request.get);
const put  = util.promisify(request.put);
const del  = util.promisify(request.delete);


async function runClientTests() {
    try {
        // POST request to add a new temperature reading
        let response = await post({
            url:  url,
            json: {temperature: 25, location: "Melbourne"}
        });
        console.log("\nNew temperature reading added:", response.body.temperature);

        // GET request to get the latest temperature reading
        response   = await get(`${url}/latest`);
        let latest = JSON.parse(response.body);
        console.log("\nLatest temperature reading:", latest.temperature);

        // POST requests to add two more temperature readings
        response = await post({
            url:  url,
            json: {temperature: 30, location: "Melbourne"}
        });
        console.log("\nNew temperature reading added:", response.body.temperature);

        response = await post({
            url:  url,
            json: {temperature: 35, location: "Melbourne"}
        });
        console.log("\nNew temperature reading added:", response.body.temperature);

        // GET request to get the latest temperature reading,
        response = await get(`${url}/latest`);
        latest   = JSON.parse(response.body);
        console.log("\nLatest temperature reading:", latest.temperature);

        // PUT request to update a temperature reading by ID
        response = await put({
            url:  `${url}/${latest._id}`,
            json: {temperature: 40, location: "Sydney"}
        });
        console.log("\nLatest temperature reading updated:", response.body.temperature);

        // GET request to get the updated (latest) temperature reading
        response    = await get(`${url}/latest`);
        latest = JSON.parse(response.body);
        console.log("\nRetrieved updated temperature reading:", latest.temperature);

        // DELETE request to delete the temperature reading by ID
        response = await del(`${url}/${latest._id}`);
        let deleted = JSON.parse(response.body);
        console.log("\nTemperature reading deleted:", deleted.temperature);

        // GET request to get the latest temperature reading, should be a different one now
        response = await get(`${url}/latest`);
        latest   = JSON.parse(response.body);
        console.log("\nLatest temperature reading is now:", latest.temperature);

        // GET request to get weather for Melbourne
        response      = await get(`${url}/location/Melbourne`);
        let melbourne = JSON.parse(response.body);
        console.log("\nCurrent temperature in Melbourne:", melbourne.current.temperature);

        // GET request to get weather for Sydney
        response   = await get(`${url}/location/Sydney`);
        let sydney = JSON.parse(response.body);
        console.log("\nCurrent temperature in Sydney:", sydney.current.temperature);

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Run the process
runClientTests();
