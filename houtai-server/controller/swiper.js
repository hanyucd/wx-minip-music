const callCloudDB = require('../utils/callCloudDB'); // 调用云数据库方法传入参数
const callCloudStorage = require('../utils/callCloudStorage'); // 调用云存储下载文件方法传入参数
const Router = require('koa-router');
const router = new Router();

// 读取图片列表
router.get('/list', async (ctx, next) => {
  // 接口中读取数据库默认最多10条数据
  const query = `db.collection('swiper').get()`;
  const res = await callCloudDB(ctx, 'databasequery', query);
  const data = res.data;
  const fileList = [];

  data.forEach(item => {
    fileList.push({
      fileid: JSON.parse(item).fileid,
      max_age: 7200
    });
  });
  // 获取到包含图片链接的数据
  const dlRes = await callCloudStorage.download(ctx, fileList);

  // 组装字段
  let returnData = [];
  dlRes.file_list.forEach((item, index) => {
    returnData.push({
      fileid: item.fileid,
      download_url: item.download_url,
      _id: JSON.parse(data[index])._id
    });
  });

  ctx.body = {
    code: 20000,
    data: returnData
  };
});

// 上传图片
router.post('/upload', async (ctx, next) => {
  const fileid = await callCloudStorage.upload(ctx); // 上传图片

  const query = `
    db.collection('swiper').add({
      data: {
        fileid: '${ fileid }'
      }
    })
  `;

  const res = await callCloudDB(ctx, 'databaseadd', query);

  ctx.body = {
    code: 20000,
    id_list: res.id_list
  };
});

// 删除图片
router.get('/del', async (ctx, next) => {
  const params = ctx.request.query; // 前端传入的数据
  // 删除云数据库中的内容
  const query = `db.collection('swiper').doc('${ params._id }').remove()`;
  const delDBRes = await callCloudDB(ctx, 'databasedelete', query);
  // 删除云存储中的文件
  const delStorageRes = await callCloudStorage.delete(ctx, [params.fileid]);
  
  ctx.body = {
    code: 20000,
    data: {
      delDBRes,
      delStorageRes
    }
  }
});


module.exports = router;