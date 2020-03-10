<template>
  <div class="login-container">
    <el-card header="欢迎注册" class="register-card">
      <el-form @submit.native.prevent="register">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display: flex; flex-flow: row nowrap;justify-content: space-between">
            <el-button type="primary" native-type="submit" :disabled="!isValid">注册</el-button>
            <router-link to="/login">已有账户？去登录 ></router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      model: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async register() {
      console.log("this model is ", this.model);
      console.log("$route in login page is ", this.$route);
      // 返回的res.data是个token
      const res = await this.$http.post("register", this.model);
      console.log("res is ", res);
      this.$message({
        type: "success",
        message: "注册成功，等待跳转登录：）"
      });
      setTimeout(() => {
        sessionStorage.username = this.model.username
        localStorage.token = res.data.token;
        this.$router.push("/");
        this.$message({
          type: "success",
          message: "登录成功"
        });
      }, 2500);
    },
    async initLogin() {
      localStorage.clear();
    }
  },
  computed: {
    isValid() {
      return (
        String(this.model.username).length >= 1 &&
        String(this.model.password).length >= 1
      );
    }
  },
  created() {
    this.initLogin();
  }
};
</script>

<style>
.register-card {
  width: 30rem;
  margin: 5rem auto;
}
</style>