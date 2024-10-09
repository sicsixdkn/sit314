const express = require('express');
const app = express();
const port = 3050;

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});