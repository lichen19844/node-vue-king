<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名" >
        <!-- input随写随存入model -->
        <el-input placeholder="请输入内容" v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" >
        <!-- input随写随存入model -->
        <el-input type="password" placeholder="请输入密码" v-model="model.password"></el-input>
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
    }
  },
  methods: {
    async save() {
      // this.$http.post('admin_users', this.model).then()
      let res
      if (this.id) {
        console.log('this.id and $route.params.id ', this.id, this.$route.params.id)
        res = await this.$http.put(`rest/admin_users/${this.id}`, this.model)
        res
      } else {
        // this.model被axios转化成req.body发出去了，后端的express会接收到并存入mongodb
        res = await this.$http.post('rest/admin_users', this.model)
        res
      }
      this.$router.push('/admin_users/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    // 进入编辑页面时能够让输入框内显示之前的值
    async fetch () {
      // 数据库对应方法没有使用populate方法时，所以只能拿到模型第一层的字段_id，name和字段值为id的parent，而不是完整的parent对象
      const res = await this.$http.get(`rest/admin_users/${this.id}`)
      console.log('res is ', res)
      this.model = res.data
      console.log('this.model is ', this.model)
    }
  },
  created () {
    // id是mongodb存数据时自动添加的
    this.id && this.fetch()
  }
}
</script>

<style>

</style>