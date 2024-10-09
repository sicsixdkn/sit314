const express = require('express');
const helmet = require("helmet");
const app = express();
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

const port = 3050;

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});