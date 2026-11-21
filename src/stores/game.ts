import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { stages } from '@/data/stages'
import type { ActionRecord, GameMode, StageId } from '@/types/game'

const SAVE_KEY = 'win11-reinstall-simulator:v1'

export const useGameStore = defineStore('game', () => {
  const mode = ref<GameMode>('guided')
  const currentStage = ref<StageId>('preparation')
  const completedStages = ref<StageId[]>([])
  const records = ref<ActionRecord[]>([])
  const stageIndex = computed(() => stages.findIndex((stage) => stage.id === currentStage.value))
  const current = computed(() => stages[stageIndex.value] ?? stages[0])
  const progress = computed(() => Math.round(completedStages.value.length / stages.length * 100))
  const isComplete = computed(() => completedStages.value.length === stages.length)

  function setMode(value: GameMode) { mode.value = value }
  function recordAction(actionId: string, correct: boolean) {
    records.value.push({
      stageId: currentStage.value,
      actionId,
      correct,
      viewedGuide: mode.value === 'guided',
      createdAt: Date.now(),
    })
  }
  function completeCurrentStage() {
    if (!completedStages.value.includes(currentStage.value)) completedStages.value.push(currentStage.value)
    const next = stages[stageIndex.value + 1]
    if (next) currentStage.value = next.id
  }
  function goToStage(id: StageId) { currentStage.value = id }
  function reset() {
    currentStage.value = 'preparation'
    completedStages.value = []
    records.value = []
  }
  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1, mode: mode.value, currentStage: currentStage.value,
      completedStages: completedStages.value, records: records.value,
    }))
  }
  function restore() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return false
      const data = JSON.parse(raw) as {
        version: number; mode: GameMode; currentStage: StageId
        completedStages: StageId[]; records: ActionRecord[]
      }
      if (data.version !== 1) return false
      mode.value = data.mode
      currentStage.value = data.currentStage
      completedStages.value = data.completedStages
      records.value = data.records
      return true
    } catch {
      return false
    }
  }
  watch([mode, currentStage, completedStages, records], save, { deep: true })
  return {
    mode, currentStage, completedStages, records, current, progress, isComplete,
    setMode, recordAction, completeCurrentStage, goToStage, reset, save, restore,
  }
})
