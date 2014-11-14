'use strict';

var npm                  = require('npm'),
    path                 = require('path'),
    fs                   = require('fs-extra'),
    async                = require('async'),
    Master               = require('./periodic_master'),
    child                = require('child_process');

/**
 * start periodic stub express app
 * @param  {Function} asyncCallback async callback function
 * @todo change the port 
 * @todo try fork
 */
var start_server = function(asyncCallback) {
  //refactor so the instance is created in the module
  var server = new Master();
  //start one child process
  server.start(1)

  server.send({command:'npm',args:['run', 'nd']}, 1)

  server.on('message',function(type,pid,msg) {
    console.log("child message: " + msg.meta_data + " info: " + msg.info);
  });

  server.on('error',function(type,pid,error) {
    asyncCallback(error)
  });
  server.on('disconnect',function(type,pid,msg) {
    asyncCallback(null,"Server " + "pid: " + pid + " Disconnected") 
  });
};


//Use by passing the server pid like kill(server.pid)
function kill_server(pid, signal, callback) {
	signal = signal || 'SIGKILL';
	callback = callback || function () {};
	var killTree = true;
	if (killTree) {
		psTree(pid, function (err, children) {
			[pid].concat(
				children.map(function (p) {
					return p.PID;
				})
			).forEach(function (tpid) {
				try {
					process.kill(tpid, signal);
				}
				catch (ex) {}
			});
			callback();
		});
	}
	else {
		try {
			process.kill(pid, signal);
		}
		catch (ex) {}
		callback();
	}
};

module.exports.kill_server = kill_server;
//module.exports.clean = clean;
