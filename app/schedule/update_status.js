module.exports = {
  schedule: {
    cron: '0 0 8 * * *',
    // interval: '5s',
    type: 'all',
  },
  async task(ctx) {
    let { app } = ctx
    let Update = `
      UPDATE 
        _order 
      SET 
        state='success'
      WHERE 
        _order.state='confirm'
    `
    try {
      await app.mysql.query(Update);
    } catch (e) {
      ctx.logger.error(e)
    }
  },
};