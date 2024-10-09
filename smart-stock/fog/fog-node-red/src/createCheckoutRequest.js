let newPayload = {}

if (msg.payload === null) {
    newPayload.items = [];
}
else {
    newPayload.items = msg.payload.items;
}

newPayload.trolleyId = msg.payload.trolleyId;

msg.payload = newPayload;
return msg;

