// miniprogram/pages/blog/blog.js
let keyword = '' // 搜索关键字

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({ blogList: [] });
    this._loadBlogList(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._loadBlogList(this.data.blogList.length);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(event) {
    let blog = event.target.dataset.blog;
    return {
      title: blog.content,
      path: "/pages/blog-comment/blog-comment"
    };
  },

  /**
   * 搜索
   */
  onSearch(event) {
    keyword = event.detail.keyword;
    this.setData({ blogList: [] });
    this._loadBlogList(0);
  },
  /**
   * 加载博客列表
   */
  _loadBlogList(start = 0) {
    wx.showLoading({ title: '加载中...' });

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 20,
        $url: 'list'
      }
    }).then(res => {
      this.setData({
        blogList: [...this.data.blogList, ...res.result]
      });
      wx.hideLoading();
      wx.stopPullDownRefresh(); // 停止当前页面下拉刷新
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
  },
  /**
   * 进入博客卡片详情
   */
  goComment(event) {
    wx.navigateTo({ url: `../../pages/blog-comment/blog-comment?blogId=${ event.currentTarget.dataset.blogId }` });
  }
});