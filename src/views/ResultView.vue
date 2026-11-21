<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
const game = useGameStore()
const router = useRouter()
const correct = game.records.filter(record => record.correct).length
</script>

<template>
  <main class="page result">
    <div class="result-mark">✓</div>
    <div class="eyebrow">SIMULATION COMPLETED</div>
    <h1>模拟流程完成</h1>
    <p>你已走完 Windows 11 PE + U 盘重装流程的八个教学阶段。</p>
    <section class="panel stats">
      <div><strong>{{ game.completedStages.length }}/8</strong><small>完成阶段</small></div>
      <div><strong>{{ correct }}</strong><small>正确操作记录</small></div>
      <div><strong>{{ game.records.length }}</strong><small>总操作记录</small></div>
    </section>
    <section class="notice">
      <strong>真实操作前请再次确认</strong>
      <p>备份重要数据、确认目标磁盘与分区、使用可信安装介质，并以设备厂商及 Microsoft 官方说明为准。</p>
    </section>
    <button class="primary" @click="router.push('/')">返回首页</button>
    <button class="secondary" @click="game.reset(); router.push('/simulator')">重新模拟</button>
  </main>
</template>
