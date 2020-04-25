const rp = require('request-promise'); // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken'); // 微信接口调用凭证

/**
 * callCloudDB 调用云数据库方法
 * @param {object} ctx 上下文，ctx.state.env云开发环境ID
 * @param {string} fnName 接口的增删改查名称，增databaseadd、删databasedelete、改databaseupdate、查databasequery
 * @param {object} query 数据库操作语句
 */
const callCloudDB = async (ctx, fnName, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken(); // 获取微信接口调用凭证
  const url = `https://api.weixin.qq.com/tcb/${ fnName }?access_token=${ ACCESS_TOKEN }`;
  const options = {
    method: 'POST',
    uri: url,
    body: {
      query, // 数据库操作语句
      env: ctx.state.env // 云环境ID
    },
    json: true
  };
  
  // 发送请求，并返回数据
  return await rp(options)
    .then(res => res)
    .catch(error => {
      console.log(error);
    });
}

module.exports = callCloudDB;
