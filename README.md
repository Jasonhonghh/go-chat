# Go-Chat前端仓库

一个前后端分离的高性能、轻量级聊天系统，融合微信式交互与可扩展架构设计。

## 功能特点

- ✨ 基于React和Next.js的现代化UI设计
- 🚀 实时消息传输基于WebSocket
- 📱 响应式设计，移动端友好
- 🔥 支持多种消息类型：文本、图片、文件、Markdown富文本
- 😊 表情选择器支持
- 🌙 简洁优雅的界面设计

## 技术栈

- **前端框架**: React、Next.js
- **状态管理**: Zustand
- **样式**: TailwindCSS
- **实时通信**: WebSocket
- **开发语言**: TypeScript

## 快速开始

### 环境要求

- Node.js 16+
- npm 7+ 或 yarn 1.22+

### 安装依赖

```bash
# 使用npm
npm install

# 使用yarn
yarn
```

### 本地开发

```bash
# 使用npm
npm run dev

# 使用yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
# 使用npm
npm run build
npm start

# 使用yarn
yarn build
yarn start
```

## 项目结构

```
src/
├── app/              # Next.js App Router
├── components/       # React组件
│   ├── auth/         # 认证相关组件
│   ├── chat/         # 聊天功能组件
│   └── layout/       # 布局组件
├── hooks/            # 自定义Hooks
├── lib/              # 工具函数
├── store/            # 状态管理
└── types/            # TypeScript类型定义
```

## 待实现功能

- [ ] 群组聊天功能
- [ ] 消息历史记录加载
- [ ] 用户在线状态显示
- [ ] 消息已读状态
- [ ] 消息搜索功能
- [ ] 黑暗模式支持

## 与后端API集成

本项目设计为与Go编写的后端API配合使用。WebSocket连接URL应当指向后端服务的相应端点。

默认后端WebSocket连接URL: `ws://localhost:8080/ws?userId={userId}`