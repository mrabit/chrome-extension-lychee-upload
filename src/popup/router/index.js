import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { getDomain, init } from '../../services/api'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!from.name && to.name === 'Home') {
    if (!getDomain()) return next()
    let initResult = await init()
    if (initResult.status === 2) {
      return next({
        name: 'About'
      })
    }
  }
  next()
})

export default router
