// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router'); // 引入 tcb-router

cloud.init();
const db = cloud.database();
const blogCollection = db.collection('blog'); // 获取blog集合数据
// 每次查询的数据有限制，假设每次最多查询100条
const MAX_LIMIT = 100;

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

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId;

    // 详情博客信息查询
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then(res => {
      return res.data;
    });

    // 评论信息查询
    const countResult = await blogCollection.count(); //博客个数
    const total = countResult.total; //转换为number值
    // 将评论列表数据放入的commentList
    let commentList = {
      data: []
    }
    if (total > 0) {
      // 需要查询几次
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = [] //存放多个promise对象
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()

        tasks.push(promise)
      }
      if (tasks.length > 0) {
        //等所有数据都加载完成之后，使用reduce将数据进行汇总
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = { commentList, detail };
  });

  return app.serve();
};