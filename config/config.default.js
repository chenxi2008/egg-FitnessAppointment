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
  // 单数据库信息配置
  config.mysql = {
    client: {
      // host
      host: 'cdb-jiex74ug.bj.tencentcdb.com',
      // 端口号
      port: '10084 ',
      // 用户名
      user: 'root',
      // 密码
      password: 'Cx630889',
      // 数据库名
      database: 'sunshine',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET, POST, HEAD, PUT, DELETE, PATH'
  }

  // add your user config here
  const userConfig = {
    myAppName: 'egg',
  };
  //小程序配置
  const miniProgram = {
    appId: 'wx8e0d851bfe5a234c',
    appSecret: 'd593b0dda02e92df7213b86cf14088da'
  }
  const j_util = {
    seatNum: 40
  }
  return {
    ...config,
    ...j_util,
    ...userConfig,
    ...miniProgram
  };
};

exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'cdb-jiex74ug.bj.tencentcdb.com',
    // 端口号
    port: '10084 ',
    // 用户名
    user: 'root',
    // 密码
    password: 'Cx630889',
    // 数据库名
    database: 'sunshine',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
