var expect  = require('chai').expect,
    path    = require('path'),
    chai    = require('chai'),
    fs      = require('fs-extra'),
    child   = require('child_process'),
    http    = require('chai-http'),
    Child   = require('./periodic_child'),
    Master = require('./periodic_master'),
    previous_dir = require("./periodic_instance").previous_dir,
    stubCWD = path.resolve(previous_dir(), 'periodic_Stub/node_modules/periodicjs/');
    context = describe;
    chai.use(require('chai-fs'))
    chai.use(require('chai-http'))

describe('Child Process: ', function(){
 context('Method Signitures',function() {
   xit('should be able to send message to master', function(done){
     done();
   });
   xit('should be able to execute messages sent from master', function(done){
   done(); 
   });
   xit('should send a heart beat every two seconds', function(done){
   done(); 
   });
   xit('should close if theres no master', function(done){
    done(); 
   });
   xit('should stream the log message back to the master process', function(done){
    done(); 
   });
 }) 
});

