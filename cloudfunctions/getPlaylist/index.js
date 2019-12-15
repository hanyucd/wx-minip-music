// 云函数入口文件
const cloud = require('wx-server-sdk');
const rp = require('request-promise'); // 需安装依赖包 npm i -S request & npm i -S request-promise

cloud.init();
const URL = 'http://musicapi.xiecheng.live/personalized'; // 第三方服务器地址
const db = cloud.database(); // 初始化数据库
const playlistCollection = db.collection('playlist'); // 获取数据库 playlist 集合
const MAX_LIMIT = 100; // 定义常量 -- 获取数据库条数最大的限制

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get() // 获取数据库集合的数据（因为有条数限制，不直接用此方法）

  // 突破小程序获取云数据 100 条限制的思路：
  const countResult = await playlistCollection.count(); // 获取数据总条数 返回为对象
  const total = countResult.total; // 从对象中取总的数据条数
  const batchTimes = Math.ceil(total / MAX_LIMIT); // 计算查询数据库的次数
  const tasks = [];
  let list = { data: [] }; // 存数据库中集合 playlist 的总数据

  for (let i = 0; i < batchTimes; i++) {
    // 用 skip(): 从哪里开始取, limit(): 取的条数
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  if (tasks.length) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return { data: [...acc.data, ...cur.data] };
    });
  }
  
  // 获取第三方服务器端数据
  const playlist = await rp(URL).then(res => JSON.parse(res).result); // 将 string 字符串型的数据转换成对象数据

  // 数据库与服务器数据对比去重（数据已存在数据库的无需再重复添加）
  const newData = [];
  for (let i = 0, len_1 = playlist.length; i < len_1; i++) {
    let flag = true;
    for (let j = 0, len_2 = list.data.length; j < len_2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    (flag) && newData.push(playlist[i]);
  }

  // 把数据插入数据库，需要单条插入
  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate() // 获取服务器时间
      }
    }).then(res => {
      console.log('插入数据成功');
    }).catch(error => {
      console.log('插入数据失败');
    }); 
  }

  return newData.length;
};