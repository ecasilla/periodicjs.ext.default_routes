var npm = require('npm'),
	path = require('path'),
	fs = require('fs-extra'),
	child = require('child_process'),
	periodic_cwd = path.resolve(previous_dir(), '/periodicjs/'),
	periodic_version = getExtPeriodicVer();
  console.log(periodic_version)

/// change periodic to read periodic.ext.json
create_previous_dirSync(previous_dir())


//npm.config skip_post_install =true
if (fs.existsSync(periodic_cwd) || fs.existsSync( previous_dir() ) ){
  console.log("Periodic Installed!");
}else{
  npm.load({
    prefix: previous_dir(),
    skip_post_install: true
  }, function (err) {
    if (err) {
      throw err
    }
    npm.config.set("skip_post_install", true);
    npm.commands.install([periodic_version], function (err, data) {
      if (err) {
        throw err
      }
      copyExt();
      readPeerDeps();
      //read package.json for peer deps and installed those deps 
      //copy the current ext into the node_modules folder of the instance
    });
    npm.on("log", function (message) {
      // log the progress of the installation
      console.log(message);
    });
  });
}

function getExtPeriodicVer(){
  var ext_json = path.resolve(process.cwd(),'./periodicjs.ext.json')
  return fs.readJsonSync(ext_json,function(err,ext) {
   var version =  String('periodic@' + ext.periodicCompatibility);
   console.log(verison);
   return version;
  })
}

function readPeerDeps() {
  var ext_json = path.resolve(process.cwd(),'package.json')
  return fs.readJson(packageJson,function(err,json) {
   return json.peerDependencies 
  })
  console.log("reading peer deps");
}

function copyExt() {
  console.log("copying Ext");
}


// change the port 
// try fork
function start_server() {
  child.fork('./periodic_worker')
  child.on('message',function(message) {
    console.log("From periodic worker: " +  message);
  });

  child.send("npm run nd")
}

//function start_server() {
	//var server = child.exec('npm start', {
		//cwd: periodic_cwd
	//}, function (error, stdout, stderr) {
		//if (error) {
			//console.log(error.stack);
		//}
		//console.log(stdout);
	//});
	//return server;
//}

function previous_dir() {
	return path.resolve(process.cwd(), '../periodicjs_Stub');
}

function create_previous_dirSync(path_to) {
	return fs.mkdirsSync(path_to);
}

function remove_previous_dirSync() {
		return fs.removeSync(previous_dir());
}
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
					process.kill(tpid, signal)
				}
				catch (ex) {}
			});
			callback();
		});
	}
	else {
		try {
			process.kill(pid, signal)
		}
		catch (ex) {}
		callback();
	}
};

module.exports.previous_dir = previous_dir;
module.exports.create_previous_dir = create_previous_dirSync;
module.exports.remove_previous_dirSync = remove_previous_dirSync;
module.exports.kill_server = kill_server;
