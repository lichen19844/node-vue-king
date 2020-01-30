<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类" >
        <el-select placeholder="请选择" v-model="model.parent" style="width: 620px">
          <el-option
            v-for="item of parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
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
  props: {
    id: {}
  },
  data () {
    return {
      model: {},
      parents: []
    }
  },
  methods: {
    async save() {
      // console.log('1')
      // this.$http.post('categories', this.model).then()
      let res
      if (this.id) {
        console.log('this.id is ', this.id)
        res = await this.$http.put(`/categories/${this.id}`, this.model)
        res
      } else {
        // this.model被axios转化成req.body发出去了，后端的express会接收到并存入mongodb
        res = await this.$http.post('categories', this.model)
        res
      }

      // await this.$http.post('categories', this.model)
      this.$router.push('/categories/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch () {
      const res = await this.$http.get(`/categories/${this.id}`)
      console.log('res is ', res)
      this.model = res.data
    },
    async fetchParents () {
      const res = await this.$http.get(`/categories`)
      this.parents = res.data
      console.log('this.parents is ', this.parents)
    }
  },
  created () {
    this.fetchParents()
    // id是mongodb存数据时自动添加的
    this.id && this.fetch()
  }
}
</script>

<style>

</style>