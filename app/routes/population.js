var express = require('express');
var router = express.Router();
var agenda = require("../job-worker");
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb";

router.get('/all', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            
            var findMyDocs = function(db, callback) {
                db.collection('population').find({}).toArray(function(err, docs) {
                    callback(docs);
                });
            }
            
            findMyDocs(db, function(docs) {
                res.send(docs);
            });
        }
    });
});

/*
    GET cities listing.
    
    Returns a list of cities, with statistics for each one:
    - sum: total of citizens.
    - avg: average age of all citizens.
    - max: maximum age of all citizens.
    - min: minimum age of all citizens.
*/
router.get('/cities', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            db.collection('population').aggregate([
                { $unwind: '$population' },
                { $group: { _id: "$city", sum: { $sum: '$population.count' }, avg: { $avg: '$population.age' }, max: { $max: '$population.age' }, min: { $min: '$population.age' } } },
                { $sort: { _id : 1 } }
            ], function(err, results) {
                if (err) {
                    db.close();
                    return next(err);
                }

                db.close();
                res.send(results);
            });
        }
    });
});

router.get('/cities2', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            
            var findData = function(db, callback) {
                
                db.collection('population').aggregate([
                    { $group: {
                        _id: { city: "$city", timestamp: "$timestamp" }
                    } },

                ], function(err, results) {
                    if (err) {
                        db.close();
                        return next(err);
                    }
    
                    db.close();
                    callback(results);
                });
                
                
                
            }
            
            findData(db, function(data) {
                res.send(data);
            });
            
            
            
        }
    });
});

/*
    GET ages listing.

    Returns general statistics of the listing,
    and an array with the totals per age:
    
    {
        "_id": null,
        "max": 120,         // Max age registered
        "min": 20,          // Min age registered
        "avg": 61,          // Average of all ages registered
        "sum": 13341,       // Total count of populations registered
        "statsPerAge": [
            {
                "_id": 120, // Age registered
                "sum": 15   // Total count of this age registered
            }
        ]
    }
*/
router.get('/ages', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            // General statistics of ages
            db.collection('population').aggregate([
                { $unwind: '$population' },
                { $group: { _id: 0, sum: {$sum: '$population.count'}, avg: { $avg: '$population.age' }, max: { $max: '$population.age' }, min: { $min: '$population.age' } } },
                { $sort: { _id : -1 } },
                { $limit: 1}
            ]).each(function(err, results) { //Only one result, so each is run just once
                if (err) {
                    db.close();
                    return next(err);
                }
                
                if (results) {
                    var finalJSON = results;
                    finalJSON.statsPerAge = "";
                    
                    // Listing of each age and its total population
                    db.collection('population').aggregate([
                        { $unwind: '$population' },
                        { $group: { _id: "$population.age", sum: { $sum: '$population.count' } } },
                        { $sort: { _id : -1 } }
                    ], function(err, results) {
                        if (err) {
                            db.close();
                            return next(err);
                        }
                        
                        if (results) {
                            finalJSON.statsPerAge = results;
                            db.close();
                            res.send(finalJSON)
                        }
                    });
                    
                }
            });
        }
    });
});

router.get('/ages2', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            // General statistics of ages
            db.collection('population').aggregate([
                /*{ $unwind: '$population' },
                { $group: { 
                    _id: 0, 
                    sum: { $sum: '$population.count' }, 
                    avg: { $avg: '$population.age' }, 
                    max: { $max: '$population.age' }, 
                    min: { $min: '$population.age' }
                } },
                { $project: {
                    _id: 0,
                    ageStats: "$$ROOT",
                } },
                { $sort: { _id : 1 } }*/
                //{ $unwind: '$population' },
                { $project: {
                    _id: 0,
                    population: "$population"
                } },
                { $group: {
                   _id: 0,
                   max: { $max: "$population.age" },
                   populatiooooon: { $population: 1 }
                } }
                
                /*
                    ageSum: {$sum: '$population.count'}, 
                    ageAvg: { $avg: '$population.age' }, 
                    ageMax: { $max: '$population.age' }, 
                    ageMin: { $min: '$population.age' } } },
                { $group: { 
                    _id: '$population', 
                    ageSum: {$sum: '$population.count'}, 
                    ageAvg: { $avg: '$population.age' }, 
                    ageMax: { $max: '$population.age' }, 
                    ageMin: { $min: '$population.age' } } },
                { $project: { 
                    "_id": 0, 
                    "ageSum": "$ageSum",
                    "ageAvg": "$ageAvg",
                    "ageMax": "$ageMax",
                    "ageMin": "$ageMin",
                    "population": "$$ROOT" } },
                /*{ $group: { 
                    _id: 0, 
                    "ageAvg": "$ageAvg",
                    "ageMax": "$ageMax",
                    "ageMin": "$ageMin",
                    populationSum: { $sum: '$population.count'}, 
                    populationAvg: { $avg: '$population.age' }, 
                    populationMax: { $max: '$population.age' }, 
                    populationMin: { $min: '$population.age' } } }*/
            ], function(err, results) {
                res.send(results)
            });
        }
    });
});

/*
    GET City->Age statistics, with general statistics for each city:
    
    [
        {
            "_id": "Valencia",
            "max": 50,
            "min": 20,
            "avg": 32.5,
            "countSum": 4443,
            "ages": [
                {
                    "_id": 50,
                    "sum": 2000
                }
            ]
        }
    ]
*/
router.get('/both', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            var cursor = db.collection('population').aggregate([
                { $unwind: '$population' },
                { $group: { _id: '$city', sum: {$sum: '$population.count'}, avg: { $avg: '$population.age' }, max: { $max: '$population.age' }, min: { $min: '$population.age' } } },
                { $sort: { _id : -1 } }
            ]);
            
            var resultados = []
            
            cursor.each(function(err, city) {
                if (err) {
                    return next(err)
                }
            
                if (city) {
                    var ciudad = city
                    //Sacamos las estadísticas para esta ciudad
                    var cityAges = []
                    var cityStatsCursor = db.collection('population').aggregate([
                        { $match: { city: city._id } },
                        { $unwind: '$population' },
                        { $group: { _id: "$population.age", sum: { $sum: '$population.count' } } },
                        { $sort: { _id : -1 } }
                    ]);
                    
                    cityStatsCursor.each(function(err, age) {
                        if (err) return next(err)
                        
                        if (age) {
                            cityAges.push(age)
                        }
                        
                        if (age === null) {
                            ciudad.ages = cityAges
                            resultados.push(ciudad)
                        }
                    });
                }
                
                // El último procesado es NULL
                if (city === null) {
                    // Como no consigo que lo haga asíncronamente, le hago esperar
                    setTimeout(function() {
                        res.send(resultados)
                    }, 500)
                }
            });
        }
    });
});

/*
    GET City->Age statistics, only latest timestamps for each city.
    
    [
        {
            "city": "Valencia",
            "population": [
            {
                "age": 20,
                "count": 1000
            }
        }
    ]
*/
router.get('/both_last', function(req, res, next) {
    MongoClient.connect(dbUrl, function(error, db) {
        if(error) {
            return next(error);
        } else {
            // Get only latest timestamps registries
            db.collection('population').aggregate([      
            { $sort: { "timestamp": -1 } },
            { $group: {
                "_id": "$city",
                "doc": { "$first": "$$ROOT" } } }, //Necessary for passing the population to next pipeline point
            {$project: { 
                "_id": 0, 
                "city": "$_id",
                "population": "$doc.population" } },
            { $sort: { city: 1 } }
            ], function(err, results) {
                if (err) {
                    db.close();
                    return next(err);
                }
                db.close();
                res.send(results);
            });
        }
    });
});


/*
    POST population data and insert into database.
    
    {
        "city": "Londres",
        "population": [
            {"age":120, "count": 15}
        ]
    }
*/
router.post('/', function(req, res, next) {
    agenda.now('insert population', req.body);
    agenda.on('complete:insert population', function() {
        res.send('La tarea de INSERT POPULATION ha acabado');
    });
});

module.exports = router;
