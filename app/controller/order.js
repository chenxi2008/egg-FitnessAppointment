
const BaseController = require('./base');

class OrderController extends BaseController {
	async changeState() {
		let {ctx, app} = this
		let { id, state, openid } = ctx.query
		let err = null
		let QUERY = `
			UPDATE _order SET state='${state}'
			WHERE _order.id=${id}
		`
		if (!id || !state) {
			this.render({
				type: 'fail',
				msg: '缺少参数'
			})
		}
		try {
			var res = await app.mysql.query(QUERY)
		} catch (e) {
			err = e
		} finally {
			this.render({
				type: err ? 'fail' : 'success',
				msg: err ? JSON.stringify(err) : '',
				data: res
			})
			!err && (state=='comfirm') && this.sendTemplateMessage(id)
		}
	}
	async getOrderList() {
		let {ctx, app} = this
		let nowtime = this.getTime('y-m-d')
		let prevday = this.getTime('y-m-d', 'prev')
		let err = null

		let QUERY = `
			SELECT
				a.id,
				b.name,b.mobile,
				b.jobnumber,b.department,
				a.state,a.equipmentname,
				a.equipmentid,
				a.createtime,a.begintime
			FROM _order a
			LEFT JOIN _user b
			ON b.openid = a.openid
			WHERE a.createtime='${nowtime}' OR a.createtime='${prevday}'
			ORDER BY a.createtime DESC
		`
		try {
			var res = await app.mysql.query(QUERY)
		} catch (e) {
			err = e
		} finally {
			this.render({
				type: err ? 'fail' : 'success',
				msg: err ? JSON.stringify(err) : '',
				data: res
			})
		}
	}
	async sendTemplateMessage(id) {
		let {ctx, app} = this
		let err, res;
		let QUERY = `
			SELECT
				a.access_token,
				a.openid,
				b.equipmentname,
				b.equipmentid,
				b.createtime,
				b.begintime
			FROM _user a,
			LEFT JOIN _order b
			ON b.openid=a.openid
			WHERE b.id='${id}'
		`

		try {
			res = await app.mysql.query(QUERY)
			if (res.length) {
				let {openid, access_token, equipmentid, createtime, begintime} = res[0]
				let showId = equipmentid == 16 ? '' : equipmentid
				let createtime = new Date(new Date(createtime).getTime() + 24*60*60*1000)
				let year = date.getFullYear()
        let month = date.getMonth() + 1
        let date = date.getDate()
				let { data } = await this.ctx.curl(
					`https://api.weixin.qq.com/cgi-bin/message/subscribe/send`, {
						data: {
							access_token: access_token,
		          touser: openid,
		         	template_id: 'u7pXsP1G7U2Bc1lDZH1BSxdSGAXbXyYSP9ROHr43x84',
		          data: {
								"thing1": { "value": `预约${equipmentname + showId}成功` },
								"time2": { "value": `${year}-${month}-${date} ${begintime}` },
								"thing3": { "value": '阳光信通2楼' },
								"thing4": { "value": '人事行政部' }
							}
						},
						method: 'POST',
						dataType: 'json'
					}
				)
			}

		} catch (e) {
			err = e
		} finally {
			this.render({
				type: err ? 'err' : 'success',
				msg: err ? JSON.stringify(er) : '',
			})
		}
	}
	async getOrderById() {
		let {ctx, app} = this
		let {id} = ctx.query
		let res, err;
		let QUERY = `
			SELECT * FROM _order
			WHERE _order.id = ${id}
		`
		try {
			res = await app.mysql.query(QUERY)
		} catch (e) {
			err = e
		} finally {
			this.render({
				type: err ? 'fail' : 'success',
				msg: err ? JSON.stringify(err) : '',
				data: err ? {} : res
			})
		}
	}
}

module.exports = OrderController;
