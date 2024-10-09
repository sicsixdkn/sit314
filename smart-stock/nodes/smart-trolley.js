const coap         = require("coap");
const tEcsda       = require("./t-ecdsa");
const crypto       = require("crypto");
const {v4: uuidv4} = require("uuid");

// CoAP server address
const serverAddress = "coap://localhost:30000/api/"; // Fog load balancer, ends up routing to the cloud
// const serverAddress = "coap://localhost/api/"; // Docker instance

// Random GUID for the smart trolley
const trolleyId = uuidv4();

// The following generates cryptographic keypairs for the smart trolley that will be stored in the fog node's database.
// This is to ensure that the smart trolley can be authenticated by the fog node when it sends data.
const {privateKey, publicKey} = crypto.generateKeyPairSync("ec", {namedCurve: "secp256k1"});

// Store the public key in the fog node's database when the connection starts
// In a real-world scenario, this would be done when the trolley is registered with the system during setup
// rather than on boot
coapPOST(`smart-trolley/register`, {
    trolleyId,
    publicKey: publicKey.export({
        format: "pem",
        type:   "spki"
    })
});

// Generate a random number of items that will be in this trolley before the user leaves
let itemCount          = Math.floor(Math.random() * 10) + 1;
let currentItemCounter = 0;

// Set an interval to send scanned item data every second, emulating a user adding items to the trolley
setInterval(function () {
    // Generate a random scanned item ID between 1 and 10
    const itemId = Math.floor(Math.random() * 10) + 1;
    // Send the item scan event
    coapPOST(`smart-trolley/add-item`, {trolleyId, itemId});

    currentItemCounter++;
    console.log(`Scanned item ${currentItemCounter} of ${itemCount}`);
    // Once the user has scanned all items, emulate a checkout event
    if (currentItemCounter >= itemCount) {
        // Determine the checkout ID (fixed at 1, but this would be picked up from a nearby checkout)
        const checkoutId = 1;
        // Publish the checkout event
        coapPOST(`smart-trolley/checkout`, {trolleyId, itemCount, checkoutId});
        // Reset the trolley for the next user
        currentItemCounter = 0;
        itemCount          = Math.floor(Math.random() * 10) + 1;
    }
}, 1000);

function coapPOST(url, message) {
    // Sign the message and encrypt the signature, returns an object with the message, encrypted signature, and IV
    const payload     = tEcsda.signMessage(JSON.stringify(message), privateKey, Date.now());
    const jsonPayload = JSON.stringify(payload);

    // Send a CoAP POST request with the message payload
    const req = coap.request(serverAddress + url, {method: "POST"});

    req.write(jsonPayload);
    req.on("response", function (res) {
        console.log(`POST Complete - URL: ${url}, Payload: ${jsonPayload}, Response: ${res.code}`);
    });

    req.end();
}
