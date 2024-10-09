const crypto   = require("crypto");
const {ec: EC} = require("elliptic");

// Initialize elliptic curve
const ec = new EC("secp256k1");

// Generates a timestamp-based key
function generateTimeKey(timestamp) {
    // Turn into seconds
    timestamp        = Math.floor(timestamp / 1000);
    // Convert the timestamp to a buffer
    const timeBuffer = Buffer.from(timestamp.toString(), "utf-8");

    // Multiply the timestamp with the curve's generator point (R = T * g)
    const generator = ec.g;
    const R         = generator.mul(timeBuffer);

    // Extract the x-coordinate from point R
    const xCoord = R.getX().toString("hex");

    // Hash the x-coordinate using SHA-256 to create the time-based key (SIGKEY)
    const hash = crypto.createHash("sha256");
    hash.update(xCoord);
    const hx = hash.digest();

    // Base64 encode the hash to get the SIGKEY
    return hx.toString("base64");
}

// Signs and encrypts a signature for the message using the provided private key and timestamp
function signMessage(message, privateKey, timestamp) {
    // Sign the message
    const sign = crypto.createSign("sha256");
    sign.update(message);
    sign.end();
    const signature = sign.sign(privateKey, "hex");

    // Encrypt the signature using the time-based key
    const key = generateTimeKey(timestamp);
    const iv  = crypto.randomBytes(16);
    const cipher  = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "base64"), iv);
    let encrypted = cipher.update(signature, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // Return the encrypted signature, initialisation vector, and original message
    return {
        message:            message,
        encryptedSignature: encrypted,
        iv:                 iv.toString("hex")
    };
}

// Verify the message signature
function verifySignature(message, encryptedSignature, iv, publicKey, timestamp, maxTimeDifference) {
    // Try to decrypt the signature up to maxTimeDifference seconds before the current time
    for (let i = 0; i < maxTimeDifference; i++) {
        try {
            // Decrypt the signature using a key created from the timestamp
            const key      = generateTimeKey(timestamp - i * 1000);
            const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "base64"), Buffer.from(iv, "hex"));
            let decrypted  = decipher.update(encryptedSignature, "hex", "utf-8");
            decrypted += decipher.final("utf-8");

            // Verify the signature is valid
            const verify = crypto.createVerify("sha256");
            verify.update(message);
            verify.end();
            return verify.verify(publicKey, decrypted, "hex");
        } catch (e) {
            continue;
        }
    }

    return false;
}

module.exports = {
    signMessage,
    verifySignature
};