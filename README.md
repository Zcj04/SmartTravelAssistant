# 智能旅游助手系统

## 1. 项目概述

智能旅游助手系统是一个基于 AI 技术的旅游规划平台，旨在为用户提供个性化的旅游行程推荐和实时旅游咨询服务。系统通过结合大语言模型的智能分析能力，为用户生成符合预算和时间要求的详细旅游规划，并提供实时的旅游问答服务。

### 主要功能
- 智能旅游规划：根据用户输入的目的地、预算和天数，生成详细的行程安排
- AI 旅游咨询：提供实时的旅游相关问答服务
- 流式响应：实时显示 AI 生成内容，提升用户体验
- 移动端适配：响应式设计，完美适配手机屏幕

### 主要环境

**node版本 v24.12.0**

**node.js** https://nodejs.org/zh-cn/download

**Vant(Vue3版本)** https://vant.pro/vant/#/zh-CN

**硅基流动** https://www.siliconflow.cn/

**DeepSeek** https://www.deepseek.com/

**编辑器（Trae AI IDE）**https://www.trae.cn/

**vite**: https://vitejs.cn/vite6-cn/guide/

**apifox** https://apifox.com/index.html

**express** https://www.expressjs.com.cn/

## 2. 技术栈

### 后端技术
- **Node.js** (ESM 模块)
- **Express.js**：Web 服务器框架
- **LangChain.js**：大语言模型集成框架
  - @langchain/openai
  - @langchain/core
- **大模型接口**：硅基流动、DeepSeek
- **流式响应**：SSE (Server-Sent Events) 技术

### 前端技术
- **Vue 3** + **Composition API**：前端框架
- **Vant UI 4.x**：移动端 UI 组件库
- **Vue Router 4.x**：路由管理
- **Pinia**：状态管理
- **Axios**：HTTP 请求
- **Vite**：构建工具

## 3. 项目结构

### 后端结构
```
server/
├── src/
│   ├── routes/
│   │   └── travel.js          # 旅游推荐API路由
│   ├── services/
│   │   └── travelService.js   # LangChain智能推荐服务
│   ├── utils/
│   │   └── streamUtils.js     # 流式响应工具
│   └── index.js               # 主入口文件
├── .env                       # 环境变量配置
├── .env.example               # 环境变量配置示例
├── package.json              # 项目配置文件
└── README.md                 # 项目说明文档
```

### 前端结构
```
travel-h5/
├── src/
│   ├── views/                 # 页面组件
│   │   ├── Home.vue          # 首页（城市选择、预算、天数）
│   │   ├── Detail.vue        # 详情页（行程展示）
│   │   ├── Chat.vue          # AI 对话页面
│   │   └── Profile.vue       # 我的页面
│   ├── components/           # 业务组件
│   │   ├── SpotItem.vue      # 景点信息组件
│   │   ├── BudgetTable.vue   # 预算明细组件
│   │   └── ChatBubble.vue    # 聊天气泡组件
│   ├── router/
│   │   └── index.js          # 路由配置
│   ├── stores/
│   │   └── chat.js           # 聊天状态管理
│   ├── utils/
│   │   └── request.js        # HTTP请求工具
│   ├── styles/
│   │   └── common.css        # 公共样式
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── .env                       # 环境变量
├── vite.config.js             # Vite配置
├── package.json              # 依赖配置
└── index.html                # HTML模板
```

## 4. 核心功能

### 4.1 智能旅游规划
- **功能描述**：根据用户输入的目的地、预算和天数，生成详细的行程安排
- **技术实现**：
  - 后端：使用 LangChain 构建提示词，调用大语言模型生成结构化的旅游规划
  - 前端：表单输入 → 提交请求 → 流式接收响应 → 实时渲染行程

### 4.2 AI 旅游咨询
- **功能描述**：提供实时的旅游相关问答服务，支持流式响应
- **技术实现**：
  - 后端：使用 LangChain 构建对话上下文，调用大语言模型生成回复
  - 前端：消息输入 → 提交请求 → 流式接收响应 → 实时显示回复

### 4.3 流式响应
- **功能描述**：实时显示 AI 生成内容，提升用户体验
- **技术实现**：
  - 后端：使用 SSE (Server-Sent Events) 技术发送流式数据
  - 前端：使用 Fetch API 读取流式响应，实现打字机效果

## 5. API 接口

### 5.1 健康检查
- **路径**：`GET /api/health`
- **功能**：检查服务是否正常运行
- **响应**：
  ```json
  {
    "success": true,
    "message": "服务运行正常",
    "timestamp": "2024-01-01T00:00:00Z",
    "modelProvider": "硅基流动"
  }
  ```

### 5.2 智能推荐（流式）
- **路径**：`POST /api/travel/recommend`
- **功能**：根据城市、预算和天数生成旅游规划
- **请求参数**：
  ```json
  {
    "city": "北京",
    "budget": 5000,
    "days": 3
  }
  ```
- **响应格式**：SSE 流式响应
  ```
  data: {"type": "chunk", "content": "正在生成旅游规划..."}
  data: {"type": "complete", "data": {...}}
  ```

### 5.3 AI 对话（流式）
- **路径**：`POST /api/travel/chat`
- **功能**：提供旅游相关的 AI 问答服务
- **请求参数**：
  ```json
  {
    "message": "北京有哪些好吃的？"
  }
  ```
- **响应格式**：SSE 流式响应
  ```
  data: {"type": "chunk", "content": "北京的美食有很多..."}
  data: {"type": "complete", "data": {"success": true, "reply": "北京的美食有很多..."}}
  ```

## 6. 前端功能

### 6.1 首页
- **功能**：城市选择、预算输入、天数选择、热门目的地推荐
- **组件**：城市选择器、数字输入框、天数选择器、按钮、网格布局
- **交互**：填写表单 → 点击"开始规划" → 跳转详情页

### 6.2 详情页
- **功能**：行程概览、每日行程展示、预算明细、温馨提示
- **组件**：导航栏、折叠面板、列表、表格、按钮
- **交互**：查看行程 → 点击"咨询 AI" → 跳转对话页

### 6.3 对话页
- **功能**：AI 聊天、流式响应、快捷问题
- **组件**：导航栏、聊天气泡、输入框、按钮、标签
- **交互**：输入消息 → 发送 → 实时显示 AI 回复

### 6.4 我的页面
- **功能**：个人中心、功能菜单、关于我们
- **组件**：导航栏、列表、图片、对话框
- **交互**：点击菜单 → 显示对应功能

## 7. 安装和运行

### 7.1 后端安装和运行
1. **安装依赖**
   ```bash
   cd server
   npm install
   ```

2. **配置环境变量**
   - 复制 `.env.example` 为 `.env`
   - 填写 API 密钥和模型配置

3. **启动服务**
   ```bash
   npm run dev
   ```
   - 服务运行在 `http://localhost:3000`

### 7.2 前端安装和运行
1. **安装依赖**
   ```bash
   cd travel-h5
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   - 服务运行在 `http://localhost:5174`

## 8. 特色亮点

1. **智能推荐**：基于大语言模型的智能旅游规划，提供个性化的行程安排
2. **流式响应**：实时显示 AI 生成内容，提升用户体验
3. **多模型支持**：可切换不同的大语言模型提供商
4. **移动端友好**：完全适配手机屏幕，操作便捷
5. **模块化设计**：代码结构清晰，易于维护和扩展
6. **完善的错误处理**：前后端均有完善的错误处理机制
7. **实时 AI 对话**：提供即时的旅游咨询服务

## 9. 技术实现细节

### 9.1 后端实现
- **LangChain 集成**：使用 LangChain.js 构建提示词和对话上下文
- **流式响应**：使用 SSE 技术实现流式数据传输
- **错误处理**：完善的错误捕获和处理机制
- **多模型支持**：通过环境变量配置不同的大模型提供商

### 9.2 前端实现
- **Vue 3 Composition API**：使用最新的 Vue 3 特性
- **Vant UI**：移动端友好的 UI 组件库
- **流式处理**：使用 Fetch API 处理 SSE 流式响应
- **状态管理**：使用 Pinia 管理聊天状态
- **路由管理**：使用 Vue Router 实现页面导航
