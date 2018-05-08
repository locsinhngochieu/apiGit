require('./cores/global');
const cluster = require('cluster');
const async = require('async');
const numCPUs = require('os').cpus().length;
var express = require('express');
var cors = require('cors');
var util = require('util');
var app = express();
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
app.use(timeout(180000));
app.use(haltOnTimedout);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(global.config.cors));
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}
//middleware app json
function cacheHandler() {
    return function (request, response, next) {
        response.set('Content-Type', 'application/json');
        next();
    }
}

app.post('/app/:act', cacheHandler(), function (request, response) {
    let qkey;
	for (qkey in request.body) {
		console.log(qkey);
		if (qkey!==qkey.toLowerCase()) { request.body[qkey.toLowerCase()] = request.body[qkey]; }
    }
    var act = request.params.act.replace(/[^a-z0-9\_\-]/i,'').toLowerCase();
    try{
        var mod = request.body.mod.replace(/[^a-z0-9\_\-]/i,'').toLowerCase();
        let arr = [];
        var userinfo=[];
        arr.push(new Promise(resolve => {
            resolve();
        }));
        Promise.all(arr).then(() => {
            var controller;
            try {
					controller = require('./app/'+act+'/controller');
					
                } catch (e1) { console.log(e1); }
                if ((controller)&&(controller[mod])) {
					controller[mod](request.body,userinfo,function(data) {
						if (data) {
									//	data.pid = process.pid;
        			    	response.send(data);
            			}
		            	else {
    		           		response.status(401).send({error:102,msg:"What're you looking for ?!?"});
	        		    }
					});
				} else {
					response.status(401).send({error:101,msg:"What're you looking for ?!?"});
				}	
        })
        
    }catch(ex){
        response.status(401).send({status:false,msg:"Error ! Check again ..."});
    }
})
app.post('/api/:act', cacheHandler(), function (request, response) {
    let qkey;
	for (qkey in request.body) {
		console.log(qkey);
		if (qkey!==qkey.toLowerCase()) { request.body[qkey.toLowerCase()] = request.body[qkey]; }
    }
    var act = request.params.act.replace(/[^a-z0-9\_\-]/i,'').toLowerCase();
    try{
        var mod = request.body.mod.replace(/[^a-z0-9\_\-]/i,'').toLowerCase();
        let arr = [];
        var userinfo=[];
        arr.push(new Promise(resolve => {
            resolve();
        }));
        Promise.all(arr).then(() => {
            var controller;
            try {
					controller = require('./api/'+act+'/controller');
					
                } catch (e1) { console.log(e1); }
                if ((controller)&&(controller[mod])) {
					controller[mod](request.body,userinfo,function(data) {
						if (data) {									//	data.pid = process.pid;
        			    	response.send(data);
            			}
		            	else {
    		           		response.status(401).send({error:102,msg:"What're you looking for ?!?"});
	        		    }
					});
				} else {
					response.status(401).send({error:101,msg:"What're you looking for ?!?"});
				}	
        })
    }catch(ex){
        response.status(401).send({status:false,msg:"Error ! Check again ..."});
    }
})

var servers = [];
if (cluster.isMaster) {
    console.log('Master ${process.pid} is running');
      function messageHandler(msg) {
      if (msg.cmd && msg.cmd === 'notifyRequest') {
        numReqs += 1;
      }
    }
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
      cluster.on('message', (worker, message, handle) => {
      if (arguments.length === 2) {
              handle = message;
              message = worker;
              worker = undefined;
          }
  
    });
    cluster.on('exit', (worker, code, signal) => {
      console.log('worker '+worker.pid+' died');
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
      servers.push(app.listen(9999, function () {
          console.log("API Init Completed.");
      }));
      
      console.log('Worker '+process.pid+' started');
  }
  