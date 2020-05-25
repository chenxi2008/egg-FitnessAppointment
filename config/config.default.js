/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1589854622001_6117';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: 'egg',
  };
  //小程序配置
  const miniProgram = {
    appId: 'wx8e0d851bfe5a234c',
    appSecret: 'd593b0dda02e92df7213b86cf14088da'
  }

  return {
    ...config,
    ...userConfig,
    ...miniProgram
  };
};
