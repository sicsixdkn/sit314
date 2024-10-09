const mongoose = require("mongoose");
const Stock    = require("./models/Stock");
const express  = require("express");

const mongoUri        = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const orderManagerUri = process.env.ORDER_MANAGER_URI || "http://localhost:3004";

mongoose.connect(mongoUri).then(async () => {
    console.log("Seeding stock data");
    await Stock.deleteMany({});
    for (let i = 0; i <= 10; i++) {
        let stock = new Stock({
            timestamp: new Date(), itemId: `${i}`, itemCount: 30, minCount: 25, maxCount: 40, onOrder: false
        });
        await stock.save();
    }
});

const app  = express();
const port = process.env.PORT || 3002;
app.use(express.json());

// Health check endpoint
app.get("/api/stock/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/stock/add", async function (req, res) {
    const body = req.body;

    try {
        // Add stock to the database
        let stock = await Stock.findOne({itemId: body.itemId});
        if (!stock) {
            res.status(404).send({message: "Stock not found"});
            return;
        }
        console.log(`Adding ${body.itemCount} of item ${body.itemId} to stock`);
        stock.itemCount += body.itemCount;
        stock.timestamp = new Date();
        stock.onOrder   = false;
        await stock.save();

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error adding stock"});
    }
});

app.post("/api/stock/remove", async function (req, res) {
    const body = req.body;

    try {
        for (let item of body.items) {
            // Remove stock from the database
            let stock = await Stock.findOne({itemId: item});
            if (!stock) {
                res.status(404).send({message: "Stock not found"});
                return;
            }

            stock.itemCount -= 1;
            stock.timestamp = new Date();
            console.log(`Removing 1 of item ${item} from stock, new count: ${stock.itemCount}`);

            if (stock.itemCount < stock.minCount && !stock.onOrder) {
                stock.onOrder = true;

                // External service request to order more stock
                console.log(`Ordering more stock for item ${stock.itemId}`);
                fetch(`${orderManagerUri}/api/order/place`, {
                    method:  "POST",
                    headers: {"Content-Type": "application/json"},
                    body:    JSON.stringify({itemId: stock.itemId, itemCount: stock.maxCount - stock.itemCount})
                }).then(response => {
                    if (!response.ok) {
                        console.error("Order Manager request failed with status:", response.status);
                    }
                }).catch(error => {
                    console.error("Error during Order Manager request:", error);
                });
            }

            await stock.save();
        }

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error removing stock"});
    }
});

app.listen(port, () => {
    console.log(`Stock Manager listening on port ${port}`);
});