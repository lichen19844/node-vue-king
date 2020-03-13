module.exports = app => {
  const router = require('express').Router();
  const mongoose = require('mongoose');
  const Category = require('../../models/Category');
  const Article = require('../../models/Article');
  const Hero = require('../../models/Hero');
  // const Category = mongoose.model('Category')
  // const Article = mongoose.model('Article')

  // 测试接口，模拟往admin后台录入初始新闻数据，每个子分类的数据量是有要求的，如果用random的方式可能无法定量
  // insertMany塞入的数据是按照schema结构手工拼接的数据
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    });
    //query到的parent数据为query类型，是一个id值，但是console出来的内容为 { _id: 5e35946299b4032b5c426e6b, name: '新闻分类', __v: 0 }，mongodb会智能匹配
    console.log('parent is ', parent);
    // 只找新闻分类下面的子分类
    const cats = await Category.find().where({ parent: parent }).lean();
    console.log('cats is ', cats);
    // 该数据是通过浏览器console使用js方法document.querySelectAll()抓取的(简写为$$)，复制而来
    const raw_data_newsTitles = ["新星元部件爆料丨渐变马尾&amp;白金战服！伽罗换装出击~", "体验服爆料丨穿上新盔甲，守护玄雍城！白起优化曝光", "情人节限定皮肤爆料丨喜鹊筑桥，嫦娥后羿月下相逢", "觉醒之战即将再度开启！鬼谷子全屏大，露娜无限连", "新皮肤爆料丨AI意识觉醒，机器少女妲己绚丽登场！", "2月25日全服不停机更新公告", "【正式服】精准搜索好友功能暂时关闭调优公告", "云中君皮肤设计大赛说明", "2月22日体验服停机更新公告", "2月22日违规信息处罚公告", "伽罗星元上新 多重福利来袭", "峡谷来相聚 初春有好礼", "创意互动营-云中君皮肤设计大赛投票开启", "爱在峡谷携手度 甜蜜好礼轻松得", "元宵福利到 峡谷好热闹！", "《王者荣耀职业联赛（KPL）线上赛规则（暂行）》", "王者荣耀世界冠军杯总决赛落地首都北京", "2020年《王者荣耀》职业赛事（KPL与KPLGT）春季赛开赛调整公告", "中国电竞小伙逐梦记", "2019年赛事数据盘点，峡谷最强选手全知道！"];
    // map每一个title，都会执行一次randomCats，每次categories的结果都取决于random的随机性
    const newsList = raw_data_newsTitles.map(title => {
      // 复制一份，根据判断随机数是否大于0还是小于0来决定排序方式，但实际random后排序不止2种
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      console.log('randomCats is ', randomCats);
      return {
        // 只取前面2个子分类，categories是通过map给每个元素新增的属性
        categories: randomCats.slice(0, 2),
        title: title
      };
    });
    await Article.deleteMany({});
    // 存入数据库的时候会为每个对象自动生成_id
    await Article.insertMany(newsList);
    // newsList和Article.find()的数据基本结构是一样的
    res.send(newsList);
    // res.send(await Article.find());
  })

  // 提供web新闻列表接口，访问http://localhost:3000/web/api/news/list 按查询条件返回数据
  router.get('/news/list', async (req, res) => {
    // const parent = await Category.findOne({
    //   name: '新闻分类'
    // }).populate({
    //   path: 'children',
    //   populate: {path: 'newsList'}
    //   // 这个写法可能是错误的 populate: {path: 'newsList', populate: {path: 'grandChildren'}}
    // })
    // .lean()

    // 使用聚合查询
    const parent = await Category.findOne({
      name: '新闻分类'
    });
    // 从分类入手查关联数据
    const cats = await Category.aggregate([
      { $match: { parent: parent._id } },
      {
        $lookup: {
          // from: collection name, the name is lowercase and plural
          from: 'articles',
          localField: '_id',
          foreignField: 'categories',
          as: 'newsList'
        }
      },
      {
        $addFields: {
          newsList: { $slice: ['$newsList', 5] }
        }
      }
    ]);
    // 抽取出id新组一个数组，对应4个子分类的id
    const subCats = cats.map(v => v._id);
    cats.unshift({
      // 热门不需要给id，不需要存数据库，它的数据来源是4个子分类
      name: '热门',
      newsList: await Article.find().where({
        categories: { $in: subCats }
      }).populate('categories').limit(5).lean()
    });
    // 将获取到的基础数据的每一个子级元素再次map一下
    cats.map(cat => {
      // 再次map newsList数组的每一个子级元素,并未每个元素新增categoryName属性并根据判断条件赋值
      cat.newsList.map(news => {
        // 为每个元素增加categoryName属性数据
        news.categoryName = (cat.name === '热门')
          ? news.categories[0].name : cat.name
      });
      return cat
    });
    res.send(cats);
    // res.send(parent)
  });

  // 测试接口，模拟往admin后台导入初始英雄数据，以后弃用
  // insertMany塞入的数据是按照schema结构手工拼接的数据
  router.get('/heros/init', async (req, res) => {
    await Hero.deleteMany({})
    // 等同于 await Hero.remove()
    const raw_data_heros = [
      {
        "name": "热门",
        "heros": [{ "name": "后羿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "孙悟空", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "铠", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "安琪拉", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "亚瑟", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "鲁班七号", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "妲己", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "甄姬", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "韩信", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "伽罗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }]
      },

      {
        "name": "战士",
        "heros": [{ "name": "赵云", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "墨子", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "钟无艳", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "吕布", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "曹操", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg" }, { "name": "典韦", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "宫本武藏", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg" }, { "name": "达摩", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "老夫子", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg" }, { "name": "关羽", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg" }, { "name": "程咬金", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "露娜", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "花木兰", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "橘右京", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "亚瑟", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "孙悟空", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "刘备", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg" }, { "name": "钟馗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "杨戬", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg" }, { "name": "雅典娜", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg" }, { "name": "哪吒", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg" }, { "name": "铠", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "裴擒虎", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "狂铁", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg" }, { "name": "孙策", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "李信", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg" }, { "name": "盘古", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg" }, { "name": "云中君", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "曜", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg" }, { "name": "马超", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }]
      },

      {
        "name": "法师",
        "heros": [{ "name": "小乔", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "墨子", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "妲己", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "嬴政", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg" }, { "name": "高渐离", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "孙膑", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "扁鹊", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "安琪拉", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "露娜", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "姜子牙", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "王昭君", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg" }, { "name": "张良", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg" }, { "name": "不知火舞", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "钟馗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "诸葛亮", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }, { "name": "干将莫邪", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg" }, { "name": "女娲", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg" }, { "name": "杨玉环", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "弈星", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg" }, { "name": "米莱狄", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg" }, { "name": "司马懿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "沈梦溪", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg" }, { "name": "上官婉儿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "嫦娥", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "西施", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg" }]
      },

      {
        "name": "坦克",
        "heros": [{ "name": "廉颇", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg" }, { "name": "庄周", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "钟无艳", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "白起", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg" }, { "name": "芈月", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "吕布", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "达摩", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "项羽", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg" }, { "name": "程咬金", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "刘邦", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg" }, { "name": "亚瑟", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "牛魔", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "太乙真人", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "东皇太一", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "铠", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "孙策", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "嫦娥", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "猪八戒", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg" }]
      },

      {
        "name": "刺客",
        "heros": [{ "name": "赵云", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "阿轲", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg" }, { "name": "李白", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg" }, { "name": "貂蝉", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "韩信", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "兰陵王", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg" }, { "name": "花木兰", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "不知火舞", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "娜可露露", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg" }, { "name": "橘右京", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "孙悟空", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "百里守约", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "百里玄策", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg" }, { "name": "裴擒虎", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "元歌", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg" }, { "name": "司马懿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "上官婉儿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "云中君", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "马超", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }]
      },

      {
        "name": "射手",
        "heros": [{ "name": "孙尚香", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "鲁班七号", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "马可波罗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "狄仁杰", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg" }, { "name": "后羿", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "李元芳", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg" }, { "name": "虞姬", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg" }, { "name": "成吉思汗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg" }, { "name": "黄忠", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg" }, { "name": "百里守约", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "公孙离", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg" }, { "name": "伽罗", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }, { "name": "蒙犽", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg" }]
      },

      {
        "name": "辅助",
        "heros": [{ "name": "庄周", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "孙膑", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "姜子牙", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "牛魔", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "蔡文姬", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg" }, { "name": "太乙真人", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "杨玉环", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "盾山", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }, { "name": "鲁班大师", "avator": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg" }]
      }
    ]
    // 等同于 const raw_data_heros = raw_data_heros.filter(item => item !=== '热门')
    const test = []
    // 每个元素cat对象含有name和heros两个键，cat.name, cat.heros
    for (let cat of raw_data_heros) {
      if (cat.name === '热门') {
        // 如果某次循环里的name是'热门'，则直接进入下一轮cat循环，不执行本次cat循环里的后续代码
        continue
        console.log('此条不会打印')
      }
      // 根据raw_data_heros各个name找到当前分类在数据库中对应的数据
      const category = await Category.findOne({
        name: cat.name
      }).populate('parent')
      console.log('category is ', category)
      // 为heros数组的每个元素hero对象添加一个categories键值，值类型选数组，该数组里放入刚查到的category对象数据
      cat.heros = cat.heros.map(hero => {
        hero.categories = [category]
        // hero.categories = [category._id]
        return hero
      })
      // 录入英雄
      // 目前报错：BulkWriteError: E11000 duplicate key error collection
      await Hero.insertMany(cat.heros)
      // test.push(category)
      test.push(cat.heros)
    }
    // 错误，只会录入for循环最后一组数据  res.send(raw_data_heros)
    // res.send(test)
    res.send(
      // Hero.find()和test的数据基本结构是一样的
      await Hero.find()
        .populate({path:'categories', populate:{path: 'parent'}})
    )
  });

  // 提供web英雄列表接口
  router.get('/heros/list', async (req, res) => {
    const parent = await Category.findOne({
      name: '英雄分类'
    });
    // 从分类入手查关联数据
    const cats = await Category.aggregate([
      { $match: { parent: parent._id } },
      {
        $lookup: {
          // from: collection name, the name is lowercase and plural
          from: 'heros',
          localField: '_id',
          foreignField: 'categories',
          as: 'heroList'
        }
      },
    ]);
    // 抽取出id新组一个数组，对应几个子分类的id
    const subCats = cats.map(v => v._id);
    const totalHeroList = await Hero.find().where({
      categories: { $in: subCats }
    }).populate('categories').lean()
    const filterHeroList = totalHeroList.slice(0).sort((a, b) => Math.random() - 0.5)
    // console.log('totalHeroList is ', Array.isArray(totalHeroList))
    // console.log('filterHeroList is ', Array.isArray(filterHeroList), filterHeroList)
    cats.unshift({
      // 热门不需要给id，不需要存数据库，它的数据来源是几个子分类
      name: '热门',
      heroList: filterHeroList.slice(0, 10)
    });
    res.send(cats);
  });

  // 文章详情
  router.get('/articles/:id', async (req, res, next) => {
    const data = await Article.findById(req.params.id).lean()
    data.related = await Article.find({title: {$ne: data.title}}).where({
      // 相同categories的数据
      categories: {$in: data.categories}
    }).limit(2)
    res.send(data)
  })

  app.use('/web/api', router);
}