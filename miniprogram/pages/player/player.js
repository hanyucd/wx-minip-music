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
    isPlaying: false, // 歌曲是否播放中，默认 false 没有播放
    isLyricShow: false, // 表示当前歌词是否显示
    lyric: '', // 歌词
    isSame: false, // 用于判断从歌单重新进入时是否为同一首歌曲
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
    if (musicId === app.getMusicId()) {
      this.setData({ isSame: true });
    } else {
      globalMusicList = app.globalData.musicList;
      // 取全局的歌曲列表，将歌单所有歌曲信息储存在Storage
      wx.setStorageSync('musiclist', globalMusicList);
      // 获取歌单歌曲
      musiclist = wx.getStorageSync('musiclist');
      this.setData({ isSame: false });
    }
    
    let musicInfo = musiclist[currentMusicIndex];
    wx.setNavigationBarTitle({ title: musicInfo.name }); // 动态设置当前页面的标题
    // 设置全局属性
    app.setMusicId(musicId); 

    if (!this.data.isSame) {
      backgroundAudioManager.stop();
    }
    
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
      if (result.data[0].url == null) {
        wx.showToast({
          title: '此歌曲为 VIP',
          image: "../../images/music-vip.png",
          duration: 2500
        });
        setTimeout(() => {
          this.nextMusic();
        }, 2000);
        return;
      }

      if (!this.data.isSame) { // 不是同一首歌时
        backgroundAudioManager.src = result.data[0].url;
        backgroundAudioManager.title = musicInfo.name;
        backgroundAudioManager.coverImgUrl = musicInfo.al.picUrl;
        backgroundAudioManager.singer = musicInfo.ar[0].name;
        backgroundAudioManager.epname = musicInfo.ar.name;

        // 保存播放历史到本地存储
        this._savePlayHistory();
      }

      this.setData({ isPlaying: true });
      wx.hideLoading();

      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then(res => {
        const lrc = res.result.lrc;
        this.setData({
          lyric: lrc ? lrc.lyric : '暂无歌词'
        });
      });
    });
  },

  /**
   * 保存播放历史到本地存储
   */
  _savePlayHistory() {
    // 当前播放歌曲
    const currentSong = musiclist[currentMusicIndex];
    // 从全局属性获取openid
    const openid = app.globalData.openid;
    // 从本地存储获取播放历史数组
    const playHistory = wx.getStorageSync(openid);

    for (let i = 0, len = playHistory.length; i < len; i++) {
      if (playHistory[i].id === currentSong.id) {
        playHistory.splice(i, 1);
        break;
      }
    }
    // 在数组开头插入
    playHistory.unshift(currentSong);
    wx.setStorage({
      key: openid,
      data: playHistory
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
  },
  /**
   * 显示 / 隐藏歌词
   */
  onChangeLyricShow() {
    this.setData({ isLyricShow: !this.data.isLyricShow });
  },
  /**
   * 监听子组件事件 将目前正在播放的时间，传递到歌词组件当中去
   */
  timeUpdate(event) {
    this.selectComponent('.lyric').updata(event.detail.currentTime);
  },
  /**
   * 监控到音乐播放（微信后台播放暂停按钮）
   */
  onPlay() {
    this.setData({ isPlaying: true });
  },
  /**
   * 监控到音乐暂停（微信后台播放暂停按钮）
   */
  onPause() {
    this.setData({ isPlaying: false });
  }
});