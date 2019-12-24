// components/musiclist/musiclist.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playerId: -1
  },
  // 组件所在页面的生命周期
  pageLifetimes: {
    // 页面被展示时执行
    show() {
      this.setData({
        playerId: parseInt(app.getMusicId())
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击歌曲处理
     * @param {Event} event 
     */
    handleSelect(event) {
      // 将当前歌单所有歌曲信息储存在全局的 musicList 中
      app.setMusicList(this.properties.musiclist);

      const ds = event.currentTarget.dataset;
      this.setData({ playerId: ds.musicId });
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${ ds.musicId }&index=${ ds.index }`,
      });
    }
  }
})
