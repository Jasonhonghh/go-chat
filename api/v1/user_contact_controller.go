package v1

import (
	"gochat/internal/dto/request"

	"gochat/internal/log"
	"gochat/internal/service/gorm"

	"github.com/gin-gonic/gin"
)

func ApplyContact(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.ApplyContact(req)
	JsonBack(c, message, code, nil)
}
func GetUserList(c *gin.Context) {
	var req request.OwnListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService.GetUserList(req)
	JsonBack(c, message, code, userList)
}
func LoadMyJoinedGroup(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService.(req)
	JsonBack(c, message, code, userList)
}
func GetContactInfo(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func DeleteContact(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func GetNewContactList(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func PassContactApply(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func RejectContactApply(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func BlackContact(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func CancelBlackContact(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func GetAddGroupList(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func BlackApply(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
func CancelBlackApply(c *gin.Context) {
	var req request.ApplyContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, userList := gorm.UserContactService(req)
	JsonBack(c, message, code, userList)
}
