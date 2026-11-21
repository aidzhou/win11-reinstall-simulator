import type { GameStage } from '@/types/game'

export const stages: GameStage[] = [
  {
    id: 'preparation', title: '重装前准备', description: '检查设备、确认需求并备份数据。',
    objective: '确认电脑满足 Windows 11 安装条件，并完成重要数据备份。',
    guide: ['核对 CPU、内存、存储空间、UEFI 与 TPM 2.0 要求。', '确认目标系统版本与安装路线。', '将重要文件备份到其他可靠介质。'],
    actions: [
      { id: 'check-requirements', label: '检查硬件与兼容性', correct: true, feedback: '正确。先确认设备兼容性，再准备安装介质。' },
      { id: 'backup-data', label: '确认已备份重要数据', correct: true, feedback: '正确。备份是重装前最重要的安全步骤。', risk: 'high' },
    ],
  },
  {
    id: 'usb', title: '制作 PE 启动 U 盘', description: '选择启动盘、镜像和启动方案。',
    objective: '理解启动介质制作过程及其数据风险。',
    guide: ['准备容量足够的 U 盘。', '选择可信来源的 PE 镜像与制作工具。', '核对目标 U 盘，制作过程可能清空 U 盘数据。'],
    actions: [
      { id: 'select-usb', label: '选择正确的 U 盘设备', correct: true, feedback: '正确。制作前必须核对设备名称和容量。', risk: 'high' },
      { id: 'confirm-image', label: '确认镜像来源与启动方案', correct: true, feedback: '正确。应使用可信来源，并确认 UEFI/GPT 兼容性。' },
    ],
  },
  {
    id: 'bios', title: 'BIOS 设置启动项', description: '选择 UEFI USB 启动设备。',
    objective: '让电脑从 PE 启动 U 盘启动。',
    guide: ['按设备厂商指定按键进入启动菜单或 BIOS。', '识别带 UEFI 标识的 USB 启动项。', '优先使用一次性 Boot Override，避免不必要地修改其他设置。'],
    actions: [
      { id: 'choose-uefi-usb', label: '选择 UEFI USB 启动项', correct: true, feedback: '正确。设备名称因主板和 U 盘而异。' },
      { id: 'avoid-random-settings', label: '不随意修改无关 BIOS 参数', correct: true, feedback: '正确。只调整本次启动所需选项。' },
    ],
  },
  {
    id: 'pe', title: '进入 PE 环境', description: '识别硬盘并确认安装目标。',
    objective: '在虚拟 PE 桌面中识别正确的物理磁盘。',
    guide: ['进入 PE 桌面后打开磁盘管理工具。', '根据容量和型号确认目标磁盘。', '不要仅凭磁盘编号猜测目标盘。'],
    actions: [
      { id: 'identify-disk', label: '核对硬盘型号与容量', correct: true, feedback: '正确。先识别磁盘，再进行后续操作。' },
    ],
  },
  {
    id: 'partition', title: '磁盘分区', description: '确认 GPT 磁盘与目标系统分区。',
    objective: '区分 EFI、MSR、系统分区和数据分区。',
    guide: ['确认目标磁盘及 GPT/UEFI 安装方案。', '理解 EFI、MSR、Windows 和恢复分区的作用。', '只处理明确确认的目标系统分区；不要盲目删除整块磁盘分区。'],
    actions: [
      { id: 'select-system-partition', label: '选择明确的目标系统分区', correct: true, feedback: '正确。必须确认分区用途与数据备份。', risk: 'high' },
      { id: 'preserve-data', label: '保留非目标数据分区', correct: true, feedback: '正确。不要把格式化或删除所有分区作为默认步骤。', risk: 'high' },
    ],
  },
  {
    id: 'installation', title: '安装 Windows 11', description: '选择镜像、版本和安装位置。',
    objective: '理解系统镜像与安装目标的对应关系。',
    guide: ['选择可信的 Windows 11 安装镜像。', '核对版本与目标安装分区。', '确认后开始虚拟安装流程。'],
    actions: [
      { id: 'select-edition', label: '选择正确的系统版本', correct: true, feedback: '正确。版本应与实际授权和需求相符。' },
      { id: 'confirm-target', label: '再次确认安装目标分区', correct: true, feedback: '正确。安装前再次核对目标位置。', risk: 'high' },
    ],
  },
  {
    id: 'configuration', title: '首次启动与驱动', description: '完成初始设置并检查硬件驱动。',
    objective: '完成首次启动配置并理解驱动安装顺序。',
    guide: ['完成地区、键盘、账户和网络等首次设置。', '优先从电脑或硬件厂商获取驱动。', '检查网卡、显卡、声卡和芯片组设备状态。'],
    actions: [
      { id: 'setup-windows', label: '完成 Windows 首次启动设置', correct: true, feedback: '正确。首次配置完成后进入桌面。' },
      { id: 'check-drivers', label: '检查设备管理器与驱动', correct: true, feedback: '正确。重点检查未知设备和异常状态。' },
    ],
  },
  {
    id: 'verification', title: '最终验收', description: '检查系统、网络、声音和数据。',
    objective: '确认系统可用，并完成重装后的检查。',
    guide: ['检查设备管理器、网络、声音和显示分辨率。', '核实系统激活状态，不使用来历不明的激活工具。', '确认备份数据已恢复且文件完整。'],
    actions: [
      { id: 'verify-system', label: '完成系统与硬件验收', correct: true, feedback: '模拟流程完成。真实设备仍需按实际情况逐项检查。' },
    ],
  },
]
