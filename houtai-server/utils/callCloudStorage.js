const rp = require('request-promise'); // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken'); // 微信接口调用凭证
const fs = require('fs'); // node文件模块

const callCloudStorage = {
  /**
   * callCloudStorage.download() 调用云存储下载方法
   * @param {object} ctx 上下文，ctx.state.env云开发环境ID
   * @param {Array.<Object>} fileList 文件列表
   */
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken(); // 获取微信接口调用凭证
    const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ ACCESS_TOKEN }`;
    const options = {
      method: 'POST',
      uri: url,
      body: {
        env: ctx.state.env,
        file_list: fileList
      },
      json: true
    };

    // 发送请求，并返回数据
    return await rp(options)
      .then(res => res)
      .catch(error => {
        console.log(error);
      });
  },
  // 上传文件到云存储
  async upload(ctx) {
    // 步骤1, 请求地址
    const ACCESS_TOKEN = await getAccessToken(); // 获取微信接口调用凭证
    const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ ACCESS_TOKEN }`;

    const file = ctx.request.files.file; // ctx.request.files.file前端提交上来的图片对象
    const path = `swiper/${ Date.now() }-${ Math.random() }-${ file.name }`;  // 构建文件路径

    const options = { // request-promise发送post请求的配置
      method: 'POST',
      uri: url,
      body: { // 传入参数
        path,
        env: ctx.state.env, // 云环境ID
      },
      json: true
    };

    // 发送请求
    const info = await rp(options)
      .then(res => res)
      .catch(error => {
        console.log(error);
      });

    // 步骤 2, 上传图片。到这里并没有上传到云存储，还需再发送一个HTTP POST请求
    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      uri: info.url,
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token, // 字段包含横杠，需改成字符串
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path) // 转成二进制
      }
    };
    await rp(params);
    return info.file_id;
  },
  // 删除云文件
  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken(); // 获取微信接口调用凭证
    const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ ACCESS_TOKEN }`;

    const options = {
      method: 'POST',
      uri: url,
      body: { // 传入参数
        fileid_list,
        env: ctx.state.env // 云环境ID
      },
      json: true
    };

    return await rp(options)
      .then(res => res)
      .catch(error => {
        console.log(error)
      });
  }
};

module.exports = callCloudStorage;