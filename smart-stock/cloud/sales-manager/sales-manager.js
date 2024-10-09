const mongoose = require("mongoose");
const Sale     = require("./models/Sale");
const express  = require("express");

const mongoUri        = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const shelfManagerUri = process.env.SHELF_MANAGER_URI || "http://localhost:3001";
const stockManagerUri = process.env.STOCK_MANAGER_URI || "http://localhost:3002";

mongoose.connect(mongoUri);

const app  = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Health check endpoint
app.get("/api/sales/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/sales/checkout", async function (req, res) {
    const body = req.body;

    try {
        // Create a new sale object
        let sale = new Sale({
            timestamp:  new Date(),
            checkoutId: 1, // This would be picked up from a nearby checkout
            trolleyId:  body.trolleyId,
            itemCount:  body.items.length,
            items:      body.items
        });

        console.log(`Processing sale for trolley ${body.trolleyId} - ${body.items.length} items`);

        // Save the sale object to the database
        await sale.save();

        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error processing sale"});
    }

    // External service requests to adjust stock levels
    try {
        await Promise.all([
            fetch(`${shelfManagerUri}/api/shelf/remove`, {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({items: body.items})
            }).then(response => {
                if (!response.ok) {
                    console.error("Shelf Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Shelf Manager request:", error);
            }),

            fetch(`${stockManagerUri}/api/stock/remove`, {
                method:  "POST",
                headers: {"Content-Type": "application/json"},
                body:    JSON.stringify({items: body.items})
            }).then(response => {
                if (!response.ok) {
                    console.error("Stock Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Stock Manager request:", error);
            })
        ]);
    } catch (fetchError) {
        console.error("Error processing external service requests:", fetchError);
    }
});

app.listen(port, () => {
    console.log(`Sales Manager listening on port ${port}`);
});
