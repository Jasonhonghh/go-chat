# Go-Chat

一个基于 Next.js 和 Go 构建的现代化聊天应用，UI 风格参考 Discord。

![Go-Chat Preview](public/images/preview.png)

## 特性

- 💬 实时消息收发
- 📱 响应式设计，支持移动端和桌面端
- 🔒 账号密码登录与手机验证码登录
- 🎨 Discord 风格的 UI 界面
- 🌙 内置暗色主题
- 📎 支持多种类型消息（文本、图片、文件等）
- 🔍 消息搜索功能
- 📞 支持音视频通话
- 🤖 AI 助手功能

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript, TailwindCSS
- **后端**: Go, Gin, WebSocket
- **状态管理**: Zustand
- **实时通信**: WebSocket, WebRTC

## 快速开始

### 前端

确保你已安装 Node.js 16+ 和 npm。

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 启动生产版本
npm run start
```

### 后端

确保你已安装 Go 1.16+。

```bash
# 进入后端目录
cd server

# 安装依赖
go mod download

# 运行服务器
go run main.go
```

## API 文档

### 认证 API

#### 登录

```
POST /api/login
```

请求体:

```json
{
  "username": "用户名",
  "password": "密码"
}
```

响应:

```json
{
  "token": "JWT令牌",
  "userId": "用户ID"
}
```

#### 发送短信验证码

```
POST /api/send_sms_code
```

请求体:

```json
{
  "phone": "手机号",
  "type": "login | register" 
}
```

响应:

```json
{
  "message": "验证码已发送"
}
```

#### 短信登录

```
POST /api/sms_login
```

请求体:

```json
{
  "phone": "手机号",
  "smsCode": "验证码"
}
```

响应:

```json
{
  "token": "JWT令牌",
  "userId": "用户ID"
}
```

#### 注册

```
POST /api/register
```

请求体:

```json
{
  "username": "用户名",
  "password": "密码",
  "phone": "手机号",
  "smsCode": "验证码"
}
```

响应:

```json
{
  "token": "JWT令牌",
  "userId": "用户ID"
}
```

### 消息 API

#### 获取聊天历史

```
GET /api/messages/{chatId}?page=1&limit=20
```

响应:

```json
{
  "messages": [
    {
      "id": "消息ID",
      "senderId": "发送者ID",
      "content": "消息内容",
      "type": "text | image | file",
      "fileData": {},
      "timestamp": "2023-01-01T12:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### 搜索消息

```
GET /api/messages/search?chatId=123&query=hello
```

响应:

```json
{
  "messages": [
    {
      "id": "消息ID",
      "senderId": "发送者ID",
      "content": "消息内容",
      "type": "text",
      "timestamp": "2023-01-01T12:00:00Z"
    }
  ]
}
```

### 文件 API

#### 上传文件

```
POST /api/files/upload
```

请求体:

```
FormData:
  - file: 文件
  - chatId: 聊天ID
```

响应:

```json
{
  "fileId": "文件ID",
  "url": "文件URL",
  "filename": "文件名",
  "size": 1024,
  "type": "image/jpeg"
}
```

#### 获取文件下载链接

```
GET /api/files/download/{fileId}
```

响应:

```json
{
  "url": "文件下载URL",
  "expires": "2023-01-01T13:00:00Z"
}
```

### AI 助手 API

#### 与 AI 助手聊天

```
POST /api/ai/chat
```

请求体:

```json
{
  "message": "你好，AI",
  "chatId": "123",
  "history": [
    {"role": "user", "content": "之前的消息"},
    {"role": "assistant", "content": "AI的回复"}
  ]
}
```

响应:

```json
{
  "reply": "AI助手的回复",
  "messageId": "消息ID"
}
```

#### 总结聊天内容

```
POST /api/ai/summarize
```

请求体:

```json
{
  "chatId": "123"
}
```

响应:

```json
{
  "summary": "聊天内容总结"
}
```

## WebSocket API

WebSocket 连接地址:

```
ws://localhost:8080/ws?userId={userId}
```

### 消息格式

#### 发送消息

```json
{
  "type": "message",
  "chatId": "聊天ID",
  "message": {
    "content": "消息内容",
    "type": "text | image | file",
    "fileData": {}
  }
}
```

#### 接收消息

```json
{
  "type": "message",
  "chatId": "聊天ID",
  "message": {
    "id": "消息ID",
    "senderId": "发送者ID",
    "content": "消息内容",
    "type": "text | image | file",
    "fileData": {},
    "timestamp": "2023-01-01T12:00:00Z"
  }
}
```

#### 音视频通话信令

```json
{
  "type": "call:offer | call:answer | call:candidate | call:hangup",
  "from": "发起者ID",
  "to": "接收者ID",
  "callType": "audio | video",
  "sdp": "SDP信息(offer/answer时)"
}
```

## 贡献

欢迎提交 Pull Request。对于重大变更，请先提交 Issue 讨论你想要改变的内容。

## 许可证

[MIT](LICENSE)