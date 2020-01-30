import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import CategoryEdit from '../views/CategoryEdit.vue'
import CategoryList from '../views/CategoryList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'home',
    name: 'main',
    // component: Home
    component: Main,
    children: [
      {path: '/categories/create', component: CategoryEdit},
      // 能够将id传入组件页面中，组件通过props接受
      {path: '/categories/edit/:id', component: CategoryEdit, props: true},
      {path: 'categories/list', component: CategoryList}
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import (
      /* webpackChunkName: "about" */ 
      '../views/About.vue'
    )
  }
]

const router = new VueRouter({
  routes
})

export default router
