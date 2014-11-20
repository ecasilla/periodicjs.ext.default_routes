var expect  = require('chai').expect,
    path    = require('path'),
    chai    = require('chai'),
    fs      = require('fs-extra'),
    child   = require('child_process'),
    http    = require('chai-http'),
    Master  = require('./periodic_master'),
    stubCWD = path.resolve(previous_dir(), 'periodic_Stub/node_modules/periodicjs/');
    context   = describe;
    chai.use(require('chai-fs'))
    chai.use(require('chai-http'))
