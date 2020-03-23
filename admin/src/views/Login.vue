<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display: flex; flex-flow: row nowrap;justify-content: space-between">
            <el-button type="primary" native-type="submit" :disabled="!isValid">登录</el-button>
            <router-link to="/register">还没有账户？去注册 ></router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      console.log('this model is ', this.model)
      console.log('$route in login page is ', this.$route)
      // 传递登录数据，请求接口，返回的res.data是个token
      const res = await this.$http.post('login', this.model)
      console.log('res is ', res)
      console.log('token is ', res.data.token)
      // sessionStorage.token = res.data.token
      // sessionStorage.username = this.model.username
      localStorage.username = this.model.username
      localStorage.token = res.data.token
      this.$router.push('/')
      this.$message({
        type: 'success',
        message: '登录成功'
      })
    },
    async initLogin () {
      localStorage.clear()
    }
  },
  computed: {
    isValid () {
      return String(this.model.username).length >= 1 && String(this.model.password).length >= 1
    }
  },
  created () {
    this.initLogin()
  }
}
</script>

<style>
  .login-card {
    width: 30rem;
    margin: 5rem auto;
  }
</style>