// components/search/search.js
let keyword = '';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  /**
   * 关闭组件样式隔离
   */
  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value;
    },
    onSearch() {
      // 把搜索事件抛给父组件，提高组件的可重用性
      this.triggerEvent('search', { keyword });
    }
  }
})
