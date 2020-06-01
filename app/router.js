'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index)

  router.get('/getTimeOptions', controller.home.getTimeOptions)

  router.get('/auth', controller.auth.index)
  router.get('/auth/flashAccessToken', controller.auth.flashAccessToken)

  router.get('/user/login', controller.user.login)
  router.get('/user/submitOrder', controller.user.submitOrder)
  router.get('/user/getOrderList', controller.user.getOrderList)
  //获取器材列表
  router.get('/equipment/getEquipmentList', controller.equipment.getEquipmentList)

  router.get('/order/changeState', controller.order.changeState)
  router.get('/order/getOrderList', controller.order.getOrderList)
  router.get('/order/getOrderById', controller.order.getOrderById)
};