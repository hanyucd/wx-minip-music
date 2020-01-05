// components/blog-ctrl/blog-ctrl.js
let userInfo = {}; // 存储用户信息
const db = wx.cloud.database(); // 初始化数据库

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLogin: false,   // 是否显示底部授权弹窗，默认false不显示
    isShowComment: false, // 是否显示底部评论框，默认false不显示
    content: ''
  },
  // 调用外部样式
  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo;
                this.setData({ isShowComment: true });
              }
            });
          } else {
            this.setData({ isShowLogin: true });
          }
        }
      });
    },
    /**
     * 用户点击评论后确认授权成功
     */
    onLoginSuccess(event) {
      userInfo = event.detail;
      this.setData({ isShowLogin: false }, () => {
        this.setData({ isShowComment: true });
      });
    },
    /**
     * 用户拒绝授权
     */
    onLoginFail() {
      wx.showModal({
        title: '用户授权才可以评论噢 ',
        showCancel: false,
        confirmText: '回去授权',
        confirmColor: '#d81e06'
      });
    },
    /**
     * 发送评论
     */
    onSend(event) {
      console.log(event);
      let formId = event.detail.formId  // 用于发送模板消息formId
      let content = event.detail.value.content;

      // if (content.trim() == '') {
      //   wx.showModal({
      //     title: '评论提醒',
      //     content: '评论的内容不能为空噢',
      //     confirmText: '我知道了',
      //     showCancel: false,
      //     confirmColor: '#d81e06'
      //   })
      //   return;
      // }

      // wx.showLoading({ title: '评论中...', mask: true });
      // // 小程序端插入数据库，默认带_openId字段
      // db.collection('blog-comment').add({
      //   data: {
      //     content,
      //     blogId: this.properties.blogId,
      //     nickName: userInfo.nickName,
      //     avatarUrl: userInfo.avatarUrl,
      //     createTime: db.serverDate()
      //   }
      // }).then(res => {
      //   wx.hideLoading();
      //   wx.showToast({ title: '评论成功' });
      //   this.setData({ isShowComment: false });
      // });
    }
  }
});
