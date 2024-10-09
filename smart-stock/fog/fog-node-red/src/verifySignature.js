const req = global.get('require');
const crypto = req("crypto");
const { ec: EC } = req("elliptic");

// Initialize elliptic curve
const ec = new EC("secp256k1");  // Using secp256k1 curve

// Function to generate a timestamp-based key
function generateTimeKey(timestamp) {
    // Turn into seconds
    timestamp = Math.floor(timestamp / 1000);
    // Convert the timestamp to a buffer
    const timeBuffer = Buffer.from(timestamp.toString(), "utf-8");

    // Multiply the timestamp with the curve's generator point (R = T * g)
    const generator = ec.g;
    const R = generator.mul(timeBuffer);

    // Extract the x-coordinate from point R
    const xCoord = R.getX().toString("hex");

    // Hash the x-coordinate using SHA-256 to create the time-based key (SIGKEY)
    const hash = crypto.createHash("sha256");
    hash.update(xCoord);
    const hx = hash.digest();

    // Base64 encode the hash to get the SIGKEY
    return hx.toString("base64");
}

// Verify the message signature
function verifySignature(message, encryptedSignature, iv, publicKey, timestamp, maxTimeDifference) {
    for (let i = 0; i < maxTimeDifference; i++) {
        try {
            // Decrypt the signature using the time-based key
            const key = generateTimeKey(timestamp - i * 1000);
            const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "base64"), Buffer.from(iv, "hex"));
            let decrypted = decipher.update(encryptedSignature, "hex", "utf-8");
            decrypted += decipher.final("utf-8");

            // Verify the signature
            const verify = crypto.createVerify("sha256");
            verify.update(message);
            verify.end();
            return verify.verify(publicKey, decrypted, "hex");
        } catch (e) {
        }
    }

    return false;
}

const publicKey = msg.payload.message.publicKey || msg.payload.publicKey;

const verified = verifySignature(JSON.stringify(msg.payload.message), msg.payload.encryptedSignature, msg.payload.iv, publicKey, Date.now(), 2);
const output = {res: msg.res, statusCode: msg.statusCode, payload: msg.payload.message};
if (verified) {
    return [output, null];
}
output.statusCode = 401;
return [null, output];
