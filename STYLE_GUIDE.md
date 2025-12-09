# 界面优化样式规范文档

## 1. 颜色系统 (Color System)

### 主色调 (Primary)
- **Primary-600**: `#2563eb` (用于主按钮、链接悬停、激活状态)
- **Primary-50**: `#eff6ff` (用于浅色背景、标签)
- **Dark Mode Primary**: `#60a5fa` (Primary-400, 用于深色模式下的高亮)

### 中性色 (Neutrals)
- **Light Mode Background**: `bg-gray-50` (#f9fafb)
- **Dark Mode Background**: `dark:bg-gray-900` (#111827)
- **Surface (Card)**: `bg-white` (#ffffff) / `dark:bg-gray-800` (#1f2937)
- **Text Main**: `text-gray-900` (#111827) / `dark:text-white` (#ffffff)
- **Text Secondary**: `text-gray-500` (#6b7280) / `dark:text-gray-400` (#9ca3af)

## 2. 字体排版 (Typography)

### 标题
- **H1 (Page Title)**: `text-2xl font-bold`
- **H2 (Section Title)**: `text-xl font-bold`
- **H3 (Card Title)**: `text-base font-bold`

### 正文
- **Body**: `text-sm` (默认)
- **Small**: `text-xs` (元数据、标签)

## 3. 组件样式 (Component Styles)

### 导航栏 (Header)
- **高度**: `h-16`
- **背景**: `bg-white/90` + `backdrop-blur-md` (毛玻璃效果)
- **阴影**: `border-b border-gray-200` (无阴影，仅边框)
- **交互**: `hover:text-primary-600`，`transition-colors`

### 轮播图 (Carousel)
- **圆角**: `rounded-2xl`
- **比例**: `aspect-[16/9]` (移动端) / `lg:aspect-[21/9]` (桌面端)
- **阴影**: `shadow-lg`
- **动画**: `transition-all duration-700 ease-in-out`
- **指示器**: 激活时 `w-6 bg-white`，未激活时 `w-2 bg-white/50`

### 软件卡片 (Software Card)
- **容器**: `bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700`
- **悬停效果**: `hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300`
- **图标**: `w-12 h-12 rounded-xl`，悬停时 `scale-105`
- **下载按钮**: 悬停时从底部滑出 (`translate-y-0`)

### 侧边栏列表 (Sidebar List)
- **排行徽章**: 
  - No.1: `text-yellow-500 bg-yellow-50`
  - No.2: `text-gray-400 bg-gray-50`
  - No.3: `text-orange-500 bg-orange-50`
- **列表项**: `p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50`

## 4. 动画与交互 (Animations)

- **全局过渡**: `transition-all duration-200`
- **页面切换**: `animate-fade-in`
- **骨架屏**: `animate-pulse`

## 5. 暗黑模式 (Dark Mode)

- **策略**: 使用 `dark:` 类前缀
- **切换**: 本地存储 `localStorage.getItem('theme')`
- **适配**: 所有背景、文字、边框均有对应的 dark 变体

## 6. 性能优化 (Performance)

- **图片**: `loading="lazy"`
- **JavaScript**: 按需加载，减少主线程阻塞
- **CSS**: 使用 Tailwind Utility Classes，减少自定义 CSS 体积
