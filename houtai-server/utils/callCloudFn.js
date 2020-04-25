const rp = require('request-promise'); // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken'); // 微信接口调用凭证

/**
 * callCloudFn 调用云函数方法
 * @param {object} ctx 上下文，ctx.state.env云开发环境ID
 * @param {string} fnName 云函数名称
 * @param {object} params 传递给云函数的参数
 */
const callCloudFn = async (ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ ACCESS_TOKEN }&env=${ ctx.state.env }&name=${ fnName }`;
  const options = {
    method: 'POST',
    uri: url,
    body: {
      ...params
    },
    json: true // 自动将字符串转为JSON格式
  }

  // 发送请求，并返回数据
  return await rp(options)
    .then(res => res)
    .catch(error => {
      console.log(error);
    });
};

module.exports = callCloudFn;