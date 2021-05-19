import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import Netprop from '../views/Netprop'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/custom',
    name: 'CustomNetprops',
    component: Netprop,
  },
  {
    path: '/:game',
    name: 'Netprops',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Netprop
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.afterEach((to) => {
  if(to.params.game)
    document.title = `${to.params.game.toUpperCase()} Netprops`
  else
    document.title = "Netprops"
})

export default router
