// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var fs = require('fs');
var R = require("r-script");

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
var Bear = require('./app/models/bear');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD3Vn8hUlBLyV_0lmHZUF2e6AiiVEIJnV4'
});


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// on routes that end in /bears
// ----------------------------------------------------
router.get('/earthquake', function (req, res) {
    var jsonData = JSON.parse(fs.readFileSync('JSON_RealTime_earthquake.json', 'utf8'));

    for (var i = 0; i < jsonData.counters.length; i++) {
        var counter = jsonData.counters[i];
        console.log(counter.counter_name);
    }
    googleMapsClient.reverseGeocode({
        latlng: [42.7707, 13.1322],
    }, function (err, response) {
        if (!err) {

            //console.log(response.json.results);
            //res.json(response.json.results);
        }
    });
    // example.js

    //var out = R("GetDataFrom_INGV_erthquake_last_events.1.2.R").callSync();

    //console.log(out);

    res.json(jsonData);

});

// on routes that end in /bears
// ----------------------------------------------------
router.get('/maps', function (req, res) {
    googleMapsClient.reverseGeocode({
            latlng: [42.7707, 13.1322],
        },
        /*
            // Geocode an address. 
            googleMapsClient.places({
                //address: '1600 Amphitheatre Parkway, Mountain View, CA'
                language: 'en',
                location: [-33.865, 151.038],
                radius: 5000,
                minprice: 1,
                maxprice: 4,
                opennow: true,
                type: 'city'

            }*/

        function (err, response) {
            if (!err) {
                //console.log(response.json.results);
                res.json(response.json.results);
            }
        });

});


// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/bears)
.post(function (req, res) {

    var bear = new Bear(); // create a new instance of the Bear model
    bear.name = req.body.name; // set the bears name (comes from the request)

    bear.save(function (err) {
        if (err)
            res.send(err);

        res.json({
            message: 'Bear created!'
        });
    });


})

// get all the bears (accessed at GET http://localhost:8080/api/bears)
.get(function (req, res) {
    Bear.find(function (err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id
.get(function (req, res) {
    Bear.findById(req.params.bear_id, function (err, bear) {
        if (err)
            res.send(err);
        res.json(bear);
    });
})

// update the bear with this id
.put(function (req, res) {
    Bear.findById(req.params.bear_id, function (err, bear) {

        if (err)
            res.send(err);

        bear.name = req.body.name;
        bear.save(function (err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Bear updated!'
            });
        });

    });
})

// delete the bear with this id
.delete(function (req, res) {
    Bear.remove({
        _id: req.params.bear_id
    }, function (err, bear) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});

/*
app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
    app.use(app.router);
});*/

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);