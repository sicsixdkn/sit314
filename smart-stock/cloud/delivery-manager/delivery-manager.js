const mongoose      = require("mongoose");
const DeliveryTruck = require("./models/DeliveryTruck");
const express       = require("express");
const {v4: uuidv4}  = require("uuid");

const mongoUri           = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const scheduleManagerUri = process.env.SCHEDULE_MANAGER_URI || "http://localhost:3003";

mongoose.connect(mongoUri).then(async () => {
    // Seed with delivery trucks
    console.log("Seeding delivery trucks");
    await DeliveryTruck.deleteMany({});
    for (let i = 1; i <= 3; i++) {
        let deliveryTruck = new DeliveryTruck({
            timestamp:   new Date(),
            truckId:     `${i}`,
            current_gps: {latitude: 0, longitude: 0},
            deliveryId:  ""
        });
        await deliveryTruck.save();
    }
});

const app  = express();
const port = process.env.PORT || 3005;
app.use(express.json());

// Health check endpoint
app.get("/api/delivery/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/delivery/schedule", async function (req, res) {
    const body = req.body;

    try {
        // Find an available delivery truck
        let truck = await DeliveryTruck.findOne({deliveryId: ""});
        if (!truck) {
            res.status(404).send({message: "No available delivery trucks"});
            return;
        }

        // Assign the delivery to the truck
        truck.deliveryId = body.deliveryId;
        await truck.save();

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error processing delivery request"});
    }
});

app.post("/api/delivery/gps-update", async function (req, res) {
    const body = req.body;

    let deliveryComplete = false;
    let deliveryId       = "";
    try {
        // Find the delivery truck
        let truck = await DeliveryTruck.findOne({truckId: body.truckId});
        if (!truck) {
            res.status(404).send({message: "Truck not found"});
            return;
        }

        // Update the truck's GPS coordinates
        truck.current_gps = body.current_gps;

        // Just pretend the delivery is complete if the truck is at 10, 10
        if (truck.deliveryId && truck.current_gps.latitude === 10 && truck.current_gps.longitude === 10) {
            console.log(`Delivery ${truck.deliveryId} complete`);
            deliveryComplete = true;
            deliveryId       = truck.deliveryId;
            truck.deliveryId = "";
            await truck.save();
        }

        await truck.save();

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error updating GPS coordinates"});
    }

    if (deliveryComplete) {
        // External service request to notify the schedule manager
        try {
            await fetch(`${scheduleManagerUri}/api/schedule/unpack`, {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({deliveryId})
            }).then(response => {
                if (!response.ok) {
                    console.error("Schedule Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Schedule Manager request:", error);
            });
        } catch (error) {
            console.error(error);
        }
    }
});

app.listen(port, () => {
    console.log(`Delivery Manager listening on port ${port}`);
});