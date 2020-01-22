import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import CategoryEdit from '../views/CategoryEdit.vue'

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
      // {path: 'categories/list', component: }
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
