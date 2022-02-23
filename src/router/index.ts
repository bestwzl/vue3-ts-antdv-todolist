import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    redirect: '/all'
  },
  {
    path: '/all',
    name: 'All',
    component: () => import('../views/todoList.vue')
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/todoList.vue')
  },
  {
    path: '/done',
    name: 'Done',
    component: () => import('../views/todoList.vue')
  },
  {
    path: '/:pathMatch(.*)', 
    redirect: '/all'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
