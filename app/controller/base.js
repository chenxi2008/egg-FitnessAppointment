
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
			code: o.code ? o.code : 500,
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
				: (o.type === 'fail' ? 500 : 200),
			msg: o.msg 
				? o.msg 
				: (o.type === 'fail' ? '失败' : '成功')
		}
	}
	getUserInfo() {
		
	}
	getSomeThing() {

	}
}


module.exports = Base