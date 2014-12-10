// Setup chai
 var chai = require('chai');
 global.expect = chai.expect;
 chai.use(require('sinon-chai'));
 chai.use(require('chai-fs'))
 chai.use(require('chai-http'))

 // Setup sinon
 global.sinon = require('sinon');
 global.http  = require('chai-http');
