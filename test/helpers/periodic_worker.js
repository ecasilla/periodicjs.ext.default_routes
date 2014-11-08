var child = require("child_process"),
    path  = require('path'),
    terminal = require('child_process').spawn('bash'),
    ___backgroundExec;

process.on('message',function(msg){

  this._init = function(){
    if(msg.command){
      this._startServer();
    }
    else{
      console.log("error: Unable to start server.");
      process.disconnect();
    }
    //bind to process and call when new message is passed in
  }.bind(this)()

  this._logger = function(data){
    //Send the results back to the master process
    if(data){
      try{
        terminal.stdin.write(msg.command + '\n')
        process.send(data);
      }
      catch(err){
        console.log("periodic_worker.js: problem with process.send() " + err.message + ", " + err.stack);
        process.disconnect();
      }
    }
    else{
      console.log("periodic_worker.js: no data processed");
      
    }
  }

  this._startServer = function(){
    var count = 0;

    ___backgroundExec = child.exec(function(){

      try{
        this._logger(msg.command);
      }
      catch(err){
        count++;
        if(count == 3){
          console.log("periodic_worker.js: shutdown timer...too many errors: " + err.message);
          process.disconnect();
        }
        else{
          console.log("periodic_worker.js error: " + err.message + "\n" + err.stack);
        }
      }
    });
  }

})

process.on('uncaughtException',function(err){
  console.log("periodic_worker error: " + err.message + "\n" + err.stack + "\n Stopping background server");
});
