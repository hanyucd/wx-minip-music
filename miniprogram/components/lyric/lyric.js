// components/lyric/lyric.js
let lyricHeight = 0 // 当前歌词的高度

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
    lrcList: [], // 歌词信息
    nowLyricIndex: 0, // 当前高亮歌词的索引
    scrollTop: 0 // 歌词滚动条滚动的高度
  },
  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [{ lrc, timeSec: 0 }],
          nowLyricIndex: -1
        });
      } else {
        this._parseLyric(lrc);
      }
    }
  },

  lifetimes: {
    ready() {
      // 获取系统信息
      wx.getSystemInfo({
        success: function(res) {
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
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
      let lrcList = this.data.lrcList;
      // 判断歌词是否有内容
      if (lrcList.length == 0) return;

      if (currentTime > lrcList[lrcList.length - 1].timeSec) {
        // 如果不是最后一句歌词，就将歌词设置为最后一句
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          });
        }
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].timeSec) {
          // 如果当前歌词时间，与某一条歌词的时间匹配，就将其高亮
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight,
          })
          break;
        }
      }
    }
  }
});
