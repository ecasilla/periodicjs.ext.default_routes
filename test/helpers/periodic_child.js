var Child,
    cp = require('child_process');

module.exports = Child = function() {
	this.intervalDelay = 2*1000;
	this.interval = null;
	this.pid = process.pid;
};

Child.prototype.start = function() {
	this.interval = setInterval(this.sendMessageToMaster.bind(this),this.intervalDelay);
	this.sendMessageToMaster();
};

Child.prototype.execute = function(command) {
 child = cp.exec('cat *.js bad_file | wc -l',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
}); 
}

Child.prototype.sendMessageToMaster = function(extra_message) {
	var uptime = process.uptime();
	var message = 'child process interval ['+this.pid+'], uptime '+uptime+'s';
	process.send({
		custom: message,
    meta_data : extra_message
	});
};

var c = new Child();
c.start();

process.on('message',function(msg) {
  console.log(msg);
})

process.on('disconnect',function() {
	process.kill();
});
