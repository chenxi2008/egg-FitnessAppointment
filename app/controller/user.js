'use strict'

const BaseController = require('./base');

class UserController extends BaseController {
	async updateUserinfo() {
		let { ctx, app } = this
		let { openid, userinfo } = ctx.query

		if (openid && userinfo) {
			let UPDATE = `
				UPDATE user
				SET userinfo='${userinfo}'
				WHERE openid='${openid}'`
			try {
				let res = await app.mysql.query(UPDATE)
				console.log(UPDATE, res)
			} catch (e) {
				this.error = e
			}
			this.render({
				type: this.error
					? 'fail'
					: 'success',
				message: this.error
					? this.error
					: '成功',
				data: { }
			})

		} else {
			this.render({
				type: 'fail',
				msg: '缺少openid'
			})
		}

	}
}

module.exports = UserController;
