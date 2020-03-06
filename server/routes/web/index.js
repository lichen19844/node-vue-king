module.exports = app => {
  const router = require('express').Router()
  const mongoose = require('mongoose')
  const Category = require('../../models/Category')
  const Article = require('../../models/Article')
  // const Category = mongoose.model('Category')
  // const Article = mongoose.model('Article')

  // 模拟往admin后台录入数据，每个子分类的数据量是有要求的，如果用random的方式可能无法定量
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    //query到的parent数据为query类型，是一个id值，但是console出来的内容为 { _id: 5e35946299b4032b5c426e6b, name: '新闻分类', __v: 0 }
    console.log('parent is ', parent)
		// 只找新闻分类下面的子分类
    const cats = await Category.find().where({parent: parent}).lean()
    console.log('cats is ', cats)
    // 该数据是通过浏览器console使用js方法document.querySelectAll()抓取的(简写为$$)
    const newsTitles = ["新星元部件爆料丨渐变马尾&amp;白金战服！伽罗换装出击~", "体验服爆料丨穿上新盔甲，守护玄雍城！白起优化曝光", "情人节限定皮肤爆料丨喜鹊筑桥，嫦娥后羿月下相逢", "觉醒之战即将再度开启！鬼谷子全屏大，露娜无限连", "新皮肤爆料丨AI意识觉醒，机器少女妲己绚丽登场！", "2月25日全服不停机更新公告", "【正式服】精准搜索好友功能暂时关闭调优公告", "云中君皮肤设计大赛说明", "2月22日体验服停机更新公告", "2月22日违规信息处罚公告", "伽罗星元上新 多重福利来袭", "峡谷来相聚 初春有好礼", "创意互动营-云中君皮肤设计大赛投票开启", "爱在峡谷携手度 甜蜜好礼轻松得", "元宵福利到 峡谷好热闹！", "《王者荣耀职业联赛（KPL）线上赛规则（暂行）》", "王者荣耀世界冠军杯总决赛落地首都北京", "2020年《王者荣耀》职业赛事（KPL与KPLGT）春季赛开赛调整公告", "中国电竞小伙逐梦记", "2019年赛事数据盘点，峡谷最强选手全知道！"]
    // map每一个title，都会执行一次randomCats，每次categories的结果都取决于random的随机性
    const newsList = newsTitles.map(title => {
      // 复制一份，根据判断随机数是否大于0还是小于0来决定排序方式，但实际random后排序不止2种
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      console.log('randomCats is ', randomCats)
      return {
        // 只取前面2个子分类，categories是通过map给每个元素新增的属性
        categories: randomCats.slice(0, 2),
        title: title
      }
    })
    await Article.deleteMany({})
    // 存入数据库的时候会为每个对象自动生成_id
    await Article.insertMany(newsList)
    res.send(newsList)
  })

  // 访问http://localhost:3000/web/api/news/list 按查询条件返回数据
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
    })
    const cats = await Category.aggregate([
      { $match: {parent: parent._id} },
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
    })
    // 将获取到的基础数据的每一个子级元素再次map一下
    cats.map(cat => {
      // 再次map newsList数组的每一个子级元素,并未每个元素新增categoryName属性并根据判断条件赋值
      cat.newsList.map(news => {
        // 为每个元素增加categoryName属性数据
        news.categoryName = (cat.name === '热门')
          ? news.categories[0].name :cat.name
      })
      return cat
    })
    res.send(cats)
    // res.send(parent)
  })

  app.use('/web/api', router)
}