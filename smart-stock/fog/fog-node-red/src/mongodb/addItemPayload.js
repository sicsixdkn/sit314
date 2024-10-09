const trolleyId = msg.payload.trolleyId;
const newItem = msg.payload.item;

const query = { trolleyId: trolleyId };

const update = {
    $push: { items: newItem }
};

const options = { upsert: true };

msg.payload = [query, update, options];

return msg;
