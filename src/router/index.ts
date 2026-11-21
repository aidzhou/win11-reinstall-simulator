import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SimulatorView from '@/views/SimulatorView.vue'
import ResultView from '@/views/ResultView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/simulator', name: 'simulator', component: SimulatorView },
    { path: '/result', name: 'result', component: ResultView },
  ],
})
