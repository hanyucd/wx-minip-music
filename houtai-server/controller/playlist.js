const callCloudFn = require('../utils/callCloudFn'); // 调用云函数的封装
const callCloudDB = require('../utils/callCloudDB'); // 操作云数据库的封装
const Router = require('koa-router'); // 用于写后端提供给前端的接口
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

/**
 * 通过 id 查询单条歌单
 */
router.get('/getById', async (ctx, next) => {
  const id = ctx.request.query.id;
  const query = `db.collection('playlist').doc('${ id }').get()`;

  const res = await callCloudDB(ctx, 'databasequery', query);
  ctx.body = {
    code: 20000,
    data: JSON.parse(res.data)
  };
});

/**
 * 更新歌单
 */
router.post('/updatePlaylist', async (ctx, next) => {
  const params = ctx.request.body; // post请求获取前端传来的数据，需安装和配置koa-body
  const id = params._id;

  const query = `
    db.collection('playlist').doc('${ id }').update({
      data: {
        name: '${ params.name }',
        copywriter: '${ params.copywriter }'
      }
    })
  `;

  const res = await callCloudDB(ctx, 'databaseupdate', query);

  ctx.body = {
    code: 20000,
    data: res
  }
});

/**
 * 删除歌单
 */
router.get('/del', async (ctx, next) => {
  const params = ctx.request.query;
  const id = params.id;
  const query =  `db.collection('playlist').doc('${ id }').remove()`;

  const res = await callCloudDB(ctx, 'databasedelete', query);

  ctx.body = {
    code: 20000,
    data: res
  };
});

module.exports = router;