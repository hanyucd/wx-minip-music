// components/lyric/lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: { type: Boolean, value: false },
    lyric: { type: String }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [] // 歌词信息
  },
  observers: {
    lyric(lrc) {
      this._parseLyric(lrc);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 解析歌词函数
     * @param {String} sLyric 歌词字符串
     */
    _parseLyric(sLyric) {
      let line = sLyric.split('\n');
      let  _lrcList = [];
      line.forEach(elem => {
        // 使用正则表达式，匹配字符串
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]; // 取到每行歌词
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/);
          // 把时间转化成秒
          let timeSec = parseInt(timeReg[1] * 60) + parseInt(timeReg[2]) + Number(timeReg[3] / 1000);
          // 得到一个 有秒单位对应相应行歌词 的数组
          _lrcList.push({
            lrc,
            timeSec
          });
        }
      });
      this.setData({ lrcList: _lrcList });
    },
    /**
     * 父组件传递来的事件和参数，歌曲正在播放时不断触发，进行歌词高亮
     */
    updata(currentTime) {
      console.log(currentTime);
    }
  }
});
