// components/progress-bar/progress-bar.js
let movableAreaWidth = 0; // 歌曲播放进度条宽度
let movableViewWidth = 0; // 歌曲圆点宽度
const backgroundAudioManager = wx.getBackgroundAudioManager();
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    percent: 0
  },

  lifetimes: {
    // 在组件布局完成后执行
    ready() {
      this._getMovableDis();
      this._bindBGMEvent();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取当前设备中的进度条及其进度条圆点的尺寸
     */
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec(rect => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
      });
    },
    /**
     * 监听背景音频播放事件
     */
    _bindBGMEvent() {
      // 播放事件
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay');
      });
      // 监听背景音频停止事件
      backgroundAudioManager.onStop(() => {
        console.log('onStop');
      });
      // 监听背景音频暂停事件
      backgroundAudioManager.onPause(() => {
        console.log('onPause');
      });
      // 监听背景音频加载中事件
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      });
      // 监听背景音频进入可播放状态事件
      backgroundAudioManager.onCanplay(() => {
      });
      // 监听背景音频播放进度更新事件
      backgroundAudioManager.onTimeUpdate(() => {});
      // 监听背景音频自然播放结束事件
      backgroundAudioManager.onEnded(() => {
      });
      // 监听背景音频播放错误事件
      backgroundAudioManager.onError(() => {
      });
    },
  }
})
