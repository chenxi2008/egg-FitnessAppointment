'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const { ctx, app } = this;
		let res = await app.mysql.query('select * from equipment');
		ctx.body = res
	}
	async getTimeOptions() {
		const { ctx } = this;
		let hour = 23
		let minu = 59
		let second = 59
		let options = []
		let zeroize = function (v) {
			return v < 10 ? '0' + v : v + ''
		}
		for (var i = 0; i <= hour; i++) {
			var leve1 = {
				lable: zeroize(i),
				value: zeroize(i),
				children: []
			}
			for (var j = 0; j <= minu; j++) {
				var leve2 = {
					lable: zeroize(j),
					value: zeroize(j),
					children: []
				}
				for (var k = 0; k <= second; k++) {
					var leve3 = {
						lable: zeroize(k),
						value: zeroize(k)
					}
					leve2.children.push(leve3)
				}

				leve1.children.push(leve2)
			}

			options.push(leve1)
		}
		ctx.body = options
	}
}

module.exports = HomeController;
