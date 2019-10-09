var exec = require('cordova/exec');

var PLUGIN_NAME = 'NearbyPlugin';

var NearbyPlugin = {
  initialize: function(isMock) {
    exec(null, null, PLUGIN_NAME, 'initialize', [isMock]);
  },
  setServiceId: function(serviceId) {
    exec(null, null, PLUGIN_NAME, 'setServiceId', [serviceId]);
  },
  startAdvertising: function(broadcast) {
    exec(null, null, PLUGIN_NAME, 'startAdvertising', [broadcast]);
  },
  stopAdvertising: function() {
    exec(null, null, PLUGIN_NAME, 'stopAdvertising', []);
  },
  startDiscovery: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'startDiscovery', []);
  },
  stopDiscovery: function() {
    exec(null, null, PLUGIN_NAME, 'stopDiscovery', []);
  },
  send: function(endpoint, data) {
    exec(null, null, PLUGIN_NAME, 'send', [endpoint, data]);
  },
  connect: function(endpoint, cb) {
    exec(cb, null, PLUGIN_NAME, 'connect', [endpoint]);
  },
  disconnect: function(endpoint) {
    exec(null, null, PLUGIN_NAME, 'disconnect', [endpoint]);
  },
  disconnectAll: function() {
    exec(null, null, PLUGIN_NAME, 'disconnectAll', []);
  }/*,
  setCallback: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'setCallback', []);
  },
  checkMessages: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'checkMessages', []);
  }*/
};

module.exports = NearbyPlugin;
