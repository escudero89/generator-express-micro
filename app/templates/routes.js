'use strict';

var commons = require('./commons.js')
  , express = require('express')
  ;

var controller = commons.controller
  , defaultController = controller('default')
  , router = new express.Router()
  ;

router.get('/', defaultController);

module.exports = router;
