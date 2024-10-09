const mongoose        = require("mongoose");
const DeliveryRequest = require("./models/DeliveryRequest");
const express         = require("express");

const mongoUri        = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const stockManagerUri = process.env.STOCK_MANAGER_URI || "http://localhost:3002";
const shelfManagerUri = process.env.SHELF_MANAGER_URI || "http://localhost:3001";

mongoose.connect(mongoUri);

const app  = express();
const port = process.env.PORT || 3003;
app.use(express.json());

// Health check endpoint
app.get("/api/schedule/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/schedule/restock", async function (req, res) {
    const body = req.body;

    try {
        // Here the request would be processed, sent to the staff, and the shelf would be restocked
        // This is emulated, just log the request to the console
        console.log(`Staff are restocking ${body.restockCount} of item ${body.itemId} to shelf ${body.shelfId}`);

        // External service request to add items to the shelf
        fetch(`${shelfManagerUri}/api/shelf/add`, {
            method:  "POST",
            headers: {"Content-Type": "application/json"},
            body:    JSON.stringify({itemId: body.itemId, itemCount: body.restockCount, shelfId: body.shelfId})
        }).then(response => {
            if (!response.ok) {
                console.error("Shelf Manager request failed with status:", response.status);
            }
        }).catch(error => {
            console.error("Error during Shelf Manager request:", error);
        });

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error processing restock request"});
    }
});

app.post("/api/schedule/unpack", async function (req, res) {
    const body = req.body;

    try {
        // Here the request would be processed, sent to the staff, and the items would be unpacked
        // This is emulated, just log the request to the console
        console.log(`Staff are unpacking delivery ${body.deliveryId}`);

        // Fetch the DeliveryRequest from the database
        let deliveryRequest = await DeliveryRequest.findOne({deliveryId: body.deliveryId});
        if (!deliveryRequest) {
            res.status(404).send({message: "Delivery request not found"});
            return;
        }

        for (let order of deliveryRequest.orders) {
            // External service request to add items to the stock
            console.log(`Adding ${order.itemCount} of item ${order.itemId} to stock`);
            fetch(`${stockManagerUri}/api/stock/add`, {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({itemId: order.itemId, itemCount: order.itemCount})
            }).then(response => {
                if (!response.ok) {
                    console.error("Stock Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Stock Manager request:", error);
            });
        }

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error updating GPS coordinates"});
    }
});

app.listen(port, () => {
    console.log(`Schedule Manager listening on port ${port}`);
});