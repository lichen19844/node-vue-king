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

    <m-card icon="menu" title="新闻资讯">
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
    </m-card>
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
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
    <p>aaaa</p>
  </div>
</template>

<script>
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
      }
    };
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