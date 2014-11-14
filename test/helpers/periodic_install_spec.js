var expect     = require('chai').expect,
  path         = require('path'),
  chai         = require('chai'),
  fs           = require('fs-extra'),
  child        = require('child_process'),
  http         = require('chai-http'),
  previous_dir = require('./periodic_instance').previous_dir,
  remove_dir   = require('./periodic_instance').remove_previous_dirSync,
  stubCWD      = path.resolve(previous_dir(), 'periodic_Stub/node_modules/periodicjs/');
  context      = describe;
  chai.use(require('chai-fs'))
  chai.use(require('chai-http'))

  describe('Periodic Install: ', function () {

    before(function (done) {
      var install = 'node ' + path.resolve(process.cwd(), 'test/helpers/periodic_instance.js');
      var cp = child.exec(install, function (error, stdout, stderr) {
        if (error) done(error);
        process.stdout.write(stdout);
      })
      console.log(cp);
      done();
    });

    context('folder management of for the install process', function () {
      it('should have a stub folder in the previous directory', function (done) {
        expect(previous_dir()).to.be.a.directory('periodic_Stub')
        done();
      });
      it('should create a folder in the previous dir to install the instance', function (done) {
        expect(previous_dir()).to.be.a.directory('periodic_Stub/node_modules/periodicjs');
        done();
      });
    })

    context('Npm Install Process', function () {

      it('should install the latest periodic', function (done) {
        var periodic_direc = path.resolve(previous_dir(), 'node_modules/periodicjs/');
        expect(periodic_direc).to.be.a.directory();
        done()
      });
      it('should match the package.json name', function (done) {
        var packageJson = path.resolve(previous_dir(), 'node_modules/periodicjs/package.json');
        expect(packageJson).to.be.a.file()
        done()
      });
    });
  })
});