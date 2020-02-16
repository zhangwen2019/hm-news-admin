import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import Home from '../pages/Home'
import PostList from '../pages/PostList'
import PostPublish from '../pages/PostPublish'

Vue.use(VueRouter)

// 创建路由实例
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home',
      // 别忘记设置子路由出口
      children: [
        { path: 'post-list', component: PostList, name: 'post-list' },
        { path: 'post-publish', component: PostPublish, name: 'post-publish' }
      ],
      // 由于首页暂时没有数据(先跳转到文章列表页面)
      redirect: '/post-list'
    },
    { path: '/login', component: Login, name: 'login' }
  ]
})

// 处理路由重复跳转的问题(方案一)
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

// 设置路由导航守卫(除了login页面其他的页面都要登录才能进入)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    // 方案二(为每个router.push增加回调函数)
    router.push('/login').catch(err => err)
  }
})

// 导出路由
export default router
