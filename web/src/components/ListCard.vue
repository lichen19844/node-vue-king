<template>
  <m-card :icon="icon" :title="title">
    <div class="nav jc-between">
      <div class="nav-item" :class="{active: active === i}"
      v-for="(category, i) in categories" :key="i"
      @click="active = i">
        <div class="nav-link">{{category.name}}</div>
      </div>
    </div>
    <div class="pt-3">
      <swiper>
        <swiper-slide v-for="(category, i) in categories" :key="i">
          <!-- <div class="py-2" v-for="m in 5" :key="m">
            <span>[新闻]</span>
            <span>|</span>
            <span>这是一段新闻标题</span>
            <span>06/20</span>
          </div> -->
          <slot name="items" :category="category"></slot>
        </swiper-slide>
      </swiper>
    </div>
  </m-card>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    categories: {type: Array, required: true}
  },
  data () {
    return {
      active: 0
    }
  }
};
</script>

<style>
</style>