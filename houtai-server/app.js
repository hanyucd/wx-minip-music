const Koa = require('koa');
const chalk = require('chalk'); // 改变console.log打印颜色的插件
const cors = require('koa2-cors'); // 解决跨域问题
const Router = require('koa-router'); // 用于写后端提供给前端的接口
const koaBody = require('koa-body'); // 对post请求前端传来的数据的获取，需要此依赖

const playlist = require('./controller/playlist');
const swiper = require('./controller/swiper');
const blog = require('./controller/blog');

const ENV = 'cloud-develop-143u6'; // 云开发环境ID (下面会赋值给全局属性)
const app = new Koa();
const router = new Router();

// 处理跨域
app.use(cors({
  origin: ['http://localhost:8080'], // 允许访问本服务的域
  credentials: true
}));

// 接收 post 参数解析
app.use(koaBody({
  multipart: true
}));

// 全局中间件
app.use(async (ctx, next) => {
  // ctx 上下文，所以中间件都可访问其属性
  ctx.state.env = ENV; // 赋值给全局属性，其他中间件可通过ctx.state.env使用
  await next();
});

router.use('/playlist', playlist.routes());
router.use('/swiper', swiper.routes());
router.use('/blog', blog.routes());
app.use(router.routes()); // 使用路由
app.use(router.allowedMethods()); // 允许使用方法

const port = 3000;
app.listen(port, () => {
  console.log(chalk.green(`> 服务已开启，访问：http://localhost:${ port }`));
});