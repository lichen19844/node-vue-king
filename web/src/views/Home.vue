<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <img class="w-100" src="../assets/images/d3c936fc558feb3f4d08f31e463f6c58.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/dc04ab70c5c037d4455908042c60f9dc.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/e38db707a96d8458101c78ecf644e467.jpeg" alt />
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-2" slot="pagination"></div>
    </swiper>
    <!-- end of swiper -->

    <div class="nav-icons bg-white mt-3 text-center pt-3 text-gray-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="(item, index) of navIcons" :key="index">
          <i :class="`sprite ${item.icon}`"></i>
          <div class="py-2">{{item.navName}}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm d-flex jc-center">
        <i class="sprite sprite-arrow mr-1"></i>
        <span>收起</span>
      </div>
    </div>
    <!-- end of nav icons -->

    <!-- m-card先不要了 -->
    <!-- <m-card icon="menu" title="新闻资讯">
      <div class="nav jc-between">
        <div class="nav-item active">
          <div class="nav-link">热门</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">公告</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">活动</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">赛事</div>
        </div>
      </div>
      <div class="pt-3">
        <swiper>
          <swiper-slide v-for="m in 5" :key="m">
            <div class="py-2" v-for="item in 5" :key="item">
              <span>[新闻]</span>
              <span>|</span>
              <span>这是一段新闻标题</span>
              <span>06/20</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>-->

    <!-- 想要的结构 -->
    <m-list-card icon="menu" title="新闻资讯" :categories="newsCast">
      <!-- 需要操控的数据 -->
      <template #items="{category}">
        <router-link tag="div"  :to="`/articles/${news._id}`" 
          class="py-2 fs-lg d-flex" v-for="(news, i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-1">|</span>
          <span class="flex-1 text-ellipsis text-dark-1 pr-2">{{news.title}}</span>
          <span class="fs-sm text-gray-1">{{news.createdAt | date}}</span>
        </router-link>
      </template>
    </m-list-card>

    <m-list-card icon="card-hero" title="英雄列表" :categories="heroCast">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem">
          <router-link tag="div" :to="`/heros/${hero._id}`" class="p-2 text-center"
             style="width: 20%"
            v-for="(hero, i) in category.heroList" :key="i">
            <img :src="hero.avator" class="w-100" />
            <div>{{hero.name}}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>

    <m-list-card icon="video" title="精彩视频" :categories="newsCast">
      <!-- 需要操控的数据 -->
      <template #items="{category}">
        <router-link tag="div"  :to="`/articles/${news._id}`" 
          class="py-2 fs-lg d-flex" v-for="(news, i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-1">|</span>
          <span class="flex-1 text-ellipsis text-dark-1 pr-2">{{news.title}}</span>
          <span class="fs-sm text-gray-1">{{news.createdAt | date}}</span>
        </router-link>
      </template>
    </m-list-card>

    <m-list-card icon="book" title="图文攻略" :categories="newsCast">
      <!-- 需要操控的数据 -->
      <template #items="{category}">
        <router-link tag="div"  :to="`/articles/${news._id}`" 
          class="py-2 fs-lg d-flex" v-for="(news, i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-1">|</span>
          <span class="flex-1 text-ellipsis text-dark-1 pr-2">{{news.title}}</span>
          <span class="fs-sm text-gray-1">{{news.createdAt | date}}</span>
        </router-link>
      </template>
    </m-list-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      navIcons: [
        {icon: 'sprite-news', navName: '爆料站'},
        {icon: 'sprite-story', navName: '故事站'},
        {icon: 'sprite-mall', navName: '周边商城'},
        {icon: 'sprite-experience', navName: '体验服'},
        {icon: 'sprite-rookie', navName: '新人专区'},
        {icon: 'sprite-honor', navName: '荣耀传承'},
        {icon: 'sprite-sandbox', navName: '模拟战资料库'},
        {icon: 'sprite-campsite', navName: '王者营地'},
        {icon: 'sprite-officalAccounts', navName: '公众号'},
        {icon: 'sprite-version', navName: '版本介绍'},
        {icon: 'sprite-environment', navName: '对局环境'},
        {icon: 'sprite-team', navName: '无限王者团'},
        {icon: 'sprite-idea', navName: '创意互动营'}
      ],
      swiperOption: {
        pagination: {
          el: ".pagination-home",
          clickable: true
        },
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        }
      },
      newsCast: [],
      heroCast: []
      // 废除预存假数据
      // newsCast: [
      //   {
      //     name: "热门",
      //     /* eslint-disable */
      //     // eslint-disable-next-line

      //     // newsList: new Array(5).fill({}).map(v => {
      //     //   return {
      //     //     categoryName: "公告",
      //     //     title: "1疫情期间全服不停机公告",
      //     //     date: "06/01"
      //     //   }
      //     // })
      //     // 等同于以下写法
      //     newsList: new Array(5).fill({}).map(v => ({
      //       categoryName: "公告",
      //       title: "1疫情期间全服不停机公告",
      //       date: "06/01"
      //     }))

      //     // newsList: [
      //     //   {
      //     //     categoryName: '公告1',
      //     //     title: '1疫情期间全服不停机公告',
      //     //     date: '06/01'
      //     //   },
      //     //   {
      //     //     categoryName: '公告2',
      //     //     title: '2疫情期间全服不停机公告',
      //     //     date: '06/01'
      //     //   },
      //     //   {
      //     //     categoryName: '公告3',
      //     //     title: '3疫情期间全服不停机公告',
      //     //     date: '06/01'
      //     //   },
      //     //   {
      //     //     categoryName: '公告4',
      //     //     title: '4疫情期间全服不停机公告',
      //     //     date: '06/01'
      //     //   },
      //     //   {
      //     //     categoryName: '公告5',
      //     //     title: '5疫情期间全服不停机公告',
      //     //     date: '06/01'
      //     //   }
      //     // ]
      //   },
      //   {
      //     name: "新闻",
      //     newsList: new Array(5).fill({}).map(() => ({
      //       categoryName: "新闻",
      //       title: "2疫情期间全服不停机公告",
      //       date: "06/02"
      //     }))
      //   },
      //   {
      //     name: "公告",
      //     newsList: new Array(5).fill({}).map(() => ({
      //       categoryName: "公告",
      //       title: "3疫情期间全服不停机公告",
      //       date: "06/02"
      //     }))
      //   },
      //   {
      //     name: "活动",
      //     newsList: new Array(5).fill({}).map(() => ({
      //       categoryName: "活动",
      //       title: "4疫情期间全服不停机公告",
      //       date: "06/02"
      //     }))
      //   },
      //   {
      //     name: "赛事",
      //     newsList: new Array(5).fill({}).map(() => ({
      //       categoryName: "赛事",
      //       title: "5疫情期间全服不停机公告",
      //       date: "06/02"
      //     }))
      //   }
      // ]
    };
  },
  methods: {
    async fetchNewsCast() {
      const res = await this.$http.get("news/list");
      // res.data接收server端传过来的res.send数据
      this.newsCast = res.data;
    },
    async fetchHeroCast() {
      const res = await this.$http.get("heros/list");
      this.heroCast = res.data;
    }
  },
  created() {
    this.fetchNewsCast();
    this.fetchHeroCast();
  },
  filters: {
    date(val) {
      return dayjs(val).format("MM/DD");
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables";

.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: map-get($colors, "white");
    &.swiper-pagination-bullet-active {
      background: map-get($colors, "info");
    }
  }
}

.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    & :nth-child(4n) {
      border-right: none;
    }
  }
}
</style>