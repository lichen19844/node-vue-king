<template>
  <div>
    <div class="page-article" v-if="model">
      <div class="d-flex py-3 px-2 border-bottom">
        <div class="iconfont icon-back text-blue"></div>
        <strong class="flex-1 text-blue pl-2">{{model.title}}</strong>
        <div class="text-gray fs-xs">2020-3-13</div>
      </div>
      <div v-if="model" class="px-3 article-body fs-lg" v-html="model.body"></div>
      <div class="px-3 border-top py-2">
        <!--  -->
        <div class="d-flex ai-center">
          <div class="iconfont icon-link"></div>
          <div class="text-blue fs-lg ml-1">相关资讯</div>
        </div>
        <div class="pt-3">
          <router-link
            class="py-1"
            :to="`/articles/${item._id}`"
            tag="div"
            v-for="item of model.related"
            :key="item._id"
          >{{item.title}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      model: null
    };
  },
  // 监听id的变化，然后触发方法
  watch: {
    id: 'fetchArticle',
    // 等同于
    // id () {
    //   this.fetchArticle()
    // }
  },
  methods: {
    async fetchArticle() {
      const res = await this.$http.get(`articles/${this.id}`);
      // console.log(res)
      this.model = res.data;
    }
  },
  created() {
    this.fetchArticle();
  }
};
</script>

<style lang="scss">
.page-article {
  .icon-back {
    font-size: 1.2308rem;
  }
  .article-body {
    img {
      max-width: 100%;
      height: auto;
    }
    iframe {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>