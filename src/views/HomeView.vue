<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
const router = useRouter()
const game = useGameStore()
function start(mode: 'guided' | 'practice') {
  game.setMode(mode)
  router.push('/simulator')
}
function resume() {
  game.restore()
  router.push('/simulator')
}
</script>

<template>
  <main class="page home">
    <div class="hero">
      <div class="eyebrow">INTERACTIVE LEARNING SIMULATOR</div>
      <h1>Windows 11<br />重装系统模拟器</h1>
      <p>先在手机上完整模拟一次，再按照攻略在真实电脑上操作。</p>
      <div class="tag-row"><span>PE + U 盘启动</span><span>双模式学习</span><span>本地存档</span></div>
    </div>
    <section class="panel">
      <h2>选择学习模式</h2>
      <button class="primary" @click="start('guided')">攻略引导模式 <small>每一步都有操作说明</small></button>
      <button class="secondary" @click="start('practice')">独立实操模式 <small>自行判断，完成后查看反馈</small></button>
      <button class="text-button" @click="resume">继续上次进度</button>
    </section>
    <section class="notice">
      <strong>安全说明</strong>
      <p>本项目仅模拟操作，不会访问真实磁盘、制作启动盘或执行系统安装。真实操作前请备份数据。</p>
    </section>
  </main>
</template>
