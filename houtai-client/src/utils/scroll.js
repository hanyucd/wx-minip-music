// 滚动条到底部执行回调方法
const scroll = {
  isEnd: false,
  start(callback) {
    let timer = null
    callback && window.addEventListener('scroll', () => { // callback为true才执行 && 后面的事件
      if (timer) {
        clearTimeout(timer)
      }
      // 函数防抖
      timer = setTimeout(() => {
        // 浏览器向上滚动的高度
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 文档的真实高度
        const scrollHeight = document.documentElement.scrollHeight
        // 浏览器窗口（文档）的可视高度,就是肉眼可见的那部分全屏高度
        const clientHeight = document.documentElement.clientHeight
        if (!this.isEnd && (scrollTop + clientHeight + 50) >= scrollHeight) { // 距离底部50px
          window.scrollTo(0, scrollTop - 100)
          // 执行回调
          callback()
        }
      }, 800)
    })
  },
  end() {
    this.isEnd = true
  }
}

export default scroll
