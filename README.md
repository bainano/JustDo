# JustDo

一款简洁优雅的跨平台待办事项桌面应用，帮助你高效管理日常任务。

## ✨ 功能特性

- **任务管理** - 创建、编辑、删除待办任务
- **任务分类** - 按紧急/重要程度分类管理任务
- **任务筛选** - 支持按状态、日期等条件筛选
- **回收站功能** - 误删任务可恢复，支持清空回收站
- **暗黑模式** - 支持明暗主题切换
- **跨平台** - 支持 Windows 和 macOS 系统
- **自定义标题栏** - 支持窗口拖动、最小化、最大化、关闭操作

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **UI 组件**: Lucide React
- **构建工具**: Vite
- **样式**: TailwindCSS 3
- **桌面框架**: Electron 42

## 🚀 快速开始

### 前提条件

确保已安装 Node.js (>= 18) 和 npm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 或启动 Electron 开发模式
npm run electron:dev
```

### 构建生产版本

```bash
# 构建前端代码
npm run build

# 构建 Windows 版本
npm run electron:build:win

# 构建 macOS 版本
npm run electron:build:mac

# 构建所有平台版本
npm run electron:build
```

## 📁 项目结构

```
JustDo/
├── electron/          # Electron 主进程代码
│   ├── main.js        # 主进程入口
│   └── preload.js     # 预加载脚本
├── src/               # 前端源代码
│   ├── components/    # React 组件
│   │   ├── CustomTitleBar.tsx   # 自定义标题栏
│   │   ├── TaskItem.tsx         # 任务项组件
│   │   ├── TaskList.tsx         # 任务列表
│   │   ├── TaskDetailModal.tsx  # 任务详情弹窗
│   │   ├── Sidebar.tsx          # 侧边栏
│   │   ├── QuickAddBar.tsx      # 快速添加栏
│   │   └── ...
│   ├── store/         # 状态管理
│   │   └── taskStore.ts
│   ├── types/         # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx        # 应用主组件
│   ├── main.tsx       # 应用入口
│   └── index.css      # 全局样式
├── dist/              # Vite 构建输出
├── release/           # Electron 构建输出
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 📜 可用脚本

| 脚本 | 描述 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建前端生产版本 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run preview` | 预览构建结果 |
| `npm run electron:dev` | 启动 Electron 开发模式 |
| `npm run electron:build:win` | 构建 Windows 安装包 |
| `npm run electron:build:mac` | 构建 macOS 安装包 |
| `npm run electron:build` | 构建所有平台安装包 |

## 🎨 界面预览

### 主界面
- 左侧侧边栏：任务分类导航
- 中间区域：任务列表展示
- 顶部标题栏：应用名称、操作按钮、窗口控制

### 任务管理
- 支持标记任务完成/未完成
- 支持标记任务紧急/重要
- 支持编辑任务详情
- 支持删除任务到回收站

## 📝 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建新组件文件
2. 在需要使用的地方导入组件

### 添加新状态

1. 在 `src/store/taskStore.ts` 中添加新的状态和方法
2. 在组件中使用 `useTaskStore` hook 获取状态

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [React](https://react.dev/) - 用户界面库
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理库
- [Electron](https://www.electronjs.org/) - 桌面应用框架
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Lucide React](https://lucide.dev/) - 图标库

---

**JustDo** - 让任务管理更简单 ✅
