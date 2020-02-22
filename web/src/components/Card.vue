<template>
  <div class="card p-3 bg-white mt-3">
    <div class="card-header d-flex ai-center">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <!-- <span class="iconfont">&#xe61f;</span> -->
      <div class="flex-1 px-2 fs-xl">{{title}}</div>
      <i class="iconfont icon-elipsis"></i>
    </div>
    <div class="long-border mt-3 mb-3"></div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
.card {
  border-bottom: 1px solid $border-color;
}
</style>