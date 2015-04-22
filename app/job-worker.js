var agenda = require("./agenda");

agenda.on('complete', function(job) {
  console.log("Job '%s' finished", job.attrs.name);
});

module.exports = agenda;