const callCloudDB = require('../utils/callCloudDB'); // 操作云数据库的封装
const callCloudStorage = require('../utils/callCloudStorage'); // 操作云存储的封装
const Router = require('koa-router');
const router = new Router();

router.get('/list', async (ctx, next) => {
  const params = ctx.request.query;
  const query = `
    db.collection('blog').skip(${ params.start }).limit(${ params.count} ).orderBy('createTime', 'desc').get()
  `;
  const res = await callCloudDB(ctx, 'databasequery', query);

  ctx.body = {
    code: 20000,
    data: res.data
  };
});

// 删除博客
router.post('/del', async (ctx, next) => {
  // 删除数据库中博客、相关评论、云存储中的相关图片
  const params = ctx.request.body // post请求 获取前端传入数据
  // 删除 blog
  const queryBlog = `db.collection('blog').doc('${ params._id }').remove()`; // doc 找到一条数据
  const delBlogRes = await callCloudDB(ctx, 'databasedelete', queryBlog);

  // 删除 blog-comment | where 根据条件查找所有相关数据
  const queryComment = `db.collection('blog-comment').where({
    blogId: '${ params._id }'
  }).remove()`;
  const delCommentRes = await callCloudDB(ctx, 'databasedelete', queryComment);
  
  // 删除云存储图片
  const delStorageRes = await callCloudStorage.delete(ctx, params.img);

  ctx.body = {
    code: 20000,
    data: {
      delBlogRes,
      delCommentRes,
      delStorageRes
    }
  }
});

module.exports = router;