# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] 20250516

### Next Version Plan
- 下个小版本的规划

### Added

- 新增功能。

### Changed

- 现有功能的优化或调整。

### Fixed

- 修复的 Bug。

### Removed

- 废弃的功能或代码。

---
## [0.0.4] 20250520

### Next Version Plan
- 下个小版本的规划

### Added

- 添加用户信息更新接口。`updateuserinfo`。
- add user's group infomation loading api. `loadmygroup`. test with a problem that success with no info.

### Changed

- 现有功能的优化或调整。

### Fixed

- 修复的 Bug。

### Removed

- 废弃的功能或代码。

---
## [0.0.3] 20250519

### Next Version Plan
- 测试wss的文本消息收发功能；
- 音视频通话设置；

### Added 

- 添加wss连接建立；文本消息收发和回显功能；
- 添加avData消息支持，供音视频通话设置；

---

## [0.0.2] 20250517

### Next Version Plan
- 前端构建wss升级请求，后端新建wss连接功能，测试wss连接。

### Added

- Postman中添加- 测试`/register、/login、/user/getuserinfo、/group/create、/group/getgroupinfo`的测试用例。

### Fixed

- 去除changelog中冗余和错误的部分，之后严格根据实际情况进行更新。
- 修复GET请求的表单绑定方法和结构体标签。
- 修改获取用户信息和群组信息的接口名称。
- 测试`/register、/login、/user/getuserinfo、/group/create、/group/getgroupinfo`基本功能，修复Gorm查询时的错误。
---

## [0.0.1] 20250516
### Next Version Plan
- 测试所有API，修复changelog版本功能，新增wss连接功能。

### Added

- 添加 `air`实现代码热重载。
- 添加`start.sh`快速配置环境。更换环境之后，只需要执行`start.sh`即可。

### Fixed

- 修复log系统。

---

## [0.0.0] - 2025-04-24

### Added

- 添加注册接口。`/register`:校验验证码，检查用户是否存在，注册用户。
- 添加密码登录接口。`/login`:检查用户是否存在，校验密码。
- 添加用户信息获取接口。`/user/info`:获取用户信息。
- 添加群组创建接口。`/group/create`:创建群组。
- 添加群组信息获取接口。`/group/info`:获取群组信息。
- 添加联系人添加接口。 `/contacts/apply`:添加联系人。