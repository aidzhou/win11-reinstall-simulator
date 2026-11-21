# Windows 11 重装系统模拟器

基于 Vue 3 + TypeScript + Vite 的手机端交互式教学模拟器。

## 产品范围

- 路线：PE + U 盘启动安装 Windows 11
- 模式：攻略引导 / 独立实操
- 阶段：准备、制作启动盘、BIOS、PE、磁盘分区、安装系统、首次配置与驱动、验收
- 数据：纯前端虚拟数据，LocalStorage 本地存档

> 安全边界：本项目只模拟操作流程，不访问真实磁盘、不制作真实启动盘、不执行格式化或系统安装。实际操作请以设备厂商和 Microsoft 官方文档为准。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run type-check
npm run build
```

## 目录

```text
src/
  components/     通用组件
  data/            阶段与攻略数据
  router/          路由
  stores/          Pinia 状态
  types/           TypeScript 类型
  views/           页面
```
