var express = require("express");
var bodyParser = require("body-parser");
var agenda = require("./job-worker");

var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/todos', function (req, res, next) {
  res.send('TODOS page');
});

app.get('/population', function(req, res, next) {

    agenda.now('insert population', {population: req.body});
    agenda.on('complete:insert population', function() {
        res.send('La tarea de INSERT POPULATION ha acabado');
    });
});

app.listen(process.env.PORT, function() {
    console.log("Node server running on " + process.env.IP + ":" + process.env.PORT);
});