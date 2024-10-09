const http = require('http');

setInterval(loadtest, 100); //time is in ms
function loadtest()
{
    http.get('http://SIT314LoadBalancer-1592342266.us-east-1.elb.amazonaws.com:3000', (res) => {
        res.on('data', function (chunk) {
            console.log('' + chunk);
        });
    });
}