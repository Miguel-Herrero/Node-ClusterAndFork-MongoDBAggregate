var Agenda = require('agenda');
var MongoClient = require('mongodb').MongoClient;

var agenda = new Agenda({db: { address: 'mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb'}});

var insertDocuments = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection('prueba');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

agenda.define('insert population', function(job, done) {
    MongoClient.connect("mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb", function(err, db) {
        if(!err) {
            console.log("Base de datos conectada");
            //console.log(job.attrs.data)
            console.log('TAREA EJECUTADA');
            
            // Aquí hacer el INSERT
            var data = job.attrs.data
            insertDocuments(db, data, function() {
                db.close();
                done();
            });
        } else {
            console.log(err)
            job.fail('error');
            job.save();
            done();
        }
    });
    
});

agenda.start();

module.exports = agenda;