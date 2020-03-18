<template>
  <div class="card p-3 bg-white mt-3">
    <div class="card-header d-flex ai-center"
      :class="{'border-bottom': !plain, 'pb-3': !plain}">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <!-- <span class="iconfont">&#xe61f;</span> -->
      <div class="flex-1 px-2 fs-xl"><strong>{{title}}</strong></div>
      <i class="iconfont icon-elipsis" v-if="!plain"></i>
    </div>
    <!-- <div class="long-border mt-3 mb-3"></div> -->
    <div class="card-body pt-3">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    // Boolean默认false
    plain: { type: Boolean }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
.card {
  // .card-header {
  //   border-bottom: 1px solid $border-color;
  // }
  border-bottom: 1px solid $border-color;
}

// .long-border {
//   display: block;
//   width: 100%;
//   height: 1px;
//   background: map-get($colors, "light-1");
// }
</style>