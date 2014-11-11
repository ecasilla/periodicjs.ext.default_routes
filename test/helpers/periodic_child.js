var Child,
    cp = require('child_process');

module.exports = Child = function() {
	this.intervalDelay = 2*1000;
	this.interval = null;
	this.pid = process.pid;
};

Child.prototype.start = function() {
	this.interval = setInterval(this.sendMessageToMaster.bind(this),this.intervalDelay);
	this.sendMessageToMaster(process.cwd());
};


Child.prototype.sendMessageToMaster = function(extra_message) {
	var uptime = process.uptime();
	var message = 'child process interval ['+this.pid+'], uptime: '+uptime+'s';
  var info = extra_message;
	process.send({
		meta_data: message,
    info : info
	});
};

Child.prototype.execute = function(command) {
  child = cp.exec(command,
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    }); 
}

var c = new Child();
c.start();

process.on('message',function(msg) {
  console.log('master: ' + msg);
  if (msg.command) {
   Child.prototype.execute.call(this,msg.command);
  }
});

process.on('disconnect',function() {
	process.kill();
});
