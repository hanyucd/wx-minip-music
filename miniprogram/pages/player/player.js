// miniprogram/pages/player/player.js
let currentMusicIndex = 0; // 当前播放歌曲的索引
let globalMusicList = []; // 存储全局的歌单歌曲列表
let musiclist = []; // 歌单歌曲列表

const app = getApp() // 获取全局app实例

Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '' // 歌曲的封面图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentMusicIndex = options.index;
    this._loadMusicDetail(options.musicId);
  },
  /**
   * 加载歌曲的信息包括歌词
   * @param {String} musicId 
   */
  _loadMusicDetail(musicId) {
    globalMusicList = app.globalData.musicList;
    // 拿去全局的歌曲列表，将歌单所有歌曲信息储存在Storage
    wx.setStorageSync('musiclist', globalMusicList);
    // 获取歌单歌曲
    musiclist = wx.getStorageSync('musiclist');

    let musicInfo = musiclist[currentMusicIndex];
    wx.setNavigationBarTitle({ title: musicInfo.name });
    this.setData({
      picUrl: musicInfo.al.picUrl
    });
    // console.log(musicInfo);
    
    // 获取歌曲播放链接
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      console.log(res);
    });
  }
});