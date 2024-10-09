const query = {
    trolleyId: msg.payload.message.trolleyId
}

msg.originalPayload = msg.payload;
msg.payload = [query, null];
return msg;