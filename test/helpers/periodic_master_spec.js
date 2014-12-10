var path    = require('path'),
    fs      = require('fs-extra'),
    proc   = require('child_process'),
    Master  = require('./periodic_master'),
    previous_dir = require("./periodic_instance").previous_dir,
    through = require('through'),
    stubCWD = path.resolve(previous_dir(), 'periodic_Stub/node_modules/periodicjs/');
    context   = describe,
    sinon = require('sinon');

    describe('Master process: ', function(){
      beforeEach(function (done) {
        sinon.stub(proc, 'fork');
        this.childOn = sinon.stub();
        proc.fork.returns({
          stdout: sinon.stub(through()),
          stderr: sinon.stub(through()),
          on: this.childOn
        });
        done();
      });
      afterEach(function(done){
      proc.fork.restore();
      done();
      });

      context('Method Signitures',function() {
        xit('should be able to fork a process', function(done){
          var server = new Master();
          server.start(1);
          server.send({command:"npm",args:["run" , "nd"]})
          expect(proc.fork).to.be.calledWith({command:"npm",args:["run","nd"]});
          done();
        });
        xit('test', function(done){
        console.log(proc.fork())
        done();
        });
      })

    });

