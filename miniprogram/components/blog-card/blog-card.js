import formatTime from '../../utils/format-time';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    _creatTime: ''
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({ _creatTime: formatTime(new Date(val)) });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 预览图片
     */
    onPreviewImage(event) {
      const ds = event.currentTarget.dataset;
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc
      });
    }
  }
})
