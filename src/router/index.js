import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Leaderboard from '../views/v-leaderboard.vue';
import Settings from '../views/v-settings';
import v404 from '../views/v-404';
import vProfile from '../views/v-profile'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
    {
      path: '/profile/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/u/:id',
      component: vProfile
    },
    {
      path: '*',
      name: '404',
      component: v404
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
