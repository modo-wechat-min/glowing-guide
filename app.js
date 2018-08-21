let ports = require('./utils/ports.js');
let util = require('./utils/util.js');
App({
  globalData: {
    appid: 'wx5f0f5f54e432a52a',
    secret: '05fb3c0bbb0e631ec8ef61574a414488',
  },
  onLaunch(){
    util.getOpenId();
  }
})