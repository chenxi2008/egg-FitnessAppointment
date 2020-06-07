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
		try {
			let { data } = await this.ctx.curl(
				`https://api.weixin.qq.com/sns/jscode2session`, {
				data: {
					appid: appId,
					secret: appSecret,
					js_code: js_code,
					grant_type: 'authorization_code'
				},
				method: 'GET',
				dataType: 'json'
			})
		} catch (e) { }
		
		if (data && data.openid) {
			let query = `
				INSERT INTO
					_user (openid) 
				SELECT ('${data.openid}')
				FROM DUAL
				WHERE NOT EXISTS
					(SELECT openid FROM _user WHERE openid='${data.openid}')
			`
			try {
				await app.mysql.query(query)
			} catch (e) {
				this.error = e
			} finally {
				this.render({
					type: this.error ?
						'fail' : 'success',
					msg: this.error,
					data: { openid: data.openid }
				})
			}
		} else {
			this.render({
				type: 'fail',
				code: data.code,
				message: data.errmsg
			})
		}
	}
	async flashAccessToken() {
		let { ctx, config, app } = this
		let { appId, appSecret } = config
		let { openid } = ctx.query
		let { data } = await this.ctx.curl(
			`https://api.weixin.qq.com/cgi-bin/token`, {
			data: {
				appid: appId,
				secret: appSecret,
				grant_type: 'client_credential'
			},
			method: 'GET',
			dataType: 'json'
		}
		)
		if (data && data.access_token) {
			let query = `
				UPDATE 
					_user 
				SET 
					access_token='${data.access_token}' 
				WHERE 
					openid='${openid}'
			`
			try {
				await app.mysql.query(query)
			} catch (e) {
				this.error = e
			} finally {
				this.render({
					type: this.error ?
						'fail' : 'success',
					msg: this.error,
					data: { openid: data.openid }
				})
			}

		} else {
			this.render({
				type: 'fail',
				code: data.code,
				msg: '刷新token失效'
			})
		}
	}
}

module.exports = AuthController;
