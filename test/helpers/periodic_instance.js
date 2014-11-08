'use strict';

var npm        = require('npm'),
	path         = require('path'),
	fs           = require('fs-extra'),
	async        = require('async'),
	child        = require('child_process'),
  currentExtensionName = '',

	previous_dir = function() {
		return path.resolve(process.cwd(), '../periodicjs_Stub');
	},
	create_previous_dirSync = function(path_to) {
		return fs.mkdirsSync(path_to);
	},
	remove_previous_dirSync = function() {
		return fs.removeSync(previous_dir());
	},
	periodic_cwd = path.resolve(previous_dir(), 'node_modules/periodicjs/'),
	periodic_version,
	currentExtensionPeerDependencies = [];

/**
 * gets the periodic version number from periodic.ext.json
 * @param  {Function} asyncCallback async callback
 */
var getExtPeriodicVer = function(asyncCallback){
	var ext_json = path.resolve(process.cwd(),'./periodicjs.ext.json');
 	fs.readJson(ext_json,function(err,ext) {
    var version =  String('periodicjs@' + ext.periodicCompatibility);
    periodic_version = version;

 		asyncCallback(err,version);
  });
};

/**
 * install periodic stub for testing
 * @param  {Function} asyncCallback async callback function
 */
var installCorrectVersion = function(asyncCallback){
	create_previous_dirSync(previous_dir());

	//npm.config skip_post_install =true
	if (fs.existsSync(periodic_cwd)){
	  asyncCallback(null,'Periodic Installed!');
	}
	else{
	  npm.load({
	    prefix: previous_dir(),
	    skip_post_install: true
	  }, 
	  function (err) {
	    if (err) {
	    	asyncCallback(err,null);
	    }
	    else{
	      npm.config.set('skip_post_install', true);
	      npm.commands.install([periodic_version], function (err, data) {
		      if (err) {
		    		asyncCallback(err,null);
		      }
		      else{
		      	asyncCallback(null,data);
		      }
		    });
		    npm.on('log', function (message) {
		      // log the progress of the installation
		      console.log(message);
		    });
	    }
	  });
	}
};

/**
 * copy current extenion name for folder naming during copy
 * @param  {Function} asyncCallback async callback function
 */

var getExtName = function(asyncCallback) {
  var current_ext_package_json = path.resolve(process.cwd(),'package.json');
  fs.readJson(current_ext_package_json,function(err,json) {
    if(err){
      asyncCallback(err,null);
    }
    else{
      currentExtensionName = json.name
      asyncCallback(null,currentExtensionName);
    }
  });
}

/**
 * copy current extenion to periodic stub
 * @param  {Function} asyncCallback async callback function
 */
var copyExt = function(asyncCallback){
	//asyncCallback(null,'copied extension to stub');
  var node_modules = periodic_cwd + '/node_modules/' + currentExtensionName
  fs.copy('.', node_modules,function(err) {
    if (err) {
     asyncCallback(err) 
    }else{
    asyncCallback(null,"copied extension to stub")
    }
  })
};

/**
 * get peer dependencies to install after current extension is copied into periodic stub
 * @param  {Function} asyncCallback async callback function
 */
var readPeerDeps = function(asyncCallback){
  var current_ext_package_json = path.resolve(process.cwd(),'package.json');
  fs.readJson(current_ext_package_json,function(err,json) {
  	if(err){
      console.log(typeof json.peerDependencies + '\n');
      console.log(json.peerDependencies);
  		asyncCallback(err,null);
  	}
    else if (!json.peerDependencies){
      asyncCallback(null,"No Peer Dependencies for this extension!")
    }
  	else{
	  	var tempobj = json.peerDependencies; 
      for(var ext in tempobj){
       currentExtensionPeerDependencies.push(ext);
      }
	  	asyncCallback(null,currentExtensionPeerDependencies);
  	}
  });
};
/**
 * get peer dependencies to install after current extension is copied into periodic stub
 * @param  {Function} asyncCallback async callback function
 */
var installPeerDeps = function(asyncCallback){
  npm.load({
  prefix:periodic_cwd,
  skip_post_install: true
  },
  function(err) {
    if (err) {
      asyncCallback(err) 
    }else{
      npm.config.set("skip_post_install",true)
      npm.commands.install(currentExtensionPeerDependencies, function (err, data) {
        if (err) {
          asyncCallback(err,null);
        }
        else{
          asyncCallback(null,data);
        }
      });
      npm.on('log', function (message) {
        // log the progress of the installation
        console.log(message);
      });
    }
  })
};



/**
 * start periodic stub express app
 * @param  {Function} asyncCallback async callback function
 * @todo change the port 
 * @todo try fork
 */
var start_server = function(asyncCallback) {
 var server =  child.fork(null);
  server.on('message',function(message) {
    console.log('From periodic worker: ' +  message);
  });

  server.send('npm run nd');

  asyncCallback(null,'started periodicjs_Stub');
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

var clean = function(callback) {
 fs.remove(previous_dir(),function(err) {
   if (err) {
    callback(err) 
   }else{
     callback(null,"Cleaned The Stub Directory");
   }
 });
}

async.series({
		getPeriodicVersion            : getExtPeriodicVer,
		installCorrectVersion         : installCorrectVersion,
    getCurrentExtName             : getExtName,
		copyExtentionToPeriodicStub   : copyExt,
		readExtensionPeerDependencies : readPeerDeps,
		installExtPeerDeps            : installPeerDeps,
		startPeriodicStubServer       : start_server
	},
	function(err,status){
		if(err){
			throw err;
		}
		else{
			console.log('status',status);
		}
});

module.exports.previous_dir = previous_dir;
module.exports.create_previous_dir = create_previous_dirSync;
module.exports.remove_previous_dirSync = remove_previous_dirSync;
module.exports.kill_server = kill_server;
module.exports.clean = clean;
