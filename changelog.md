# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- 新增功能。

### Changed

- 现有功能的优化或调整。

### Fixed

- 修复的 Bug。

### Removed

- 废弃的功能或代码。

---

## [0.0.1] 20250616
下个版本规划：测试所有API，修复changelog版本功能，新增wss连接功能。

### Added

- 添加 `air`实现代码热重载。
- 添加`start.sh`快速配置环境。更换环境之后，只需要执行`start.sh`即可。

### Changed

- 现有功能的优化或调整。

### Fixed

- 修复log系统。

### Removed

- 废弃的功能或代码。

---

---

## [0.0.0] - 2025-04-24

### Added

- 添加注册接口。`/register`:校验验证码，检查用户是否存在，注册用户。
- 添加密码登录接口。`/login`:检查用户是否存在，校验密码。
- 添加用户信息获取接口。`/user/info`:获取用户信息。
- 添加群组创建接口。`/group/create`:创建群组。
- 添加群组信息获取接口。`/group/info`:获取群组信息。
- 添加群组成员添加接口。`/group/add`:添加群组成员。
- 添加联系人添加接口。 `/contacts/apply`:添加联系人。
- 添加联系人信息获取接口。`/contacts/info`:获取联系人信息。
- 处理联系人添加请求。`/contacts/pass`:通过联系人添加请求。
- 处理联系人添加请求。`/contacts/reject`:拒绝联系人添加请求。
- 添加会话创建接口。`/session/create`:创建会话。
- 添加获取用户会话列表。`/session/list`:获取会话列表。
- 添加会话信息获取接口。`/session/info`:获取会话信息。
- 获取消息列表接口。`/message/getMessage`:获取消息列表。
- 添加发送消息接口。`/wss`:通过WebSocket发送消息。

---

## [1.0.0] - 2024-03-20

### Added

- 项目初始化，实现核心功能 X。
- 添加用户登录模块。

### Fixed

- 修复文件上传时的内存泄漏问题。

