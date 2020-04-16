// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/format-time';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ blogId: options.blogId });
    this._getBlogDetail();
  },

  /**
   * 获取博客详情
   */
  _getBlogDetail() {
    wx.showLoading({ title: '加载中', mask: true });

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      }
    }).then(res => {
      // 请求数据成功
      //将每一条评论的时间进行格式化
      let commentList = res.result.commentList.data;
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
      this.setData({
        blog: res.result.detail[0],
        commentList,
      });

      wx.hideLoading();
    });
  }
});