'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index)

  router.get('/getTimeOptions', controller.home.getTimeOptions)

  router.get('/auth', controller.auth.index)

  router.get('/user/update', controller.user.update)
};
