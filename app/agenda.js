var Agenda = require('agenda');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require("mongodb").ObjectID;

// Agenda jobs' connection to DB
var agenda = new Agenda({db: { address: 'mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb'}});

/*
  Function for inserting population
*/
var insertPopulation = function(db, data, callback) {
  var collection = db.collection('population');
  var objectId = new ObjectID(); //Contiene el timestamp ya
  collection.insert([
    {
      "_id" : objectId,
      "timestamp": objectId.getTimestamp(),
      "city": data.city,
      "population": data.population
    }
  ], function(error, result) {
    if (error) {
      callback(error, null);
    }
    callback(null, result);
  });
}

agenda.define('insert population', function(job, done) {
    MongoClient.connect("mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb", function(err, db) {
        if(!err) {
            console.log("Base de datos conectada");
            
            // Aquí hacer el INSERT
            insertPopulation(db, job.attrs.data, function(error, result) {
              if (error) {
                job.fail(new Error('Error inserting population'));
                job.save();
                done();
              } else {
                db.close();
                done();
              }
            });
        } else {
            job.fail(new Error('Connection URL incorrect'));
            job.save();
            done();
        }
    });
    
});

agenda.start();

module.exports = agenda;