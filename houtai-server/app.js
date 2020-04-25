const Koa = require('koa');
const app = new Koa;

app.use(async ctx => {
  ctx.body = 'response';
});

const port = 3000;
app.listen(port, () => {
  console.log(`> 服务已开启，访问：http://localhost:${ port }`);
});