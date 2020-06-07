
const BaseController = require('./base');

class UserController extends BaseController {
	async login() {
		let { ctx, app } = this
		let { username, password } = ctx.query
		let err, res;
		if (!username || !password) {
			this.render({
				type: 'fail',
				msg: '请输入正确的姓名或密码'
			})
		} else {
			let QUERY = `
				SELECT * 
				FROM 
					_account
				WHERE 
					_account.username='${username}' 
				AND 
					_account.password='${password}'
			`
			try {
				res = await app.mysql.query(QUERY)
			} catch (e) {
				err = e
			} finally {
				if (err) {
					this.render({
						type: 'fail',
						msg: JSON.stringify(err)
					})
				} else {

					this.render({
						type: res.length ? 'success' : 'fail',
						msg: res.length ? '' : '用户名或密码错误',
						data: res
					})
				}
			}
		}
	}
	async submitOrder() {
		let { ctx, app, config } = this
		let nowtime = this.getTime('y-m-d')
		let otherList = ['name', 'mobile', 'jobnumber', 'department']
		let { openid, userinfo, otherinfo, equipment, time, type } = ctx.query
		otherinfo = JSON.parse(otherinfo)
		if (openid && userinfo && otherinfo) {
			let haveNull = otherList.map(item => {
				let res = otherinfo[item].trim()
				return res ? res : ''
			}).filter(i => i)

			if (haveNull.length !== otherList.length) {
				this.render({
					type: 'fail',
					msg: '填写的数据有误，请查看后重新提交'
				})
				return false
			}
			let UPDATE = `
				UPDATE _user
				SET
					userinfo='${userinfo}',
					name='${otherinfo.name}',
					mobile='${otherinfo.mobile}',
					jobnumber='${otherinfo.jobnumber}',
					department='${otherinfo.department}'
				WHERE 
					openid='${openid}'`
			/***
				查询当前用户今天是否有数据
				查询当前活动选择的时间段没有预约的id  预约满了就提示
				插入数据
			**/
			let step1 = `
				SELECT * 
				FROM 
					_order
				WHERE 
					openid = '${openid}' 
				AND 
					createtime = '${nowtime}'
			`
			//获取当前已存
			let step2 = `
				SELECT
					_equipment.id,
					_equipment.name,
					_order.begintime
				FROM
					_equipment,_order
				WHERE
					_equipment.name ='${equipment}'
				AND _order.equipmentid = _equipment.id
				AND _order.createtime = '${nowtime}'
				AND _order.begintime = '${time}'
			`

			let temp = `
				SELECT id FROM _equipment
				WHERE _equipment.name='${equipment}' ORDER BY id
			`
			let INSERT = (equipmentid) => {
				return `INSERT INTO
					_order(
						state,
						openid,
						equipmentname,
						equipmentid,
						createtime,
						begintime
					)
				VALUES
					('padding','${openid}','${equipment}','${equipmentid}','${nowtime}','${time}')
				`
			}
			try {
				await app.mysql.query(UPDATE)
				temp = await app.mysql.query(temp)
				step1 = await app.mysql.query(step1)
				step2 = await app.mysql.query(step2)
				if (step1.length) {
					this.render({
						type: 'fail',
						msg: '您今天已经预约过一次，每天只能预约一次！'
					})
					return
				}

			} catch (e) {
				this.error = e
				this.render({
					type: 'fail',
					msg: JSON.stringify(e)
				})
			}
			temp = temp.length && temp.map(item => item.id)
			//如果是电影预约
			if (type == '电影') {
				if (step2.length == config.seatNum) {
					this.render({
						type: 'fail',
						msg: '该时段的健身预约已满，请更换时间段'
					})
				} else {
					let _e = null;
					try {
						await app.mysql.query(INSERT(temp[0]))
					} catch (e) {
						_e = e
					} finally {
						this.render({
							type: _e ? 'fail' : 'success',
							msg: _e ? JSON.stringify(_e) : ''
						})
					}
				}
			} else {
				//其他预约
				if (step2.length) {
					//当前
					let have = step2.map(item => item.id)
					var d = temp.filter(function (v) { return !~have.indexOf(v) })[0]

					if (d) {
						let err = null
						try {
							await app.mysql.query(INSERT(d))
						} catch (e) {
							err = e
						}

						this.render({
							type: err ? 'fail' : 'success',
							msg: err ? '操作失败请稍后再试' : '提交成功'
						})
					} else {
						this.render({
							type: 'fail',
							msg: '该时段的健身预约已满，请更换时间段'
						})
					}

				} else {

					let err = null
					try {
						await app.mysql.query(INSERT(temp[0]))
					} catch (e) {
						err = e
					}

					this.render({
						type: err ? 'fail' : 'success',
						msg: err ? '操作失败请稍后再试' : '提交成功'
					})
				}
			}
		} else {
			this.render({
				type: 'fail',
				msg: '缺少参数，请确认后重新提交'
			})
		}
	}
	async getOrderList() {
		let { ctx, app } = this
		let { openid } = ctx.query
		let err = null
		let QUERY = `
			SELECT
				a.id,
				a.state,
				a.begintime,
				a.createtime,
				a.equipmentid,
				a.equipmentname,
				b.type
			FROM 
				_order a
			LEFT JOIN 
				_equipment b
			ON 
				a.equipmentid = b.id
			WHERE 
				a.openid='${openid}'
			ORDER BY 
				a.createtime DESC
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
}

module.exports = UserController;
