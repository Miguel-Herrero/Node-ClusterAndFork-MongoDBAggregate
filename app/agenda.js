var Agenda = require('agenda');

var agenda = new Agenda({db: { address: 'mongodb://caseuser:casepassword@ds035617.mongolab.com:35617/casedb'}});

agenda.define('insert population', function(job, done) {
    console.log(job.attrs.data)
    console.log('TAREA EJECUTADA');
    // Aquí hacer el INSERT
    done();
});

agenda.start();

module.exports = agenda;