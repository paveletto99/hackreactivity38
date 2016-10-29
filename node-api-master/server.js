// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var fs = require('fs');
//var R = require("r-script");

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
    key: 'AIzaSyAH2-qz_PV_V-95LgA60x9jQcO1aVg96GM'
});

/*var googleMapsClient = require('@google/maps').createClient({
    clientId: '1026154564975-0b177fniu9it1n8pc4j8fh8nc8ccj3c2.apps.googleusercontent.com',
    clientSecret: '3m6l_5mp72JSYQXdvr1cdLaa',
});*/

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
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

    var quakeData = JSON.parse(fs.readFileSync('JSON_RealTime_earthquake.json', 'utf8'));
    var riskData = JSON.parse(fs.readFileSync('JSON_EarthquakeRiskMap.json', 'utf8'));

    var result = new Array();
    console.log(quakeData.lenght);
    for (var i = 0; i < quakeData.lenght; i++) {
        var quakeobj = quakeData[i];
        quakeobj.radius = quakeobj.magnitudo * 1000;
        result.push(quakeobj);
    }




    /*    googleMapsClient.reverseGeocode({
            latlng: [42.7707, 13.1322],
        }, function (err, response) {
            if (!err) {
                result.push(response.json.results);
                console.log(response.json.results);
                //res.json(response.json.results);
            }
        });*/

    //{"ID":56709,"Lon":12.759,"Lat":35.5323,"ag":0,"X84perc":0,"X16perc":0},

    // [{"dataOraUTC":"2016-1022T05:24:56.260000","lat":42.7707,"long":13.1322,"profonditaKm":6,"magnitudo":2.9,"provinciaZona":"Perugia"


    /* googleMapsClient.reverseGeocode({
          latlng: [obj.lat, obj.long],
          result_type: ['country', 'locality'],
          location_type: ['ROOFTOP', 'APPROXIMATE']
      }, function (err, response) {
          if (!err) {
              result.push(response.json.results);
              console.log(response.json.results);
              //res.json(response.json.results);
          }
      });*/

    /*
            googleMapsClient.placesNearby({
                location: [obj.lat, obj.long],


            }, function (err, response) {
                if (!err) {
                    result.push(response.json.results);
                    console.log(response.json.results);
                    //res.json(response.json.results);
                }
            });*/


    // example.js

    //var out = R("GetDataFrom_INGV_erthquake_last_events.1.2.R").callSync();

    //console.log(out);

    res.json(result);

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



// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
