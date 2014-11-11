var Master,
	cp     = require('child_process'),
	events = require('events'),
	path   = require('path'),
	util   = require('util'),
periodic_child = path.resolve(process.cwd(),'test/helpers/periodic_child');

module.exports = Master = function() {
	this.threads = {};
};

util.inherits(Master,events.EventEmitter);

Master.prototype.start = function(numThreads) {
	var i,
	child,
	that = this,
	onMessage = function(message) {
		that.emit('child message',this.pid,message);
	},
	onError = function(e) {
		that.emit('child error',this.pid,e);
	},
	onDisconnect = function(e) {
		that.emit('child disconnect',this.pid,'killing...');
		this.kill();
		delete that.threads[this.pid];
	};
	for ( i = 0; i < numThreads; i++ ) {
		child = cp.fork(periodic_child);
		child.on('message',onMessage);
		child.on('error',onError);
		child.on('disconnect',onDisconnect);
		that.threads[child.pid] = child;
	}
};

Master.prototype.send = function(message) {
 process.send(message);
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
