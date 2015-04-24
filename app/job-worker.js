var agenda = require("./agenda");

agenda.on('fail', function(err, job) {
    console.log("JOB: Job failed with error: %s", err.message);
});
agenda.on('complete', function(job) {
  console.log("JOB: Job '%s' finished", job.attrs.name);
});

module.exports = agenda;