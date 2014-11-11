var Child,
    cp = require('child_process');
    _ = require('underscore');

module.exports = Child = function() {
	this.intervalDelay = 2*1000;
	this.interval = null;
	this.pid = process.pid;
};

Child.prototype.start = function() {
	this.interval = setInterval(this.sendMessageToMaster.bind(this),this.intervalDelay);
	this.sendMessageToMaster();
};
/**
 * description Send a message back to the master process on an interval
 * @params {object} What ever you want to send back to master process
 */
Child.prototype.sendMessageToMaster = function(message_for_master) {
	var uptime = process.uptime();
	var message = 'child process interval ['+this.pid+'], uptime: '+uptime+'s';
  var info = message_for_master;
	process.send({
		meta_data: message,
    info : info
	});
};

/**
 * description This method allow us to execute shell commands
 * @param {string} It takes a string command seperated by 
 * a space and then spawn a new process to execute it
 */
Child.prototype.execute = function(options) {
  var command           = options.command;
  var args              = options.args;
  var child             = cp.spawn(command,args);
  var self = this
  child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    //self.sendMessageToMaster('stdout: ' + data)
  });

  child.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
    //self.sendMessageToMaster('stderr: ' + data)
  });

  child.on('exit', function(code) {
    console.log('exit code: ' + code);
    //self.sendMessageToMaster('exit code: ' + code)
  });
  //child = cp.exec(command,
    //function (error, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      //if (error !== null) {
        //console.log('exec error: ' + error);
      //}
    //}); 
}

var c = new Child();
c.start();

process.on('message',function(msg) {
  console.dir('from master: ' + msg.command);
  if (msg.command) {
   Child.prototype.execute.call(this,msg);
  }
});

process.on('disconnect',function() {
	process.kill();
});
