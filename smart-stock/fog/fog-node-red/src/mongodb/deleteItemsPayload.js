const query = { trolleyId: msg.originalPayload.trolleyId };

msg.payload = [query, null];

return msg;