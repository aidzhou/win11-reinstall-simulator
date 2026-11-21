<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stages } from '@/data/stages'
import { useGameStore } from '@/stores/game'
const game = useGameStore()
const router = useRouter()
const selected = ref('')
const feedback = ref('')
const current = computed(() => game.current)
const doneIds = ref<string[]>([])
function choose(actionId: string, correct: boolean, message: string) {
  selected.value = actionId
  feedback.value = message
  game.recordAction(actionId, correct)
  if (correct && !doneIds.value.includes(actionId)) doneIds.value.push(actionId)
}
function next() {
  const allDone = current.value.actions.every((action) => doneIds.value.includes(action.id))
  if (!allDone) {
    feedback.value = '请先完成本阶段的模拟操作。'
    return
  }
  game.completeCurrentStage()
  selected.value = ''
  feedback.value = ''
  doneIds.value = []
  if (game.isComplete) router.push('/result')
}
</script>

<template>
  <main class="page simulator">
    <header class="topbar">
      <button class="back" @click="router.push('/')">‹</button>
      <div><strong>{{ game.mode === 'guided' ? '攻略引导模式' : '独立实操模式' }}</strong><small>Windows 11 重装流程</small></div>
      <span class="progress-text">{{ game.progress }}%</span>
    </header>
    <div class="progress-track"><div :style="{ width: `${game.progress}%` }"></div></div>
    <nav class="stage-nav">
      <button v-for="(stage, index) in stages" :key="stage.id"
        :class="{ active: stage.id === game.currentStage, complete: game.completedStages.includes(stage.id) }"
        @click="game.goToStage(stage.id)" :aria-label="stage.title">
        {{ index + 1 }}
      </button>
    </nav>
    <section class="panel">
      <div class="eyebrow">阶段 {{ stages.findIndex(s => s.id === current.id) + 1 }} / 8</div>
      <h1>{{ current.title }}</h1>
      <p>{{ current.description }}</p>
      <div v-if="game.mode === 'guided'" class="guide-box">
        <strong>本阶段攻略</strong>
        <ol><li v-for="item in current.guide" :key="item">{{ item }}</li></ol>
      </div>
    </section>
    <section class="screen">
      <div class="screen-title"><span class="led"></span> SIMULATED COMPUTER ENVIRONMENT</div>
      <h2>{{ current.objective }}</h2>
      <p>此处为虚拟操作环境。所有设备、磁盘和系统均为模拟数据。</p>
      <div class="action-list">
        <button v-for="action in current.actions" :key="action.id"
          :class="{ chosen: selected === action.id, done: doneIds.includes(action.id) }"
          @click="choose(action.id, action.correct, action.feedback)">
          <span>{{ action.label }}</span><span>{{ doneIds.includes(action.id) ? '✓' : '›' }}</span>
        </button>
      </div>
    </section>
    <div v-if="feedback" class="feedback" role="status">{{ feedback }}</div>
    <button class="primary" @click="next">完成本阶段，继续</button>
    <button class="text-button" @click="router.push('/')">退出模拟</button>
  </main>
</template>
