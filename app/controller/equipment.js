'use strict'

const BaseController = require('./base');

class EquipmentController extends BaseController {
	async getEquipmentList() {
		let { ctx, app } = this
		//取所有的器材类型
		let SELECT = `
			SELECT distinct name,timenode FROM _equipment
		`
		try {
			var res = await app.mysql.query(SELECT)
		} catch (e) {
			this.error = e
		}
		this.render({
			type: this.error ?
				'fail' : 'success',
			msg: this.error ?
				this.error: '',
			data: res
		})

	}
}

module.exports = EquipmentController;
