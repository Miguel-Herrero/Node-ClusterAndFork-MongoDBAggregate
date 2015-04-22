var cluster = require("cluster"),
    cpuCount = require("os").cpus().length,
    jobWorkers = [],
    webWorkers = [];


if (cluster.isMaster) {
    
    // Create a worker for each CPU
    for (var i = 0; i < 2; i += 1) {
        //addJobWorker();
        addWebWorker();
    }
    
    cluster.on('exit', function(worker, code, signal) {
        
        if (jobWorkers.indexOf(worker.id) != -1) {
            console.log('job worker ' + worker.process.id + ' died. Trying to respawn...');
            removeJobWorker(worker.id);
            addJobWorker();
        }
        
        if (webWorkers.indexOf(worker.id) != -1) {
            console.log('http worker ' + worker.process.id + ' died. Trying to respawn...');
            removeWebWorker(worker.id);
            addWebWorker();
        }
    });
    
} else {
    if (process.env.web) {
        console.log('start http server: ' + cluster.worker.id);
        require('./app/web-http.js'); // initialize the http server
    }
    
    if (process.env.job) {
        console.log('start job server: ' + cluster.worker.id);
        require('./app/job-worker'); // initialize the agenda
    }
}

function addWebWorker() {
    webWorkers.push(cluster.fork({web: 1}).id);
}

function addJobWorker() {
    jobWorkers.push(cluster.fork({job: 1}).id);
}

function removeWebWorker(id) {
    webWorkers.splice(webWorkers.indexOf(id), 1);
}

function removeJobWorker(id) {
    jobWorkers.splice(jobWorkers.indexOf(id), 1);
}