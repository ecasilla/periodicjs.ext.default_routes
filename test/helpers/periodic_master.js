var Master,
	cp     = require('child_process'),
	events = require('events'),
	path   = require('path'),
	util   = require('util'),
  periodic_child = path.resolve(process.cwd(),'test/helpers/periodic_child');
  periodic_cwd = require('./periodic_instance').periodic_cwd

module.exports = Master = function() {
	this.threads = {};
  this.child;
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
    this.child = child
		that.threads[child.pid] = child;
	}
};

Master.prototype.send = function(message) {
 this.child.send(message);
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
