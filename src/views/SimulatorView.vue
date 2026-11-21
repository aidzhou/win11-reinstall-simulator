<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stages } from '@/data/stages'
import { useGameStore } from '@/stores/game'

const game = useGameStore()
const router = useRouter()
const selected = ref('')
const feedback = ref('')
const doneIds = ref<string[]>([])
const biosBoot = ref('UEFI: USB Storage Device')
const selectedDisk = ref('Disk 0')
const selectedEdition = ref('Windows 11 专业版')
const setupStep = ref(0)
const current = computed(() => game.current)
const stageNumber = computed(() => stages.findIndex((stage) => stage.id === current.value.id) + 1)

function choose(actionId: string, correct = true, message?: string) {
  const action = current.value.actions.find((item) => item.id === actionId)
  selected.value = actionId
  feedback.value = message ?? action?.feedback ?? '操作已记录。'
  game.recordAction(actionId, correct)
  if (correct && !doneIds.value.includes(actionId)) doneIds.value.push(actionId)
}

function isDone(id: string) { return doneIds.value.includes(id) }

function next() {
  const allDone = current.value.actions.every((action) => doneIds.value.includes(action.id))
  if (!allDone) {
    feedback.value = '请先在模拟界面完成本阶段的操作。'
    return
  }
  game.completeCurrentStage()
  selected.value = ''
  feedback.value = ''
  doneIds.value = []
  biosBoot.value = 'UEFI: USB Storage Device'
  selectedDisk.value = 'Disk 0'
  setupStep.value = 0
  if (game.isComplete) router.push('/result')
}
</script>

<template>
  <main class="page simulator">
    <header class="topbar">
      <button class="back" @click="router.push('/')">‹</button>
      <div><strong>{{ game.mode === 'guided' ? '攻略引导模式' : '独立实操模式' }}</strong><small>Windows 11 重装模拟器</small></div>
      <span class="progress-text">{{ game.progress }}%</span>
    </header>
    <div class="progress-track"><div :style="{ width: game.progress + '%' }"></div></div>
    <nav class="stage-nav">
      <button v-for="(stage, index) in stages" :key="stage.id"
        :class="{ active: stage.id === game.currentStage, complete: game.completedStages.includes(stage.id) }"
        @click="game.goToStage(stage.id)" :aria-label="stage.title">{{ index + 1 }}</button>
    </nav>

    <section class="stage-heading">
      <div class="eyebrow">INSTALLATION WORKFLOW · STEP {{ String(stageNumber).padStart(2, '0') }} / 08</div>
      <h1>{{ current.title }}</h1>
      <p>{{ current.description }}</p>
    </section>

    <section class="computer">
      <div class="monitor-bar">
        <div class="monitor-brand"><span class="brand-mark">▦</span> SIMULATED PC <i></i></div>
        <div class="monitor-state"><span class="online-dot"></span> 虚拟设备运行中</div>
      </div>

      <div v-if="current.id === 'preparation'" class="mock-screen prep-screen">
        <div class="mock-titlebar"><span>设备兼容性检查工具</span><span>— □ ×</span></div>
        <div class="tool-content">
          <div class="tool-heading"><span class="win-logo">▦</span><div><strong>Windows 11 安装准备</strong><small>检查设备是否满足安装要求</small></div></div>
          <div class="spec-grid">
            <div><small>处理器</small><b>Intel Core i5 · 8核</b><em class="ok">✓ 兼容</em></div>
            <div><small>内存</small><b>16 GB RAM</b><em class="ok">✓ 满足要求</em></div>
            <div><small>系统固件</small><b>UEFI</b><em class="ok">✓ 已启用</em></div>
            <div><small>安全模块</small><b>TPM 2.0</b><em class="ok">✓ 已就绪</em></div>
          </div>
          <div class="disk-summary"><span>系统盘可用空间</span><b>238 GB</b><div class="capacity"><i></i></div></div>
          <div class="mock-actions">
            <button :class="{ finished: isDone('check-requirements') }" @click="choose('check-requirements')">{{ isDone('check-requirements') ? '✓ 已完成兼容性检查' : '运行兼容性检查' }}</button>
            <button :class="{ finished: isDone('backup-data') }" @click="choose('backup-data')">{{ isDone('backup-data') ? '✓ 已确认数据备份' : '确认重要数据已备份' }}</button>
          </div>
        </div>
      </div>

      <div v-else-if="current.id === 'usb'" class="mock-screen usb-screen">
        <div class="mock-titlebar"><span>PE 启动盘制作向导</span><span>— □ ×</span></div>
        <div class="wizard-content">
          <div class="wizard-side"><div class="wizard-logo">USB</div><b>启动盘制作工具</b><small>制作 Windows PE 启动介质</small><div class="wizard-step active">01　选择设备</div><div class="wizard-step">02　选择镜像</div><div class="wizard-step">03　写入启动盘</div></div>
          <div class="wizard-main"><h3>选择目标 U 盘</h3><p>请确认设备型号与容量，避免误选其他磁盘。</p>
            <div class="device-row"><span class="usb-icon">▰</span><div><b>USB Flash Disk</b><small>可移动磁盘 · 32 GB · E:</small></div><strong>已选中</strong></div>
            <h3>启动镜像</h3><div class="image-row"><span>▣</span><div><b>WinPE_x64.iso</b><small>UEFI 启动 · x64 架构</small></div><span class="file-check">✓</span></div>
            <div class="warning-line">注意：真实制作过程可能清空 U 盘数据。本模拟不会写入任何设备。</div>
            <div class="mock-actions"><button :class="{ finished: isDone('select-usb') }" @click="choose('select-usb')">{{ isDone('select-usb') ? '✓ 已核对 U 盘设备' : '确认目标 U 盘' }}</button><button :class="{ finished: isDone('confirm-image') }" @click="choose('confirm-image')">{{ isDone('confirm-image') ? '✓ 已确认镜像方案' : '确认镜像与启动方案' }}</button></div>
          </div>
        </div>
      </div>

      <div v-else-if="current.id === 'bios'" class="mock-screen bios-screen">
        <div class="bios-top"><b>UEFI BIOS Utility</b><span>EZ Mode　Advanced Mode</span></div>
        <div class="bios-tabs"><span>Main</span><span>Advanced</span><span>Boot</span><span>Security</span><span>Save & Exit</span></div>
        <div class="bios-body"><div class="bios-left"><small>Boot Priority</small><h3>启动设备顺序</h3><p>选择本次启动使用的设备。优先选择带 UEFI 标识的 USB 设备。</p>
          <button v-for="item in ['Windows Boot Manager','UEFI: USB Storage Device','SATA SSD: 1TB']" :key="item" :class="{ bios-selected: biosBoot === item }" @click="biosBoot = item"><span>≡</span>{{ item }} <b>{{ biosBoot === item ? '◆' : '◇' }}</b></button>
          <div class="bios-hint">↑ ↓ 选择设备　Enter 确认</div></div><div class="bios-right"><div><small>Boot Mode</small><b>UEFI</b></div><div><small>Secure Boot</small><b>Enabled</b></div><div><small>TPM Device</small><b>Available</b></div></div></div>
        <div class="bios-footer"><span>F1 Help　F10 Save & Exit　ESC Exit</span><button :class="{ finished: isDone('choose-uefi-usb') }" @click="choose('choose-uefi-usb', biosBoot.includes('UEFI'), biosBoot.includes('UEFI') ? '已选择 UEFI USB 启动项。' : '当前选择不是 UEFI USB，请重新选择。')">{{ isDone('choose-uefi-usb') ? '✓ 已确认启动项' : '确认启动设备' }}</button><button :class="{ finished: isDone('avoid-random-settings') }" @click="choose('avoid-random-settings')">{{ isDone('avoid-random-settings') ? '✓ 已确认' : '保持其他设置不变' }}</button></div>
      </div>

      <div v-else-if="current.id === 'pe'" class="mock-screen desktop-screen">
        <div class="desktop-wallpaper"><div class="desktop-icons"><button @click="choose('identify-disk')"><span>▤</span>此电脑</button><button @click="choose('identify-disk')"><span>▧</span>磁盘工具</button><button @click="choose('identify-disk')"><span>🛠</span>系统安装</button><button @click="choose('identify-disk')"><span>▣</span>回收站</button></div><div class="desktop-window"><div class="window-head">此电脑 <span>— □ ×</span></div><h3>设备和驱动器</h3><div class="drive"><span>▰</span><div><b>本地磁盘 (C:)</b><small>SSD · 476 GB</small><div class="capacity"><i></i></div></div></div><div class="drive"><span>▰</span><div><b>数据磁盘 (D:)</b><small>SSD · 1 TB</small><div class="capacity"><i class="data-fill"></i></div></div></div><div class="mock-actions"><button :class="{ finished: isDone('identify-disk') }" @click="choose('identify-disk')">{{ isDone('identify-disk') ? '✓ 已核对磁盘型号与容量' : '核对磁盘型号与容量' }}</button></div></div></div>
        <div class="taskbar"><span>⊞</span><span>⌕</span><span>▣</span><small>PE 环境　14:32</small></div>
      </div>

      <div v-else-if="current.id === 'partition'" class="mock-screen partition-screen">
        <div class="mock-titlebar"><span>磁盘管理 · Disk Management</span><span>— □ ×</span></div>
        <div class="partition-toolbar">文件　操作　查看　帮助 <span>⌕</span></div>
        <div class="disk-info"><b>磁盘 0</b><span>基本 · 476.92 GB · 联机</span><span class="disk-label">GPT</span></div>
        <div class="partition-map"><div class="part efi"><b>EFI</b><small>260 MB</small></div><div class="part msr"><b>MSR</b><small>16 MB</small></div><div class="part system" :class="{ 'part-selected': selectedDisk === 'Windows' }" @click="selectedDisk = 'Windows'"><b>Windows (C:)</b><small>200 GB NTFS · 系统</small></div><div class="part data" :class="{ 'part-selected': selectedDisk === 'Data' }" @click="selectedDisk = 'Data'"><b>Data (D:)</b><small>276 GB NTFS · 数据</small></div></div>
        <div class="partition-legend"><span>▰ EFI 系统分区</span><span>▰ MSR 保留分区</span><span>▰ Windows 系统分区</span><span>▰ 数据分区</span></div>
        <div class="partition-select">当前选中：<b>{{ selectedDisk === 'Disk 0' ? '磁盘 0' : selectedDisk === 'Windows' ? 'Windows (C:) 系统分区' : 'Data (D:) 数据分区' }}</b></div>
        <div class="mock-actions"><button :class="{ finished: isDone('select-system-partition') }" @click="choose('select-system-partition', selectedDisk === 'Windows', selectedDisk === 'Windows' ? '已选中 Windows 系统分区。' : '请先点击 Windows (C:) 系统分区。')">{{ isDone('select-system-partition') ? '✓ 已确认系统分区' : '确认 Windows 系统分区' }}</button><button :class="{ finished: isDone('preserve-data') }" @click="choose('preserve-data')">{{ isDone('preserve-data') ? '✓ 已确认保留数据分区' : '确认保留 D: 数据分区' }}</button></div>
        <div class="simulation-note">仅为虚拟磁盘布局。点击分区可选择，不会对真实磁盘执行操作。</div>
      </div>

      <div v-else-if="current.id === 'installation'" class="mock-screen install-screen">
        <div class="install-logo"><span class="win-logo">▦</span><small>Windows 11 安装程序</small></div>
        <div class="install-content"><h2>选择要安装的操作系统</h2><p>选择与你的产品密钥或数字许可证对应的版本。</p>
          <button v-for="edition in ['Windows 11 家庭版','Windows 11 专业版','Windows 11 专业工作站版']" :key="edition" class="edition" :class="{ 'edition-active': selectedEdition === edition }" @click="selectedEdition = edition"><span class="radio-dot"></span>{{ edition }}<small>{{ edition === 'Windows 11 专业版' ? '适用于个人与企业进阶用户' : 'Windows 11' }}</small></button>
          <div class="install-target">安装位置：<b>磁盘 0 · 分区 3 (Windows)</b></div>
          <div class="mock-actions"><button :class="{ finished: isDone('select-edition') }" @click="choose('select-edition', selectedEdition === 'Windows 11 专业版', selectedEdition === 'Windows 11 专业版' ? '已选择 Windows 11 专业版。' : '本模拟流程预设目标版本为 Windows 11 专业版，请重新选择。')">{{ isDone('select-edition') ? '✓ 已确认系统版本' : '确认系统版本' }}</button><button :class="{ finished: isDone('confirm-target') }" @click="choose('confirm-target')">{{ isDone('confirm-target') ? '✓ 已确认安装位置' : '确认安装位置' }}</button></div>
        </div>
        <div class="install-foot">此电脑　　Windows 11　　安装程序</div>
      </div>

      <div v-else-if="current.id === 'configuration'" class="mock-screen oobe-screen">
        <div class="oobe-glow"></div><div class="oobe-content"><span class="win-logo">▦</span><h2>{{ ['让我们从这里开始','这是正确的国家或地区吗？','想要使用哪种键盘布局？','连接到网络','为设备命名'][setupStep] }}</h2><p>{{ ['Windows 11 首次启动体验','选择你的地区','选择常用的键盘布局','你可以稍后完成网络连接','给你的电脑一个名称'][setupStep] }}</p>
          <div v-if="setupStep === 0" class="oobe-choice">欢迎使用 Windows</div><div v-else-if="setupStep === 1 || setupStep === 2" class="oobe-choice">中国 <span>✓</span></div><div v-else-if="setupStep === 3" class="oobe-choice">暂时跳过网络连接 <span>›</span></div><div v-else class="oobe-choice">DESKTOP-PC</div>
          <button class="oobe-next" @click="setupStep = Math.min(setupStep + 1, 4)">{{ setupStep === 4 ? '完成设置步骤' : '是 / 下一步' }}</button>
          <div class="oobe-progress"><i :style="{ width: ((setupStep + 1) * 20) + '%' }"></i></div>
        </div>
        <div class="mock-actions oobe-actions"><button :class="{ finished: isDone('setup-windows') }" @click="choose('setup-windows')">{{ isDone('setup-windows') ? '✓ 已完成首次启动设置' : '确认完成 OOBE 设置' }}</button><button :class="{ finished: isDone('check-drivers') }" @click="choose('check-drivers')">{{ isDone('check-drivers') ? '✓ 驱动检查完成' : '打开设备管理器检查驱动' }}</button></div>
      </div>

      <div v-else class="mock-screen desktop-screen">
        <div class="desktop-wallpaper final-wallpaper"><div class="desktop-icons"><button><span>▤</span>此电脑</button><button><span>▧</span>网络</button><button><span>▣</span>回收站</button></div><div class="final-card"><span class="win-logo">▦</span><h2>Windows 11</h2><p>欢迎使用。请完成最终验收。</p><div class="final-check"><span>✓</span> 系统正常启动</div><div class="final-check"><span>✓</span> 网络与声音待检查</div><div class="final-check"><span>✓</span> 数据备份待核验</div><button :class="{ finished: isDone('verify-system') }" @click="choose('verify-system')">{{ isDone('verify-system') ? '✓ 验收完成' : '完成系统验收' }}</button></div></div><div class="taskbar"><span>⊞</span><span>⌕</span><span>▣</span><small>Windows 11　14:32</small></div>
      </div>
      <div class="monitor-foot"><span>●</span> 虚拟环境 · 不连接真实磁盘</div>
    </section>

    <section v-if="game.mode === 'guided'" class="guide-box">
      <strong>本阶段操作提示</strong>
      <ol><li v-for="item in current.guide" :key="item">{{ item }}</li></ol>
    </section>
    <div v-if="feedback" class="feedback" role="status">{{ feedback }}</div>
    <div class="bottom-actions"><button class="primary" @click="next">完成本阶段，继续 →</button><button class="text-button" @click="router.push('/')">退出模拟</button></div>
  </main>
</template>

<style scoped>
.simulator { max-width: 820px; }
.stage-heading { padding: 12px 2px 4px; }
.stage-heading h1 { margin: 8px 0; font-size: 29px; }
.stage-heading p { margin: 0 0 12px; font-size: 14px; }
.computer { overflow: hidden; margin: 14px 0 20px; border: 1px solid #cbd5e1; border-radius: 16px; background: #101b2b; box-shadow: 0 18px 48px #0f172a20; }
.monitor-bar { display:flex; justify-content:space-between; align-items:center; padding: 11px 15px; color:#dce8f8; background:#17263a; font-size:11px; }
.monitor-brand { display:flex; align-items:center; gap:8px; font-weight:800; letter-spacing:.12em; }
.brand-mark { color:#60a5fa; font-size:17px; }.monitor-brand i,.online-dot { width:7px;height:7px;border-radius:50%;background:#36c98a; }.online-dot{display:inline-block;margin-right:5px}
.monitor-state { color:#a9bdd2; }.mock-screen { min-height:390px; color:#1e293b; background:#f1f5f9; }
.mock-titlebar,.window-head { display:flex;justify-content:space-between;padding:10px 14px;background:#fff;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700; }
.tool-content { max-width:590px;margin:auto;padding:24px 22px; }.tool-heading{display:flex;align-items:center;gap:13px;margin-bottom:20px}.tool-heading strong,.tool-heading small{display:block}.tool-heading small{margin-top:4px;color:#64748b;font-size:11px}
.win-logo { color:#1685df;font-size:35px;line-height:1; }.spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.spec-grid>div{display:grid;gap:5px;padding:12px;border:1px solid #dce5ef;border-radius:9px;background:white}.spec-grid small,.disk-summary span{color:#64748b;font-size:10px}.spec-grid b{font-size:12px}.ok{color:#07875b;font-size:11px;font-style:normal}.disk-summary{margin:15px 0;padding:12px;background:white;border:1px solid #dce5ef;border-radius:9px}.disk-summary b{float:right;font-size:12px}.capacity{height:6px;margin-top:9px;overflow:hidden;border-radius:10px;background:#dce5ef}.capacity i{display:block;width:72%;height:100%;background:#2788db}.capacity i.data-fill{width:38%;background:#16a36a}
.mock-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.mock-actions button,.bios-footer button,.final-card button{min-height:36px;padding:8px 12px;border:1px solid #2563eb;border-radius:7px;color:white;background:#2563eb;font-size:11px;font-weight:700}.mock-actions button.finished,.bios-footer button.finished,.final-card button.finished{border-color:#0b9366;background:#0b9366}
.wizard-content{display:grid;grid-template-columns:155px 1fr;min-height:390px}.wizard-side{padding:22px 15px;color:#dce9f8;background:#1b3656}.wizard-logo{display:grid;width:44px;height:44px;place-items:center;margin-bottom:12px;border-radius:12px;background:#2d5b87;color:white;font-size:12px;font-weight:800}.wizard-side b,.wizard-side small{display:block}.wizard-side b{font-size:12px}.wizard-side small{margin:5px 0 22px;color:#a8bfd7;font-size:10px}.wizard-step{padding:10px 6px;border-top:1px solid #ffffff20;color:#a8bfd7;font-size:10px}.wizard-step.active{color:white;font-weight:800}.wizard-main{padding:22px}.wizard-main h3{margin:0 0 6px;font-size:14px}.wizard-main p{margin:0 0 15px;font-size:11px}.device-row,.image-row{display:flex;align-items:center;gap:10px;margin:10px 0;padding:12px;border:1px solid #cbd9e8;border-radius:8px;background:white}.device-row div,.image-row div{flex:1}.device-row b,.device-row small,.image-row b,.image-row small{display:block}.device-row b,.image-row b{font-size:11px}.device-row small,.image-row small{margin-top:4px;color:#64748b;font-size:10px}.device-row strong,.file-check{color:#07875b;font-size:10px}.usb-icon{color:#287fc5;font-size:23px}.image-row>span:first-child{font-size:22px;color:#287fc5}.warning-line{padding:9px;border-radius:6px;background:#fff5df;color:#94631a;font-size:10px;line-height:1.5}
.bios-screen{padding:0 17px 15px;color:#e5edf8;background:linear-gradient(140deg,#263e5e,#132a48)}.bios-top{display:flex;justify-content:space-between;padding:19px 3px 15px;font-size:13px}.bios-top span{color:#a9c4e2;font-size:10px}.bios-tabs{display:flex;gap:0;border-bottom:1px solid #66809f}.bios-tabs span{padding:9px 13px;font-size:10px;color:#b8cde3}.bios-tabs span:nth-child(3){color:white;background:#42658a}.bios-body{display:grid;grid-template-columns:1.5fr 1fr;gap:14px;padding:20px 4px}.bios-left>small,.bios-right small{color:#9db9d6;font-size:10px}.bios-left h3{margin:5px 0;font-size:17px}.bios-left p{font-size:10px;color:#b8cde3}.bios-left button{display:flex;gap:10px;align-items:center;width:100%;margin:7px 0;padding:11px;border:1px solid #607d9d;border-radius:5px;color:white;background:#294665;text-align:left;font-size:10px}.bios-left button b{margin-left:auto;color:#8dc4ff}.bios-left button.bios-selected{border-color:#8cc6ff;background:#365d84}.bios-hint{margin-top:12px;color:#9db9d6;font-size:9px}.bios-right{display:grid;align-content:start;gap:9px}.bios-right div{padding:13px;border:1px solid #486684;border-radius:6px;background:#1b3857}.bios-right b{display:block;margin-top:7px;font-size:12px}.bios-footer{display:flex;flex-wrap:wrap;align-items:center;gap:7px;padding-top:12px;border-top:1px solid #526f8e}.bios-footer span{flex:1;color:#9db9d6;font-size:9px}
.desktop-screen{display:flex;flex-direction:column;min-height:420px}.desktop-wallpaper{position:relative;display:flex;flex:1;min-height:380px;padding:18px;background:radial-gradient(ellipse at 65% 45%,#3b82c4,#143c70 55%,#10294d)}.desktop-icons{display:flex;flex-direction:column;gap:15px}.desktop-icons button{display:grid;justify-items:center;gap:4px;width:58px;padding:5px;border:0;color:white;background:transparent;font-size:9px;text-shadow:0 1px 3px #000}.desktop-icons button span{font-size:23px}.desktop-window{width:min(360px,calc(100% - 78px));margin:22px auto;padding:0 14px 14px;border:1px solid #dce5ef;border-radius:9px;background:#f8fafc;box-shadow:0 15px 35px #071b3580}.window-head{margin:0 -14px 14px;border-radius:9px 9px 0 0}.desktop-window h3{font-size:13px}.drive{display:flex;gap:10px;align-items:center;margin:10px 0;padding:9px;border:1px solid #dce5ef;border-radius:6px;background:white}.drive>span{color:#3184c4;font-size:20px}.drive div{flex:1}.drive b,.drive small{display:block;font-size:10px}.drive small{margin-top:3px;color:#64748b}.taskbar{display:flex;align-items:center;gap:19px;height:38px;padding:0 15px;color:white;background:#142b48}.taskbar small{margin-left:auto;font-size:9px;color:#d4e2f2}
.partition-screen{padding-bottom:18px}.partition-toolbar{padding:9px 14px;background:#f8fafc;border-bottom:1px solid #dce5ef;font-size:10px}.partition-toolbar span{float:right}.disk-info{display:flex;gap:12px;align-items:center;margin:16px 16px 8px;font-size:10px}.disk-info span{color:#64748b}.disk-label{padding:3px 6px;border-radius:4px;background:#e0edff;color:#2563eb!important}.partition-map{display:flex;gap:5px;margin:0 16px}.part{display:flex;flex-direction:column;justify-content:center;min-width:0;height:92px;padding:7px;border:2px solid #9bb4ca;border-radius:4px;background:#e9f1f8;cursor:pointer}.part b{font-size:10px;overflow:hidden;text-overflow:ellipsis}.part small{margin-top:5px;font-size:9px;color:#64748b}.part.efi{flex:0 0 13%}.part.msr{flex:0 0 9%;background:#e5e7eb}.part.system{flex:1;background:#dbeafe;border-color:#6da4df}.part.data{flex:1.3;background:#dcfce7;border-color:#6ab68b}.part.part-selected{outline:3px solid #2563eb;outline-offset:1px}.partition-legend{display:flex;flex-wrap:wrap;gap:9px;margin:13px 16px;color:#64748b;font-size:9px}.partition-legend span:nth-child(1){color:#64748b}.partition-legend span:nth-child(2){color:#94a3b8}.partition-legend span:nth-child(3){color:#2563eb}.partition-legend span:nth-child(4){color:#15945e}.partition-select{margin:0 16px;padding:10px;border-radius:6px;background:#eaf2fb;font-size:10px}.partition-screen .mock-actions{margin:14px 16px 0}.simulation-note{margin:10px 16px 0;color:#64748b;font-size:9px}
.install-screen{display:flex;flex-direction:column;min-height:470px;background:#fff}.install-logo{display:flex;align-items:center;gap:12px;padding:22px 28px;border-bottom:1px solid #e5eaf0}.install-logo small{font-size:11px;color:#64748b}.install-content{width:min(470px,100%);margin:auto;padding:20px 24px}.install-content h2{font-size:19px}.install-content>p{font-size:11px}.edition{display:grid;grid-template-columns:15px 1fr;gap:5px 10px;width:100%;margin:8px 0;padding:12px;border:1px solid #d6e0eb;border-radius:7px;background:white;text-align:left;font-size:11px}.edition small{grid-column:2;color:#64748b;font-size:9px}.edition-active{border-color:#3185d5;background:#eff7ff}.radio-dot{width:12px;height:12px;border:1px solid #8297ac;border-radius:50%}.edition-active .radio-dot{border:4px solid #2785d4}.install-target{margin-top:14px;padding:10px;background:#f1f5f9;font-size:10px}.install-foot{padding:12px 25px;border-top:1px solid #e5eaf0;color:#64748b;font-size:9px}
.oobe-screen{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:470px;overflow:hidden;background:#f6f9ff}.oobe-glow{position:absolute;inset:-30%;background:radial-gradient(ellipse at 50% 45%,#d7eaff 0,transparent 55%)}.oobe-content{position:relative;width:min(390px,90%);text-align:center}.oobe-content h2{margin:22px 0 7px;font-size:21px}.oobe-content p{font-size:11px}.oobe-choice{display:flex;justify-content:space-between;margin:24px 0;padding:14px;border:1px solid #cbd9e8;border-radius:7px;background:white;font-size:12px;text-align:left}.oobe-choice span{color:#1685df}.oobe-next{padding:9px 28px;border:0;border-radius:5px;color:white;background:#1678c8}.oobe-progress{height:4px;margin-top:25px;background:#dbe7f3}.oobe-progress i{display:block;height:100%;background:#1678c8;transition:width .2s}.oobe-actions{position:absolute;right:14px;bottom:14px;left:14px;justify-content:center}
.final-wallpaper{align-items:center;justify-content:center}.final-card{width:min(300px,calc(100% - 80px));padding:23px;border:1px solid #ffffff50;border-radius:12px;color:white;background:#17395ecf;backdrop-filter:blur(12px)}.final-card h2{margin:10px 0 4px}.final-card p{font-size:10px;color:#c5d9ef}.final-check{margin:10px 0;font-size:10px}.final-check span{margin-right:8px;color:#63e6ae}.final-card button{width:100%;margin-top:10px}
.monitor-foot{padding:9px 14px;color:#a8bdd5;background:#17263a;font-size:9px}.monitor-foot span{color:#39c78a;margin-right:5px}
.guide-box{margin-top:15px}.feedback{margin:14px 0}.bottom-actions{margin-top:14px}.bottom-actions .primary{display:block;text-align:center}
@media(max-width:520px){.stage-heading h1{font-size:25px}.mock-screen{min-height:360px}.wizard-content{grid-template-columns:105px 1fr}.wizard-side{padding:15px 9px}.wizard-main{padding:16px 11px}.bios-body{grid-template-columns:1fr}.bios-right{grid-template-columns:repeat(3,1fr)}.bios-right div{padding:8px}.bios-right b{font-size:10px}.bios-tabs span{padding:8px 7px;font-size:9px}.bios-screen{padding:0 10px 12px}.bios-footer span{flex-basis:100%}.part{height:80px;padding:4px}.part b{font-size:8px}.part small{font-size:7px}.partition-legend{gap:6px;font-size:8px}.desktop-wallpaper{min-height:360px}.desktop-window{margin-top:35px}.spec-grid{gap:6px}.spec-grid>div{padding:9px}.spec-grid b{font-size:10px}}
</style>
