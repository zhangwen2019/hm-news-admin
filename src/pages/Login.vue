<template>
  <div class="hm-login">
    <el-form ref="form" :model="form" label-width="60px" autocomplete="off">
      <h2 class="title">hm-news后台管理系统</h2>
      <el-form-item label="账号">
        <el-input v-model="form.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      // 如果未输入,则return
      if (!this.form.username && !this.form.password) {
        this.$message.error('用户名或密码不能为空')
      }
      const res = await this.$axios.post('/login', this.form)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 登录成功(存储token)
        // console.log(data)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // 跳转页面
        this.$router.push('/')
      } else {
        this.$message.error('用户名或密码不能为空')
      }
    },
    reset () {
      this.form.username = ''
      this.form.password = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-login {
  .title {
    margin: 10px 0 20px;
    text-align: center;
  }
  .el-form {
    width: 400px;
    margin: 150px auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 20px 0 0;
    box-shadow: 1px 1px #ddd;
    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
