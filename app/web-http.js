var express = require("express");
var bodyParser = require("body-parser");

var population = require("./routes/population")

var app = express();

app.get('*', function (req, res, next) {
    // notify master about the request
    process.send({ cmd: 'notifyRequest' });
    //console.log('WORKER: request requested')
    next();
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/population', population);

app.get('/test', function (req, res, next) {
  res.send('Blank test page :)');
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("There was an error");
  console.log(err);
  console.log(err.stack);
});

app.listen(process.env.PORT, function() {
  console.log("Node server running on " + process.env.IP + ":" + process.env.PORT);
});

module.exports = app;