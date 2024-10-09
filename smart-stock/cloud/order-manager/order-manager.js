const mongoose        = require("mongoose");
const Order           = require("./models/Order");
const DeliveryRequest = require("./models/DeliveryRequest");
const express         = require("express");
const {v4: uuidv4}    = require("uuid");

const mongoUri           = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const deliveryManagerUri = process.env.DELIVERY_MANAGER_URI || "http://localhost:3005";

mongoose.connect(mongoUri);

const app  = express();
const port = process.env.PORT || 3004;
app.use(express.json());

// Health check endpoint
app.get("/api/order/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/order/place", async function (req, res) {
    const body = req.body;

    try {
        // Create a new order object
        let order = new Order({
            timestamp: new Date(),
            orderId:   uuidv4(), // Generate a random order ID
            itemCount: body.itemCount,
            itemId:    body.itemId
        });

        console.log(`Placing order for item ${body.itemId} - ${body.itemCount} items`);

        // Save the order object to the database
        await order.save();

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error processing order"});
    }

    // If there are more than 3 orders in the system, create a new delivery request and delete the orders
    try {
        let orders = await Order.find({});
        if (orders.length > 3) {
            let deliveryRequest = new DeliveryRequest({
                timestamp:  new Date(),
                deliveryId: uuidv4(),
                orders:     orders.map(order => {
                    return {
                        orderId:   order.orderId,
                        itemCount: order.itemCount,
                        itemId:    order.itemId
                    };
                })
            });
            await deliveryRequest.save();
            await Order.deleteMany({});

            console.log(`Created delivery request ${deliveryRequest.deliveryId} for ${deliveryRequest.orders.length} orders`);

            // External service request to schedule the delivery
            await fetch(`${deliveryManagerUri}/api/delivery/schedule`, {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({deliveryId: deliveryRequest.deliveryId})
            }).then(response => {
                if (!response.ok) {
                    console.error("Delivery Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Delivery Manager request:", error);
            });
        }
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Order Manager listening on port ${port}`);
});