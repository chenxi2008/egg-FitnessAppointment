
const Controller = require('egg').Controller;

class Base extends Controller {
	success(o) {
		this.ctx.body = {
			code: o.code ? o.code : 200,
			data: o.data ? o.data : {},
			msg: o.msg ? o.msg : '成功'
		}
	}
	faile(o) {
		this.ctx.body = {
			code: o.code ? o.code : 400,
			data: o.data ? o.data : {},
			msg: o.msg ? o.msg : '失败'
		}
	}
	/**
	* @{type}:success: fail
	*
	*
	**/
	render(o) {
		this.ctx.body = {
			data: o.data ? o.data : {},
			code: o.code
				? o.code
				: (o.type === 'fail' ? 400 : 200),
			msg: o.msg
				? o.msg
				: (o.type === 'fail' ? '失败' : '成功')
		}
	}
	getTime(type, key) {
		let date = new Date()

		if (key == 'next') {
			date = new Date(new Date().getTime() + 24*60*60*1000)
		}
		else if (key == 'prev') {
			date = new Date(new Date().getTime() - 24*60*60*1000)
		}
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let hours = date.getHours()
		let minutes = date.getMinutes()
		let seconds = date.getSeconds()
		let temp = (v) => {
			if (v > 9) {
				return v
			} else {
				return `0${v}`
			}
		}
		if (type == 'y-m-d') {
			return `${year}-${temp(month)}-${temp(day)}`
		}
		return `${year}-${temp(month)}-${temp(day)} ${temp(hours)}:${temp(minutes)}:${tempp(seconds)}`
	}
	getUserInfo() {

	}
	getSomeThing() {

	}
}


module.exports = Base
