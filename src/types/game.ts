export type GameMode = 'guided' | 'practice'

export type StageId =
  | 'preparation'
  | 'usb'
  | 'bios'
  | 'pe'
  | 'partition'
  | 'installation'
  | 'configuration'
  | 'verification'

export interface GameStage {
  id: StageId
  title: string
  description: string
  objective: string
  guide: string[]
  actions: GameAction[]
}

export interface GameAction {
  id: string
  label: string
  correct: boolean
  feedback: string
  risk?: 'low' | 'medium' | 'high'
}

export interface ActionRecord {
  stageId: StageId
  actionId: string
  correct: boolean
  viewedGuide: boolean
  createdAt: number
}
