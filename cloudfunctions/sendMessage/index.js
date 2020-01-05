// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
   const { OPENID } = cloud.getWXContext();
   // 发送订阅消息
   const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: `/pages/blog-comment/blog-comment?blogId=${ event.blogId }`, // 用户点击推送消息打开的页面
      data: {
        thing4: {
          value: '评价完成'
        },
        thing1: {
          value: event.content
        }
      },
      templateId: 'SoCyIbjM8A9C4HOqFliXkkqRGgUKsh0cjlBPnSZiLd0'
  });
  return result;
};