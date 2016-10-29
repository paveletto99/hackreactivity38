// BASE SETUP
// =============================================================================

// call the packages we need
var async = require("async");
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
    key: 'AIzaSyDn-0OWOVsKyJ-dLqqWA9zBLikTLBV2m9M'
});
/*
var googleMapsClient = require('@google/maps').createClient({
    clientId: '517233656841-2vpqc8nvsnv6lcv6kdpjgt6q8lv7is7d.apps.googleusercontent.com',
    clientSecret: 'hxXTgL1lyTssGWPpq1pp3PkQ',
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



    function foo(quakeobj, fn) {
        googleMapsClient.reverseGeocode({
            latlng: [quakeobj.lat, quakeobj.long],
            //result_type: ['country', 'locality'],
            //location_type: ['ROOFTOP', 'APPROXIMATE']
        }, function (err, response) {
            if (!err) {
                quakeobj.city = response.json.results[0].address_components[1].long_name;
                console.log(response.json.results[0].address_components[1].long_name);
                //  console.log(response.json.results[0].address_components);
                fn(quakeobj);
                //console.log(result);

            }
        });
    }

    var quakeData = JSON.parse(fs.readFileSync('JSON_RealTime_earthquake.json', 'utf8'));
    var riskData = JSON.parse(fs.readFileSync('JSON_EarthquakeRiskMap.json', 'utf8'));

    var result = new Array();
    var test = 1;
    for (var i = 0; i < 20; i++) {
        var quakeobj = quakeData.results[i];
        quakeobj.radius = quakeobj.magnitudo * 10000
            //risk
        for (var k = 0; k < riskData.requests.length; k++) {
            var riskobj = riskData.requests[k];
            if (typeof riskobj != 'undefined') {
                var num = Number(Math.round(quakeobj.lat + 'e2') + 'e-2');
                var num2 = Number(Math.round(riskobj.Lat + 'e2') + 'e-2');
                if (num == num2) {
                    quakeobj.risk = riskobj.X84perc;
                }

            }
        }

        foo(quakeobj, function (obj) {
            console.log(test);
            console.log(obj); // this is where you get the return value
            result.push(obj)
            if(test==19){
                res.json(result);
            }else{
                test++;
            }
        });
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



    /*  googleMapsClient.geocode({
          address: 'Sydney Opera House'


      }, function (err, response) {
          if (!err) {
              //result.push(response.json.results);
              console.log(response);
              //res.json(response.json.results);
          }
      });*/


    // example.js

    //var out = R("GetDataFrom_INGV_erthquake_last_events.1.2.R").callSync();

    //console.log(out);


});

// on routes that end in /bears
// ----------------------------------------------------
router.get('/maps', function (req, res) {
  /*  var twitterData = JSON.parse(fs.readFileSync('JSON_Twitter_hastagSearch_RAW.json', 'utf8'));
    for (var i = 0; i < twitterData.results.lenght i++) {
        var twitobj = twitterData.results[i];
        
    }*/
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
