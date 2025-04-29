# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- 新功能或 API 接口。
### Changed
- 现有功能的优化或调整。
### Fixed
- 修复的 Bug。
### Removed
- 废弃的功能或代码。

---
## [Unreleased] - 2025-04-24
### Added
- 添加注册接口。`/register`:校验验证码，检查用户是否存在，注册用户。
- 添加密码登录接口。`/login`:检查用户是否存在，校验密码。
- 添加用户信息获取接口。`/user/info`:获取用户信息。

- 添加群组创建接口。`/group/create`:创建群组。
- 添加群组信息获取接口。`/group/info`:获取群组信息。
- 添加群组成员添加接口。`/group/add`:添加群组成员。

- 添加好友申请接口。`/friend/add`:发送好友申请。
- 添加好友申请处理接口。`/friend/handle`:处理好友申请。

- 添加消息发送接口。`/message/send`:发送消息。
- 添加消息接收接口。`/message/receive`:接收消息。

---

## [1.0.0] - 2024-03-20
### Added
- 项目初始化，实现核心功能 X。
- 添加用户登录模块。
### Fixed
- 修复文件上传时的内存泄漏问题。