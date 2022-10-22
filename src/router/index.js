import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/homeView/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/loginView/loginView.vue')

  },
  {
    path: '/songsheet',
    name: 'songsheet',
    component: () => import('../views/songSheetView/SongSheetView.vue'),

  },
  {

    path: '/songsheet/onesongsheet',
    name: 'onesongsheet',
    component: () => import('../views/songSheetView/oneSongSheet/OneSongSheet.vue')
  },
  {
    path: '/songsheet/editsongsheet',
    name: 'editsongsheet',
    component: () => import('../views/songSheetView/editSongSheet/EditSongSheet.vue')

  },
  {
    path: '/searching',
    name: 'searching',
    component: () => import('../views/searchView/searching/Searching.vue')
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: () => import('../views/searchView/searchResult/SearchResult.vue')
  },
  {
    path: '/playInterface',
    name: 'playInterface',
    component: () => import('../components/audioPlay/playInterface/PlayInterface.vue')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../views/myView/MyView.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chatView/ChatView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  if (to.path == '/login' || to.path == '/register') {
    // 登录或者注册才可以往下进行
    next();
  } else {
    // 获取 token
    const token = localStorage.getItem('Authorization');
    // token 不存在
    if (token === null || token === '') {
      // ElMessage.error('您还没有登录，请先登录');
      next('/login');
    } else {
      next();
    }
  }
});

export default router
