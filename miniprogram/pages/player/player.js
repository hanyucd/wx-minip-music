// miniprogram/pages/player/player.js
let currentMusicIndex = 0; // 当前播放歌曲的索引
let globalMusicList = []; // 存储全局的歌单歌曲列表
let musiclist = []; // 歌单歌曲列表
const backgroundAudioManager = wx.getBackgroundAudioManager(); // 获取全局唯一的背景音频管理器
const app = getApp(); // 获取全局app实例

Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 歌曲的封面图
    isPlaying: false // 歌曲是否播放中，默认 false 没有播放
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
    backgroundAudioManager.stop();
    
    globalMusicList = app.globalData.musicList;
    // 拿去全局的歌曲列表，将歌单所有歌曲信息储存在Storage
    wx.setStorageSync('musiclist', globalMusicList);
    // 获取歌单歌曲
    musiclist = wx.getStorageSync('musiclist');

    let musicInfo = musiclist[currentMusicIndex];
    wx.setNavigationBarTitle({ title: musicInfo.name }); // 动态设置当前页面的标题
    this.setData({
      picUrl: musicInfo.al.picUrl
    });
    wx.showLoading({ title: '歌曲加载中...' });
    // 获取歌曲播放链接
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      const result = res.result;

      backgroundAudioManager.src = result.data[0].url;
      backgroundAudioManager.title = musicInfo.name;
      backgroundAudioManager.coverImgUrl = musicInfo.al.picUrl;
      backgroundAudioManager.singer = musicInfo.ar[0].name;
      backgroundAudioManager.epname = musicInfo.ar.name;

      this.setData({ isPlaying: true });
      wx.hideLoading();
    });
  },
  /**
   * 点击播放按钮切换播放 和 暂停
   */
  togglePlay() {
    this.data.isPlaying ? backgroundAudioManager.pause() : backgroundAudioManager.play();
    this.setData({ isPlaying: !this.data.isPlaying });
  },
  /**
   * 上一首
   */
  prevMusic() {
    --currentMusicIndex;
    currentMusicIndex = currentMusicIndex < 0 ? musiclist.length - 1 : currentMusicIndex;
    this._loadMusicDetail(musiclist[currentMusicIndex].id);
  },
  /**
   * 下一首
   */
  nextMusic() {
    ++currentMusicIndex;
    currentMusicIndex = currentMusicIndex > musiclist.length ? 0 : currentMusicIndex;
    this._loadMusicDetail(musiclist[currentMusicIndex].id);
  }
});