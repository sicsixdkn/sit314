const query = { trolleyId: msg.payload.trolleyId };

msg.originalPayload = msg.payload;
msg.payload = [query, null];

return msg;