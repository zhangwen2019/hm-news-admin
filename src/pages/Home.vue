<template>
  <div class="hm-home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <h2 class="title">黑马头条</h2>
        <!-- 导航栏 -->
        <!--
          参数:
          router: 如果为true，点击导航的时候就会跳转 会把菜单的index属性作为地址进行跳转
          default-active 默认高亮的导航菜单(设置一个动态的,跟随$route的变化而变化)
         -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-active="$route.path"
        >
          <el-menu-item index="/post-list">
            <i class="el-icon-menu"></i>
            <span slot="title">文章列表</span>
          </el-menu-item>
          <el-menu-item index="/post-publish">
            <i class="el-icon-setting"></i>
            <span slot="title">文章编辑</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <img :src="$axios.defaults.baseURL + user.head_img" alt="">
          <div class="nickname">{{user.nickname}}</div>
          <div class="logout" @click="logout">退出</div>
        </el-header>
        <!-- 主体部分 -->
        <el-main>
          <!-- 子路由的出口 -->
          <!-- <keep-alive> -->
          <router-view></router-view>
          <!-- </keep-alive> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('确定要退出本系统吗?', '温馨提示', { type: 'warning' })
        // 点击了确定(删除localStorage中的数据)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$message.success('退出成功')
        // 跳转login页面
        this.$router.push('/login')
      } catch {
        // 点击了取消按钮
        this.$message.success('取消操作')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-home {
  position: absolute;
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .nickname {
      margin: 0 10px;
    }
    .logout {
      cursor: pointer;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    .title {
      margin: 0;
      height: 60px;
      line-height: 60px;
      background-color: #333;
      color: #fff;
      font-weight: 700;
    }
  }
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}
</style>
