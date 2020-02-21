<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <img class="w-100" src="../assets/images/d3c936fc558feb3f4d08f31e463f6c58.jpeg" alt="">
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/dc04ab70c5c037d4455908042c60f9dc.jpeg" alt="">
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/e38db707a96d8458101c78ecf644e467.jpeg" alt="">
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-2"  slot="pagination"></div>
    </swiper>
    <!-- end of swiper -->
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.pagination-home',
          clickable: true,
        },
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/_variables';

  .pagination-home {
    .swiper-pagination-bullet {
      opacity: 1;
      border-radius: 0.1538rem;
      background: map-get($colors, 'white');
      &.swiper-pagination-bullet-active {
        background: map-get($colors, 'info');
      }
    }
  }
</style>