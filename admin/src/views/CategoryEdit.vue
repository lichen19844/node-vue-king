<template>
  <div class="about">
    <h1>新建分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称" >
        <el-input placeholder="请输入内容" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" round>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {}
    }
  },
  methods: {
    async save() {
      // console.log('1')
      // this.$http.post('categories', this.model).then()
      // const res = await this.$http.post('categories', this.model)
      await this.$http.post('categories', this.model)
      this.$router.push('/categories/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>

<style>

</style>