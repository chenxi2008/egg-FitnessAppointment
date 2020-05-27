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
			let query = `
				INSERT INTO
					user (openid) SELECT ('${data.openid}')
				FROM DUAL
				WHERE NOT EXISTS
					(SELECT openid FROM user WHERE openid='${data.openid}')
			`
			try {
				let res = await app.mysql.query(query)
				console.log(res)
				// if (res.length == 0) {
				// 	await app.mysql.query(INSERT)
				// }
			} catch (e) {
				this.error = e
				console.log(e)
			}
			this.render({
				type: this.error ?
					'fail' : 'success',
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
