var cluster = require("cluster"),
    webWorkers = [];


// Requests/second parameters
var threshold = 60; //requests/s for new forks
var thresholdCapability = threshold * webWorkers.length;
var numReqs = 0;

if (cluster.isMaster) {
    
    // Min 1 worker online
    addWebWorker();
    
    console.log("Threshold = " + threshold);
    
    var sec = 0;
    setInterval(function() {
        console.log(sec + "s: numReqs = " + numReqs + ", thresholdCapability = " + thresholdCapability + ", workers: " + Object.size(cluster.workers));
        sec++;
        /*
        for (var key in webWorkers) {
            if (key === 'length' || !webWorkers.hasOwnProperty(key)) continue;
            console.log(webWorkers[key]);
        }*/
        // Check all the time if workers can be killed
        if (threshold > numReqs && numReqs < thresholdCapability) {
            killForks();
        }
        // Reset requests counter every second
        numReqs = 0;
    }, 1000);
    
    function messageHandler(msg) {
        if (msg.cmd && msg.cmd == 'notifyRequest') {
            numReqs += 1;
            
            // Check if more workers need to be forked
            if (numReqs > thresholdCapability) {
                createForks();
            }
        }
    }
    
    function createForks() {
        var numCPUs = require('os').cpus().length;
        if (webWorkers.length < numCPUs) {
            var forksToCreate = (Math.floor(numReqs / threshold) + 1) - webWorkers.length;
            
            var total = (forksToCreate > numCPUs) ? numCPUs : forksToCreate; // Don't create more forks than CPU cores
            console.log("Creating new fork. Workers.ids = " + webWorkers)
            
            for (var i = 0; i < total; i++) {
                addWebWorker();
            }
        }
    }
        
    function killForks() {
        var forksToKill = Math.floor((thresholdCapability - numReqs) / threshold) - 1; // Leave at least one online
        forksToKill = (forksToKill < 0) ? 0 : forksToKill;
        
        if (forksToKill > 0 && Object.size(cluster.workers) > 1) {

            while(forksToKill > 0) {
                removeWebWorker(webWorkers[forksToKill]);
                forksToKill--;
            }
        }
    }
    
    cluster.on('exit', function(worker, code, signal) {
        if (webWorkers.indexOf(worker.id) != -1) {
            console.log('MASTER: HTTP worker ' + worker.process.id + ' died.');
        }
    });
    
} else {
    if (process.env.web) {
        console.log('Starting HTTP server on fork #' + cluster.worker.id);
        require('./app/web-http.js'); // initialize the http server
    }
}

function addWebWorker() {
    //cluster.fork({web: 1});
    webWorkers.push(cluster.fork({web: 1}).id);
    
    //Update thresholdCapability
    thresholdCapability = threshold * webWorkers.length;
    
    cluster.on('online', function(worker) {
        cluster.setMaxListeners(0); // https://github.com/joyent/node/issues/5108
        cluster.workers[worker.id].on('message', messageHandler);
    });
}

function removeWebWorker(id) {

    console.log("Killing unnecessary fork #" + id);

    webWorkers.splice(webWorkers.indexOf(id), 1);

    thresholdCapability = threshold * webWorkers.length;

    cluster.workers[id].kill();
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getThresholdCapability() {
    return threshold * webWorkers.length;
}