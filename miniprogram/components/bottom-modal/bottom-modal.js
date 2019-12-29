// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowPopup: Boolean
  },
  options: {
    styleIsolation: 'apply-shared', // 消除样式隔离
    multipleSlots: true // 打开多个插槽功能
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePopup() {
      this.setData({ isShowPopup: false });
    }
  }
})
