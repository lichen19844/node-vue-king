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
        <div class="nav-item mb-3" v-for="item in 10" :key="item">
          <i class="sprite sprite-news"></i>
          <div class="py-2">爆料站</div>
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
      <template #items="{category}">
        <div class="py-2 fs-lg d-flex" v-for="(news, i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-1">|</span>
          <span class="flex-1 text-dark">{{news.title}}</span>
          <span>{{news.createdAt | date}}</span>
        </div>
      </template>
    </m-list-card>

    <m-card icon="menu" title="英雄列表"></m-card>
    <m-card icon="menu" title="精彩视频"></m-card>
    <m-card icon="menu" title="图文攻略"></m-card>

    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
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
      const res = await this.$http.get('news/list')
      this.newsCast = res.data
    }
  },
  created () {
    this.fetchNewsCast()
  },
  filters: {
    date(val) {
      return dayjs(val).format('MM/DD')
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

.long-border {
  display: block;
  width: 100%;
  height: 1px;
  background: map-get($colors, "light-1");
}
</style>