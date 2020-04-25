/**
 * 获取微信接口调用凭证
 * 详情：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
 */
const rp = require('request-promise'); // node发送 http 请求的插件
const fs = require('fs'); // node文件模块
const path = require('path'); // node 路径模块
// fileName = __dirname 当前文件所在目录的绝对路径
const fileName = path.resolve(__dirname, '../cache/access_token.json');
// 这两个参数的获取：微信公众平台 > 开发 > 开发设置
const APPID = 'wx81d0bb9da8c3046d';
const APPSECRET = 'd694df03fcf4aefc0c5c972ca3e0f995';
// 微信 access_token 请求地址
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ APPID }&secret=${ APPSECRET }`;

/**
 * 发送请求获取 AccessToken
 */
const updateAccessToken = async () => {
  const resStr = await rp(URL);
  const res = JSON.parse(resStr);

  if (res.access_token) {
    fs.writeFileSync(fileName, JSON.stringify({
      access_token: res.access_token,
      createTime: new Date()
    }));
  } else {
    // 如获取不到，再次获取
    await updateAccessToken();
  }
};

/**
 * 读取 Access_token
 */
const getAccessToken = async () => {
  try {
    const readRes = fs.readFileSync(fileName, 'utf8');
    const readObj = JSON.parse(readRes);

    // 如果服务器宕机导致 setInterval 无法定时更新，这里需要再次判断 access_token 的有效性
    const createTime = new Date(readObj.createTime).getTime();
    const nowTime = new Date().getTime();
    if ((nowTime - createTime) > (7200 - 300) * 1000) {
      await updateAccessToken();
      await getAccessToken();
      return;
    }
    return readObj.access_token;
  } catch (error) {
    // 捕获异常，在未创建文件时，先创建文件
    await updateAccessToken();
    await getAccessToken();
  }
};

// Access_token 有效期为 2 个小时，定时更新 提前 5 分钟获取新的凭证
setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000);

module.exports = getAccessToken;


