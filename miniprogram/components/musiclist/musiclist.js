// components/musiclist/musiclist.js
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

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击歌曲处理
     * @param {Event} event 
     */
    handleSelect(event) {
      const ds = event.currentTarget.dataset;
      this.setData({ playerId: ds.musicId });
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${ ds.musicId }&index=${ ds.index }`,
      })
    }
  }
})
