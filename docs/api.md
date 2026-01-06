# 接口文档与数据模型

## 概览
- 基于 `Gin` 提供 REST API，WebSocket 用于消息实时传输。
- 数据持久化使用 `MySQL`（`gorm`），缓存与验证码使用 `Redis`。
- 静态资源通过路由提供文件访问：`/static/avatars`、`/static/files`。

## 路由
- 用户
  - POST `/register` 注册。实现位置：`api/v1/user_info_controller.go:15`
  - POST `/login` 密码登录。实现位置：`api/v1/user_info_controller.go:27`
  - POST `/user/sendSmsCode` 发送短信验证码。实现位置：`api/v1/user_info_controller.go:63`
  - POST `/user/smsLogin` 短信登录。实现位置：`api/v1/user_info_controller.go:66`
  - GET `/user/getUserInfo` 获取用户信息。实现位置：`api/v1/user_info_controller.go:39`
  - POST `/user/updateUserInfo` 更新用户信息。实现位置：`api/v1/user_info_controller.go:51`
  - POST `/user/wssLogout` WebSocket登出。实现位置：`api/v1/user_info_controller.go:69`
- 群组
  - POST `/group/create` 创建群。实现位置：`api/v1/group_info_controller.go:13`
  - GET `/group/getGroupInfo` 获取群信息。实现位置：`api/v1/group_info_controller.go:24`
  - POST `/group/loadMyGroup` 获取我创建的群。实现位置：`api/v1/group_info_controller.go:35`
  - POST `/group/checkGroupAddMode` 查询加群方式。实现位置：`api/v1/group_info_controller.go:48`
  - POST `/group/enterGroupDirectly` 直接入群。实现位置：`api/v1/group_info_controller.go:58`
  - POST `/group/leaveGroup` 退群。实现位置：`api/v1/group_info_controller.go:68`
  - POST `/group/dismissGroup` 解散群。实现位置：`api/v1/group_info_controller.go:79`
  - POST `/group/getGroupMemberList` 成员列表。实现位置：`api/v1/group_info_controller.go:89`
  - POST `/group/removeGroupMembers` 移除成员。实现位置：`api/v1/group_info_controller.go:99`
- 联系人
  - POST `/contact/applyContact` 申请好友。实现位置：`api/v1/user_contact_controller.go:12`
  - POST `/contact/getUserList` 我的联系人。实现位置：`api/v1/user_contact_controller.go:23`
  - POST `/contact/loadMyJoinedGroup` 我加入的群。实现位置：`api/v1/user_contact_controller.go:34`
  - POST `/contact/getContactInfo` 联系人详情。实现位置：`api/v1/user_contact_controller.go:45`
  - POST `/contact/deleteContact` 删除联系人。实现位置：`api/v1/user_contact_controller.go:56`
  - POST `/contact/getNewContactList` 新申请列表。实现位置：`api/v1/user_contact_controller.go:67`
  - POST `/contact/passContactApply` 通过申请。实现位置：`api/v1/user_contact_controller.go:78`
  - POST `/contact/rejectContactApply` 拒绝申请。实现位置：`api/v1/user_contact_controller.go:89`
  - POST `/contact/blackContact` 拉黑联系人。实现位置：`api/v1/user_contact_controller.go:100`
  - POST `/contact/cancelBlackContact` 取消拉黑。实现位置：`api/v1/user_contact_controller.go:111`
  - POST `/contact/getAddGroupList` 待加群列表。实现位置：`api/v1/user_contact_controller.go:122`
  - POST `/contact/blackApply` 拉黑申请。实现位置：`api/v1/user_contact_controller.go:133`
  - POST `/contact/cancelBlackApply` 取消拉黑申请。实现位置：`api/v1/user_contact_controller.go:144`
- 会话
  - POST `/session/openSession` 打开会话。实现位置：`api/v1/session_controller.go:5`
  - POST `/session/getUserSessionList` 用户会话列表。实现位置：`api/v1/session_controller.go:8`
  - POST `/session/getGroupSessionList` 群会话列表。实现位置：`api/v1/session_controller.go:10`
  - POST `/session/deleteSession` 删除会话。实现位置：`api/v1/session_controller.go:12`
  - POST `/session/checkOpenSessionAllowed` 检查是否可开会话。实现位置：`api/v1/session_controller.go:14`
- 消息与文件
  - POST `/message/getMessageList` 单聊消息列表。实现位置：`api/v1/message_controller.go:5`
  - POST `/message/getGroupMessageList` 群聊消息列表。实现位置：`api/v1/message_controller.go:7`
  - POST `/message/uploadAvatar` 上传头像。实现位置：`api/v1/message_controller.go:9`
  - POST `/message/uploadFile` 上传文件。实现位置：`api/v1/message_controller.go:11`
- WebSocket
  - GET `/wss?client_id=Uxxxx` 建立连接。实现位置：`api/v1/ws_controller.go:11`

## 数据模型
- 用户：`internal/model/user_info.go:9`
- 群组：`internal/model/group_info.go:9`
- 联系人：`internal/model/user_contact.go:8`
- 申请：`internal/model/contact_apply.go:8`
- 会话：`internal/model/session.go:8`
- 消息：`internal/model/message.go:8`

## 请求/响应DTO
- 注册请求：`internal/dto/request/register_request.go:3`，响应：`internal/dto/respond/register_respond.go:1`
- 登录请求：`internal/dto/request/login_request.go:3`，响应：`internal/dto/respond/login_respond.go:1`
- 获取用户信息请求：`internal/dto/request/get_user_info_request.go:3`，响应：`internal/dto/respond/get_userinfo_respond.go:1`
- 创建群请求：`internal/dto/request/create_group_request.go:3`，群信息响应：`internal/dto/respond/get_groupinfo_respond.go:1`
- 单聊消息列表请求：`internal/dto/request/get_message_list_request.go:3`，响应：`internal/dto/respond/get_message_list_respond.go:1`
- 群聊消息列表请求：`internal/dto/request/get_group_message_list_request.go:3`，响应：`internal/dto/respond/get_group_messagelist_respond.go:1`
- AV信令消息响应：`internal/dto/respond/av_message_respond.go:1`
- 用户会话列表响应：`internal/dto/respond/user_sessionlist_respond.go:1`
- 群会话列表响应：`internal/dto/respond/group_sessionlist_respond.go:1`

## 实现逻辑摘要
- 注册/登录
  - 注册校验验证码 `redis`，写入 `user_info`。实现：`internal/service/gorm/user_info_service.go:36`
  - 登录校验密码并返回用户信息。实现：`internal/service/gorm/user_info_service.go:87`
- 短信验证码与登录
  - 生成6位验证码，存入Redis 5分钟。实现：`api/v1/user_info_controller.go:63`
  - 校验验证码后按手机号查询用户完成登录。实现：`api/v1/user_info_controller.go:66`
- 联系人
  - 申请联系人：写入 `contact_apply` 记录，状态为申请中。实现：`internal/service/gorm/user_contact_service.go:12`
  - 我的联系人：查询 `user_contact` 中类型为用户的记录，补充昵称与头像。实现：`internal/service/gorm/user_contact_service.go:16`
  - 我加入的群：查询 `user_contact` 中类型为群聊的记录，补充群名与头像。实现：`internal/service/gorm/user_contact_service.go:20`
  - 联系人详情：按前缀区分用户/群，分别读取 `user_info` 或 `group_info`。实现：`internal/service/gorm/user_contact_service.go:24`
  - 删除联系人：删除 `user_contact` 记录。实现：`internal/service/gorm/user_contact_service.go:28`
  - 新申请列表：查询目标为当前用户的 `contact_apply`，补充申请人信息。实现：`internal/service/gorm/user_contact_service.go:32`
  - 通过/拒绝申请：更新 `contact_apply` 状态，并在通过时创建双向 `user_contact`。实现：`internal/service/gorm/user_contact_service.go:35`、`internal/service/gorm/user_contact_service.go:38`
  - 拉黑/取消拉黑联系人：更新 `user_contact.status`。实现：`internal/service/gorm/user_contact_service.go:41`、`internal/service/gorm/user_contact_service.go:44`
  - 群待加列表：查询目标为群的 `contact_apply`。实现：`internal/service/gorm/user_contact_service.go:47`
  - 拉黑/取消拉黑申请：更新 `contact_apply.status`。实现：`internal/service/gorm/user_contact_service.go:50`、`internal/service/gorm/user_contact_service.go:53`
- WebSocket
  - 连接建立与读写协程。实现：`internal/service/chat/client.go:41`、`internal/service/chat/client.go:58`
  - 文本消息入库并向收/发双方推送。实现：`internal/service/chat/server.go:89`
  - AV信令消息转发与条件入库。实现：`internal/service/chat/server.go:165`
- 消息查询
  - 单聊：两人互相的消息合并查询。实现：`api/v1/message_controller.go:5`
  - 群聊：按群ID查询消息。实现：`api/v1/message_controller.go:7`
- 文件上传
  - 头像/文件保存至静态目录并返回URL。实现：`api/v1/message_controller.go:9`、`api/v1/message_controller.go:11`
  - 静态路由注册。实现：`internal/http_server/chat.go:24`
- 会话
  - 打开会话：若存在则复用，否则创建并填充名称/头像。实现：`api/v1/session_controller.go:5`
  - 用户/群会话列表：基于ID前缀区分查询。实现：`api/v1/session_controller.go:8`、`api/v1/session_controller.go:10`
  - 删除会话：软删除。实现：`api/v1/session_controller.go:12`
  - 检查是否允许开会话：验证联系人关系。实现：`api/v1/session_controller.go:14`

## 配置
- 主机与端口：`configs/config.toml:5`
- MySQL/Redis：`configs/config.toml:9`、`configs/config.toml:17`
- 静态目录：`configs/config.toml:37`
