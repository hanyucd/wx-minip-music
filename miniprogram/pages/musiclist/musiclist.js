// miniprogram/pages/musiclist/musiclist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [], // 歌单对应的歌曲集合
    coverImgInfo: {} // 歌单封面信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '歌曲加载中...' });
    
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        playlistId: options.playlistId
      }
    }).then(res => {
      const pl = res.result.playlist;
      this.setData({
        musiclist: pl.tracks,
        coverImgInfo: {
          coverImgUrl: pl.coverImgUrl,
          coverImgName: pl.name
        }
      });
      wx.hideLoading();
    });
  }
});