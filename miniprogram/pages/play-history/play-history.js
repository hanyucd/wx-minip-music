// miniprogram/pages/play-history/play-history.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = app.globalData.openid;
    const playHistory = wx.getStorageSync(openid);

    if (playHistory.length !== 0) {
      this.setData({ playHistory });
    }

    // storage里把musiclist（播放列表）的内容换成播放历史的列表
    wx.setStorage({
      key: 'musiclist',
      playHistory
    });
  }
})