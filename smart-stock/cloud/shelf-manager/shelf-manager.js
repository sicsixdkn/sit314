const mongoose   = require("mongoose");
const ShelfStock = require("./models/ShelfStock");
const express    = require("express");

const mongoUri           = process.env.MONGO_URI || "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority";
const scheduleManagerUri = process.env.SCHEDULE_MANAGER_URI || "http://localhost:3003";

mongoose.connect(mongoUri).then(async () => {
    // Test seed data
    console.log("Seeding shelf stock data");
    await ShelfStock.deleteMany({});
    for (let i = 0; i <= 10; i++) {
        let shelfStock = new ShelfStock({
            timestamp: new Date(), shelfId: `${i}`, itemId: `${i}`, itemCount: 10, minCount: 5, maxCount: 15
        });
        await shelfStock.save();
    }
});

const app  = express();
const port = process.env.PORT || 3001;
app.use(express.json());

// Health check endpoint
app.get("/api/shelf/health", function (req, res) {
    res.status(200).send({message: "Healthy"});
});

app.post("/api/shelf/remove", async function (req, res) {
    const body = req.body;

    let toRestock = [];

    try {
        for (let item of body.items) {
            // Subtract the item count from the shelf stock
            let shelfStock = await ShelfStock.findOne({itemId: item});
            if (!shelfStock) {
                res.status(404).send({message: "Shelf not found"});
                return;
            }
            shelfStock.itemCount -= 1;
            console.log(`Removing ${item} from shelf ${shelfStock.shelfId}, new count: ${shelfStock.itemCount}`);
            shelfStock.timestamp = new Date();

            if (shelfStock.itemCount < shelfStock.minCount && !shelfStock.restocking) {
                shelfStock.restocking = true;
                toRestock.push(shelfStock);
            }

            await shelfStock.save();
        }
        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error updating shelf stock levels"});
    }

    // External service request to restock the shelf
    try {
        for (let shelfStock of toRestock) {
            // Request a restock from the schedule manager
            console.log(`Requesting restock for item ${shelfStock.itemId} on shelf ${shelfStock.shelfId} - current count: ${shelfStock.itemCount}, min count: ${shelfStock.minCount}, max count: ${shelfStock.maxCount}`);
            const restockCount = shelfStock.maxCount - shelfStock.itemCount;
            await fetch(`${scheduleManagerUri}/api/schedule/restock`, {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    itemId: shelfStock.itemId, shelfId: shelfStock.shelfId, restockCount: restockCount
                })
            }).then(response => {
                if (!response.ok) {
                    console.error("Schedule Manager request failed with status:", response.status);
                }
            }).catch(error => {
                console.error("Error during Schedule Manager request:", error);
            });
        }
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/shelf/add", async function (req, res) {
    const body = req.body;

    try {
        // Add the item count to the shelf stock
        let shelfStock = await ShelfStock.findOne({itemId: body.itemId, shelfId: body.shelfId});
        if (!shelfStock) {
            res.status(404).send({message: "Shelf not found"});
            return;
        }
        console.log(`Adding ${body.itemCount} ${body.itemId} to shelf ${shelfStock.shelfId}`);
        shelfStock.itemCount += body.itemCount;
        shelfStock.timestamp = new Date();
        shelfStock.restocking = false;
        await shelfStock.save();
        res.status(200).send({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error updating shelf stock levels"});
    }
});

app.listen(port, () => {
    console.log(`Shelf Manager listening on port ${port}`);
});