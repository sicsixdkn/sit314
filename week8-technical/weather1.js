var weather = require('weather-js');
weather.find({search: 'Melbourne, AU', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);

    console.log(result[0].current.temperature)
});