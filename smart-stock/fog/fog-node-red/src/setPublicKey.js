if (msg.payload === null) {
    msg.payload    = msg.originalPayload;
    msg.statusCode = 401;
    return [null, msg];
}

msg.originalPayload.publicKey = msg.payload.publicKey;
msg.payload = msg.originalPayload;
return [msg, null];