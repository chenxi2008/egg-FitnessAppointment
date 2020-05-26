'use strict'

const BaseController = require('./base');

class AuthController extends BaseController {
	async index() {
		let { ctx, config, app } = this
		let { js_code } = ctx.query
		let { appId, appSecret } = config

		if (!js_code) {
			this.render({
				type: 'fail',
				code: '401',
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

		if (data && data.openid) {
			let INSERT = `INSERT INTO user (openid) values ('${data.openid}')`
			try {
				await app.mysql.query(INSERT)
			} catch (e) {
				this.error = e
			}
			this.render({
				type: this.error ?
					'success' : 'fail',
				msg: this.error,
				data: {openid: data.openid}
			})

		} else {
			this.render({
				type: 'fail',
				code: data.code,
				message: data.errmsg
			})
		}

	}
}

module.exports = AuthController;
