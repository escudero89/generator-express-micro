'use strict';

var events = require('events')
  , Rx = require('rx')
  ;

var eventEmitter = new events.EventEmitter()
  , proto
  ;

module.exports = function <%= name[0].toUpperCase() + name.slice(1) %>Repository() {};

proto = module.exports.prototype;

proto.on = eventEmitter.on.bind(eventEmitter);
proto.fromEvent = Rx.Node.fromEvent.bind(null, eventEmitter);

proto.save = function save() {
  eventEmitter.emit('save', arguments);
};
