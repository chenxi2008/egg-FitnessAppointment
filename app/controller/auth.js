'use strict'

const BaseController = require('./base');

class AuthController extends BaseController {
	async index() {
		let { ctx, config } = this
		let { js_code } = ctx.query
		let { appId, appSecret } = config

		if (!js_code) {
			this.render({
				type: 'fail',
				msg: '请传入正确的js code'
			})
		}

		let  {data} = await this.ctx.curl(
			`https://api.weixin.qq.com/sns/jscode2session`, {
				data: {
					appid: appId,
          secret: appSecret,
          js_code: js_code,
          grant_type: 'authorization_code'
				},
				method: 'GET',
				dataType: 'json'
			}
		)
	
		this.render({
			type: 'success',
			data: data
		})
		
	}
}

module.exports = AuthController;