'use strict'

const BaseController = require('./base');

class UserController extends BaseController {
	async update() {
		let { ctx, app } = this
		let { openid, userinfo } = ctx.query

		if (openid && userinfo) {
			let UPDATE = `UPDATE user SET userinfo=${userinfo}`
			try {
				await app.mysql.query(UPDATE)
			} catch (e) {
				this.error = true
			}
			this.render({
				type: this.error
					? 'fail'
					: 'success',
				data: { openid }
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
