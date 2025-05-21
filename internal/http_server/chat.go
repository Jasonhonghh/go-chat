package http_server

import (
	v1 "gochat/api/v1"

	"github.com/gin-gonic/gin"
)

var GE *gin.Engine

func init() {
	GE = gin.Default()

	// cors
	GE.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.JSON(200, gin.H{})
			c.Abort()
			return
		}
		c.Next()
	})

	// Register routes
	addRegisterLoginApi()
	addGroupApi()
	addContactApi()
	addSessionApi()
	addMessageApi()
	addFileApi()
	addWssApi()
	addUserApi()
}

func addRegisterLoginApi() {
	GE.POST("/register", v1.Register)
	GE.POST("/login", v1.Login)
	GE.POST("/user/sendSmsCode", v1.SendSmsCode)
	GE.POST("/user/smsLogin", v1.SmsLogin)
}
func addGroupApi() {
	GE.POST("/group/create", v1.CreateGroup)
	GE.GET("/group/getGroupInfo", v1.GetGroupInfo)
	GE.POST("/group/loadMyGroup", v1.LoadMyGroup)
	GE.POST("/group/checkGroupAddMode", v1.CheckGroupAddMode)
	GE.POST("/group/enterGroupDirectly", v1.EnterGroupDirectly)
	GE.POST("/group/leaveGroup", v1.LeaveGroup)
	GE.POST("group/dismissGroup", v1.DismissGroup)
	GE.POST("group/getGroupMemberList", v1.GetGroupMemberList)
	GE.POST("group/removeGroupMembers", v1.RemoveGroupMembers)
}
func addContactApi() {
	GE.POST("/contact/applyContact", v1.ApplyContact)
	GE.POST("/contact/getUserList", v1.GetUserList)
	GE.POST("/contact/loadMyJoinedGroup", v1.LoadMyJoinedGroup)
	GE.POST("/contact/getContactInfo", v1.GetContactInfo)
	GE.POST("contact/deleteContact", v1.DeleteContact)
	GE.POST("/contact/getNewContactList", v1.GetNewContactList)
	GE.POST("/contact/passContactApply", v1.PassContactApply)
	GE.POST("/contact/rejectContactApply", v1.RejectContactApply)
	GE.POST("/contact/blackContact", v1.BlackContact)
	GE.POST("/contact/cancelBlackContact", v1.CancelBlackContact)
	GE.POST("/contact/getAddGroupList", v1.GetAddGroupList)
	GE.POST("/contact/blackApply", v1.BlackApply)
	GE.POST("/contact/cancelBlackApply", v1.CancelBlackApply)
}
func addSessionApi() {
	GE.POST("/session/openSession", v1.OpenSession)
	GE.POST("session/getUserSessionList", v1.GetUserSessionList)
	GE.POST("session/getGroupSessionList", v1.GetGroupSessionList)
	GE.POST("session/deleteSession", v1.DeleteSession)
	GE.POST("session/checkOpenSessionAllowed", v1.CheckOpenSessionAllowed)
}
func addMessageApi() {
	GE.POST("/message/getMessageList", v1.GetMessageList)
	GE.POST("/message/getGroupMessageList", v1.GetGroupMessageList)
}
func addFileApi() {
	GE.POST("message/uploadAvatar", v1.UploadAvatar)
	GE.POST("message/uploadFile", v1.UploadFile)
}
func addWssApi() {
	GE.GET("/wss", v1.WsLogin)
	GE.POST("user/wssLogout", v1.WsLogout)
}
func addUserApi() {
	GE.GET("/user/getUserInfo", v1.GetUserInfo)
	GE.POST("/user/updateUserInfo", v1.UpdateUserInfo)
}
