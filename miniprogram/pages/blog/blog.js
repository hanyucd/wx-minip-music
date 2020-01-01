// miniprogram/pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowPopup: false, // 是否显示授权底部弹窗，默认false不显示
    blogList: [], // 存放博客页面的博客列表数据
  },
  onLoad() {
    this._loadBlogList();
  },
  /**
   * 加载博客列表
   */
  _loadBlogList() {
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        start: 0,
        count: 10
      }
    }).then(res => {
      console.log(res);
      this.setData({
        blogList: [...this.data.blogList, ...res.result]
      });
    })
  },
  /**
   * 点击发布按钮时，获取授权信息，如没有授权则弹窗
   */
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 如果授权成功，就获取用户头像等信息
          wx.getUserInfo({
            success: res => {
              this.onLoginSuccess({ detail: res.userInfo });
            }
          });
        } else {
          this.setData({ isShowPopup: true });
        }
      }
    });
  },
  /**
   * 同意授权成功时，进行页面跳转 → 发布编辑页
   */
  onLoginSuccess(event) {
    const detail = event.detail;
    this.setData({ isShowPopup: false });
    
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${ detail.nickName }&avatarUrl=${ detail.avatarUrl }`
    });
  },
  /**
   * 拒绝授权
   */
  onLoginFail() {
    wx.showModal({
      title: '用户授权才可以发布博客噢 ',
      showCancel: false,
      confirmText: '回去授权',
      confirmColor: '#d81e06'
    });
  }
})