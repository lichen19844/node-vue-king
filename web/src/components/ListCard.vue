<template>
  <div>
    <m-card :icon="icon" :title="title">
      <!-- 资源细分的分类 -->
      <div class="nav jc-between">
        <div
          class="nav-item"
          :class="{active: active === i}"
          v-for="(category, i) in categories"
          :key="i"
          @click="$refs.list.swiper.slideTo(i)"
        >
          <div class="nav-link">{{category.name}}</div>
        </div>
      </div>
      <!-- 左右滑动区域 -->
      <div class="pt-3">
        <swiper ref="list" :options="{autoHeight: true}"
          @slide-change="() => active = this.$refs.list.swiper.realIndex">
          <swiper-slide v-for="(category, i) in categories" :key="i">
            <!-- <div class="py-2" v-for="m in 5" :key="m">
            <span>[新闻]</span>
            <span>|</span>
            <span>这是一段新闻标题</span>
            <span>06/20</span>
            </div>-->
            <!-- 具名插槽和作用域插槽结合 -->
            <slot name="items" :category="category"></slot>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    categories: { type: Array, required: true }
  },
  data() {
    return {
      active: 0
    };
  }
};
</script>

<style>
</style>