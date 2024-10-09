const query = { trolleyId: msg.payload.trolleyId };

const update = {
    $push: { items: msg.payload.itemId}
};

const options = { upsert: true };

msg.payload = [query, update, options];

return msg;
