<template>
  <div class="post-publish">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 或者 to="/" -->
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容区域 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <vue-editor v-model="form.content"></vue-editor>
      </el-form-item>
      <el-form-item label="栏目">
        <!-- 多选框 -->
        <!-- el-main上的text-align: center 会被继承了 -->
        <el-checkbox-group v-model="form.categories">
          <!-- :label="item.id" 点击的时候需要将id传出去 label===>value值-->
          <el-checkbox :label="item.id" v-for="item in categoriesList" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="封面">
        <!-- 上传图片 -->
        <!--
          element-ui的upload会帮我们上传图片
          action: 必传参数,上传的地址
          on-success 文件上传成功时的钩子
          :file-list 用于回显的数据(图片)
          on-remove 文件列表移除时的钩子
         -->
        <el-upload
          :action="$axios.defaults.baseURL+'/upload'"
          list-type="picture-card"
          :on-success="handleSuccess"
          :headers="headers"
          :file-list="form.cover"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" :label="1">文章</el-radio>
        <el-radio v-model="form.type" :label="2">视频</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publish">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入富文本编辑器
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      // 布尔值为假的情况,[]是否为假
      form: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      // 存放栏目所有分类的数据
      categoriesList: [],
      // 用于图片的回显(有数据就可以回显)
      fileList: [],
      // upload组件会自动帮我们上传(需要的token)
      headers: {
        Authorization: localStorage.getItem('token')
      },
      // 存储修改文章的id值
      postId: ''
    }
  },
  created () {
    // 获取栏目列表
    this.getCategoryList()
    // console.log(this.$route)
    // 将id存给postId
    this.postId = this.$route.params.id
    // 假值短路(如果postId存在就请求获取数据)
    this.postId && this.getPostDetail(this.postId)
  },
  methods: {
    async getCategoryList () {
      // 设置栏目不需要token,不需要关注一栏
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 头条数据是默认的,不需要选择
        this.categoriesList = data.filter(item => item.id !== 999)
      }
      console.log(this.categoriesList)
    },
    // 用于获取回显的数据(文章详情数据)
    async getPostDetail (id) {
      const res = await this.$axios.get(`/post/${id}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 注意组件所绑定的数据格式和data的数据格式不对(那是后台的格式)
        // 修改categories数据的格式,期待[1,2,3],得到的是[{id: 1, name: 'zs'}]
        data.categories = data.categories.map(item => {
          return item.id
        })
        // 修改cover的数据格式(不要直接修改form的数据,el-form 双向绑定了form :model="form")
        data.cover.forEach(item => {
          item.url = this.$fixUrl(item.url)
        })
        // 调整老数据的content(使用replace替换大量的div,注意replace返回修改后的数据)
        data.content = data.content.replace(/<div/g, '<p')
        data.content = data.content.replace(/<\/div>/g, '</p>')
        this.form = data
      }
    },
    handleSuccess (res, file, fileList) {
      // 文件上传成功时触发(文件上传需要校验token)
      // 直接将token在headers中传递给upload组件
      const { statusCode, data } = res
      if (statusCode === 200) {
        // 上传成功将返回的数据存在form.cover中(不止有一张图片)(根据后台所需的数据格式进行调整)
        this.form.cover.push({
          id: data.id,
          url: this.$axios.defaults.baseURL + data.url
        })
        console.log(data)
      }
    },
    // 文件移除时触发的钩子函数
    handleRemove (file) {
      // 将form中cover数据过滤掉file这个文件
      this.form.cover = this.form.cover.filter(item => item.id !== file.id)
    },
    // 发布内容
    async publish () {
      // 如果内容不足return
      const { title, content, categories, cover } = this.form
      if (!title || !content || !categories.length || !cover.length) {
        this.$message.warning('内容不完整')
        return
      }
      // 发请求的时候categories的数据和后台所需要的格式不一样(需要进行修改)
      // 注意不可直接修改form数据
      // this.form.categories = this.form.categories.map(item => {
      //   return {
      //     id: item
      //   }
      // })
      // 这样做虽然数据对了,但是checkbox双向绑定的数据格式变了

      const data = {
        ...this.form,
        categories: this.form.categories.map(item => {
          return {
            id: item
          }
        })
      }
      // 根据postId判断是修改还是发布新文章(url是不一样的)
      let url = '/post'
      if (this.postId) {
        url = `/post_update/${this.postId}`
      }
      const res = await this.$axios.post(url, data, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 文章上传成功(跳转路由)
        this.$router.push('/post-list')
        this.$message.success(message)
      }
      console.log(res)
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped 加上之后,想要覆盖组件的样式,只能给代码页面存在的标签添加
// 如果想要给组件自己生成的标签添加样式,就需要使用深度选择器
// 深度选择器的写法有三种
// css  >>>
// less /deep/
// scss ::v-deep
.el-form {
  margin-top: 20px;
  text-align: left;
  .quillWrapper {
    background-color: #fff;
    ::v-deep #quill-container {
      height: 300px;
    }
  }
}
</style>
