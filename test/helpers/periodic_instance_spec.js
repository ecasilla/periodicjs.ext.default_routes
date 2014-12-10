var path         = require('path'),
    previous_dir = require("./periodic_instance").previous_dir,
    fs           = require('fs-extra'),
    child        = require('child_process'),
    stubCWD      = path.resolve(previous_dir(), 'periodic_Stub/node_modules/periodicjs/');
    context      = describe;
  

describe('Periodic Stub: ', function () {

});
