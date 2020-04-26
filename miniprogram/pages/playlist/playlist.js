// miniprogram/pages/music/music.js
const MAX_LIMIT = 15  // 歌单每次请求的最大量
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      // {
      //   url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      // }, {
      //   url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      // }, {
      //   url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg'
      // } // 轮播图
    ],
    playlist: [] // 歌单列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSwiperList();
    this._getPlaylist();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作--下拉重新请求
   */
  onPullDownRefresh: function () {
    this.setData({ playlist: [] });
    this._getPlaylist();
  },
  /**
   * 页面上拉触底事件的处理函数--加载更多歌单
   */
  onReachBottom: function () {
    this._getPlaylist();
  },
  /**
   * 向云服务请求获取歌单列表
   */
  _getPlaylist() {
    wx.showLoading({ title: '歌单加载中...' });

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist',
        start: this.data.playlist.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      this.setData({
        playlist: [...this.data.playlist, ...res.result.data]
      });
      wx.stopPullDownRefresh(); // 停止当前页面下拉刷新
      wx.hideLoading();
    });
  },

  /**
   * 获取轮播图
   */
  async _getSwiperList() {
    const data = await db.collection('swiper')
      .get().then(res => res.data);
    
    this.setData({
      swiperImgUrls: data
    });
  }
});