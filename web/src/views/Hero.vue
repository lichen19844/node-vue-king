<template>
  <div class="page-hero" v-if="this.model">
    <div class="topbar bg-black py-2 px-3 d-flex ai-center text-white">
      <img src="../assets/logo.png" alt height="30" />
      <div class="px-3 flex-1">
        <span class="">王者荣耀</span>
        <span class="px-3">攻略站</span>
      </div>
      <router-link to="/" tag="div" class="d-flex ai-center">
        <span class="fs-sm">更多英雄</span>
        <strong class="fs-xxxl px-2">&gt;</strong>
      </router-link>
    </div>
    <h1>{{model.name}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true }
  },
  data () {
    return {
      model: null
    }
  },
  methods: {
    async fetchHero () {
      const res = await this.$http.get(`/heros/${this.id}`)
      this.model = res.data
    }
  },
  created () {
    this.fetchHero()
  }

};
</script>

<style>
</style>