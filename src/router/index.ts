import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'), 
  },
  {
    path: '/',
    redirect:'index',
    component:Layout,
    children:[
      {
        path:'index',
        name:'首页',
        component:()=>import('@/pages/index/index.vue'),
      },
      {
        path:'blog',
        name:'博客首页',
        component:()=>import('@/pages/blog/index.vue')
      }
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test/index.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    children:[
      {
        path:'detail/:id',
        name:'博客详情',
        component:()=>import('@/pages/blog/detail.vue'),
      },
      {
        path:'edit/:id',
        name:'编辑博客',
        component:()=>import('@/pages/blog/edit.vue'),
      },
    ],
  },
  {
    path: '/3d',
    name: '3d',
    component:Layout,
    children:[
      {
        path:'phoenix',
        name:'凤凰',
        component:()=>import('@/pages/3d/phoenix.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
