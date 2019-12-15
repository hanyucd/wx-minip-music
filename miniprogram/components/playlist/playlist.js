// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playCount: 10
  },

  observers: {
    // 对 playlist 对象底下 playCount 的监听
    'playlist.playCount'(playCount) {
      this.setData({
        playCount: this._transformNum(playCount)
      });
    } 
  },

  lifetimes: {
    attached() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusicList() {
      // 跳转链接 并传入参数，在目标页面中的 onLoad 方法的 options 参数接收传入的参数
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${ this.properties.playlist.id }`
      });
    },
    /**
     * 格式化歌单播放量数字
     * @param {Number} num 需要格式化的数字
     * @param {Number} point 需保留小数点后几位
     */
    _transformNum(num, point = 2) {
      // 先将 number 类型数据转换为 string 类型, 以 . 分割取到小数点前面的数字
      let numStr = num.toString().split('.')[0];
      let numStrLen = numStr.length;

      if (numStrLen < 6) {
        return numStr;
      } else if (numStrLen >= 6 && numStrLen <= 8) { // 10 万以上，1 亿以下
        let pointNum = numStr.substring(numStrLen - 4, numStrLen - 4 + point); // 截取字符串，用作小数点后面的数，千位和百位数
        return parseInt(num / 10000) + '.' + pointNum + '万';
      } else if (numStrLen > 8) { // 1亿以上
        let pointNum = numStr.substring(numStrLen - 8, numStrLen - 8 + point); // 截取亿位后 2 位数
        return parseInt(num / 100000000) + '.' + pointNum + '亿';
      }
    }
  }
});
