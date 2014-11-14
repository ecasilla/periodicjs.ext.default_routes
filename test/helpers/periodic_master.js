var Master,
	cp     = require('child_process'),
	events = require('events'),
	path   = require('path'),
	util   = require('util'),
  periodic_child = path.resolve(process.cwd(),'test/helpers/periodic_child');
  periodic_cwd = require('./periodic_instance').periodic_cwd

module.exports = Master = function() {
	this.threads = {};
};

util.inherits(Master,events.EventEmitter);

Master.prototype.start = function(numThreads) {
	var i,
	child,
	that = this,
	onMessage = function(message) {
		that.emit('message','child message',this.pid,message);
	},
	onError = function(e) {
		that.emit('error','child error',this.pid,e);
	},
	onDisconnect = function(e) {
		that.emit('disconnect','child disconnect',this.pid,'killing...');
		this.kill();
		delete that.threads[this.pid];
	};
	for ( i = 0; i < numThreads; i++ ) {
		child = cp.fork(periodic_child,[],{cwd:periodic_cwd});
		child.on('message',onMessage);
		child.on('error',onError);
		child.on('disconnect',onDisconnect);
    //in order to send messages refer to num threads you passed in 
		that.threads[i] = child.pid
	}
};

/**
 * @description The method allows you to send messages to the child process
 * @param {object} The message need to be an object
 * that impelments this style object {command:'rm',args:['-rf','path/']},pid) 
 */

Master.prototype.send = function(message,pid) {
if ( typeof pid === 'undefined' ) {
  throw new Error("Pid need in order to send message");
 }
 this.threads[pid].send(message);
}

Master.prototype.stop = function(pid) {
	var that = this;
	if ( typeof pid === 'undefined' ) {
		var allPids = Object.keys(this.threads);
		allPids.forEach(function(key,i,arr) {
			that.threads[key].disconnect();
		});
	} else if ( threads[pid] ) {
		that.threads[pid].disconnect();
	}
};

Master.prototype.destroy = function() {
	process.kill();
}
