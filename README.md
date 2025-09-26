# APPFUN

基于 Astro 框架和 LACS API 构建的现代化APPFUN，提供软件发布、管理、下载和激活码管理等功能。

## ✨ 特性

- 🚀 **现代化技术栈**: 基于 Astro + React + TypeScript + Tailwind CSS
- 📦 **软件浏览**: 完整的软件信息展示，包括版本历史、下载链接等
- 🏷️ **分类标签**: 灵活的分类和标签系统，便于软件发现
- 🔍 **智能搜索**: 支持按名称、分类、标签等多种方式搜索
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🌐 **API 集成**: 基于 LACS API 的软件浏览服务

## 🛠️ 技术栈

- **前端框架**: [Astro](https://astro.build/) - 现代静态站点生成器
- **UI 组件**: [React](https://reactjs.org/) - 交互式组件开发
- **类型安全**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **样式框架**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **API 客户端**: 自定义 API 客户端，支持 LACS API 所有端点

## 📋 页面功能

### 🏠 首页
- 展示特色和最新软件
- 全局搜索功能
- 软件分类快速导航
- 平台统计信息展示

### 📂 分类页面
- 按分类浏览软件
- 分类统计信息
- 最近更新的软件展示
- 热门标签展示

### 🏷️ 标签页面
- 标签云展示
- 按标签筛选软件
- 标签使用统计
- 搜索历史记录

### 📄 软件详情页面
- 完整的软件信息展示
- 版本历史和下载链接
- 相关公告和通知
- 系统要求说明

### 🔍 搜索页面
- 智能搜索功能
- 搜索结果高亮
- 筛选和排序选项
- 搜索历史和热门搜索

### ℹ️ 关于页面
- 平台介绍和功能说明
- 技术栈展示
- 联系方式和支持信息

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd software-management-app
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，配置以下变量：
   ```env
   VITE_API_BASE_URL=https://api-g.lacs.cc
   VITE_API_KEY=your-api-key-here
   VITE_APP_TITLE=APPFUN
   VITE_APP_DESCRIPTION=基于 LACS API 的APPFUN
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

5. **访问应用**

   打开浏览器访问 `http://localhost:3000`

## 📦 构建部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 预览构建结果

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

### 部署选项

项目构建后会生成静态文件，可以部署到任何静态托管服务：

- **Vercel**: 推荐，支持 Astro 开箱即用
- **Netlify**: 优秀的静态站点托管
- **GitHub Pages**: 免费的静态站点托管
- **Cloudflare Pages**: 快速的全球 CDN

## 🔧 配置说明

### API 配置

在 `src/lib/config.ts` 中可以配置：

- API 基础 URL 和密钥
- 应用程序基本信息
- 分页和搜索参数
- 主题颜色配置
- 功能开关设置

### 样式定制

在 `tailwind.config.mjs` 中可以自定义：

- 主色调和辅助色
- 字体配置
- 动画效果
- 响应式断点

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── layout/         # 布局组件
│   ├── software/       # 软件相关组件
│   └── ui/            # 通用 UI 组件
├── layouts/            # 页面布局
├── lib/               # 工具函数和配置
│   ├── api.ts         # API 客户端
│   ├── config.ts      # 应用配置
│   └── utils.ts       # 工具函数
├── pages/             # 页面路由
│   ├── categories/    # 分类页面
│   ├── software/      # 软件详情页面
│   ├── tags/          # 标签页面
│   └── ...           # 其他页面
├── styles/            # 全局样式
└── types/             # TypeScript 类型定义
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您遇到问题或有任何建议，请：

- 查看 [API 文档](https://docs.lacs.cc)
- 提交 [Issue](https://github.com/lacs-team/software-management-app/issues)
- 联系技术支持: support@lacs.cc

## 🙏 致谢

- [Astro](https://astro.build/) - 优秀的静态站点生成器
- [React](https://reactjs.org/) - 强大的 UI 库
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [LACS API](https://api-g.lacs.cc) - 强大的后端 API 服务
