const Router = require('koa-router'); // 用于写后端提供给前端的接口
const callCloudFn = require('../utils/callCloudFn'); // 调用云函数的封装

const router = new Router(); // 初始化 koa-router

/**
 * 查询歌单列表
 */
router.get('/list', async (ctx, next) => {
  const query = ctx.request.query;

  let data = [];

  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    start: parseInt(query.start) || 0,
    count: parseInt(query.count) || 50
  });

  (res.resp_data) && (data = JSON.parse(res.resp_data).data);

  ctx.body = {
    data,
    code: 20000
  };
});

module.exports = router;