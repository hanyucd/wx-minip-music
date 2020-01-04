// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router'); // 引入 tcb-router

cloud.init();
const db = cloud.database();
const blogCollection = db.collection('blog'); // 获取blog集合数据

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword;
    let w = {};
    if (keyword.trim() != '') {
      w = {
        content: db.RegExp({ regexp: keyword, options: 'i' })
      };
    }

    // where查询条件 skip 从第几条开始查，limit 查几条数据，orderBy(排序字段，排序方式) 排序，排序方式desc降序/asc升序
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then(res => {
        return res.data;
      });

    ctx.body = blogList;
  });

  return app.serve();
};