<template>
  <div class="post-list">
    <!-- 设置一个面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 或者 to="/" -->
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容: 表格 -->
    <el-table
      :data="postList"
      style="width: 100%;">
      <!-- 添加序号 -->
      <!-- 传入index自定义索引 -->
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethods"
        width="50">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="user.nickname"
        label="作者"
        width="150">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180"
      >
        <!-- 使用作用域插槽  不使用prop="create_date"了 -->
        <template v-slot="{row}">{{row.create_date | time}}</template>
      </el-table-column>
      <el-table-column
        label="封面"
        width="200">
        <template v-slot="{row}">
          <img class="img_cover" :src="$fixUrl(row.cover[0].url)" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template v-slot="{row}">
          <el-button @click="handlerEdit(row.id)">修改</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 设置分页: 在Home中设置了el-main的text-align: center为居中了 -->
    <!--
      参数:
      total: 数据的总条数
      page-size: 每页显示条目的个数(条目与数据同步)
      current-page: 当前的页数(分页器的当前页与数据同步)
      (会触发@current-change事件)
      background: 为分页的按钮添加背景色(为布尔属性)
      current-change: currentPage改变是触发的事件
      layout="total(显示总数), sizes(显示分页的条目), prev, pager, next, jumper(跳转第几页)"
      :page-sizes="[3, 5, 8, 15]" 每页显示个数选择器的选项设置
      (会触发 @size-change事件)
      pager-count 设置最大页码按钮数
     -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[3, 5, 8, 15]"
        :current-page="pageIndex"
        :pager-count='5'
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postList: [],
      // 默认每页显示的条目数(page-sizes在改变时进行调整, this.pageSize = value)
      pageSize: 3,
      pageIndex: 1,
      // 默认数据总数为0
      total: 0
    }
  },
  created () {
    this.getPostList()
  },
  methods: {
    // 用于获取文章列表
    async getPostList () {
      const res = await this.$axios.get('/post', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data, total } = res.data
      if (statusCode === 200) {
        this.postList = data
        this.total = total
        console.log(this.postList)
      }
    },
    // 改变currentPage时触发
    handleCurrentChange (value) {
      this.pageIndex = value
      this.getPostList()
    },
    handleSizeChange (value) {
      // pageSize 改变时会触发
      // 显示的页数改变时,定位到第一页
      this.pageIndex = 1
      this.pageSize = value
      this.getPostList()
      // 定位到第一页,页数是需要传递给组件的:current-page="pageIndex"
    },
    // 自定义索引
    indexMethods (index) {
      // console.log(index) 可以拿到当前页的索引
      return (this.pageIndex - 1) * this.pageSize + index + 1
    },
    // 用于修改文章
    handlerEdit (id) {
      // 跳转路由(通过作用域插槽拿到id值),将id值通过route传递给跳转的页面
      // 跳转post-publish
      // 注意通过路由传参,需要制定name
      this.$router.push({
        name: 'post-publish',
        params: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-list {
  .el-table {
    margin-top: 20px;
    // 设置表头居中的问题
    // .has-gutter {
    //   text-align: center;
    // }
    .img_cover {
      width: 180px;
      height: 80px;
      object-fit: cover;
    }
  }
  // 分页的样式
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
