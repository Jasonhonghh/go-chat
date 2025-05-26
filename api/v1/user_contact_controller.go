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
func GetContactList(c *gin.Context) {
	var req request.OwnListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, contactList := gorm.UserContactService.GetContactList(req)
	JsonBack(c, message, code, contactList)
}
func LoadMyJoinedGroup(c *gin.Context) {
	var req request.OwnListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, groupList := gorm.UserContactService.LoadMyJoinedGroup(req)
	JsonBack(c, message, code, groupList)
}
func GetContactInfo(c *gin.Context) {
	var req request.GetContactInfoRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, contactInfo := gorm.UserContactService.GetContactInfo(req)
	JsonBack(c, message, code, contactInfo)
}
func DeleteContact(c *gin.Context) {
	var req request.DeleteContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.DeleteContact(req)
	JsonBack(c, message, code, nil)
}
func GetNewContactApplyList(c *gin.Context) {
	var req request.OwnListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, contactApplyList := gorm.UserContactService.GetNewContactApplyList(req)
	JsonBack(c, message, code, contactApplyList)
}
func PassContactApply(c *gin.Context) {
	var req request.PassContactApplyRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.PassContactApply(req)
	JsonBack(c, message, code, nil)
}
func RejectContactApply(c *gin.Context) {
	var req request.PassContactApplyRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.RejectContactApply(req)
	JsonBack(c, message, code, nil)
}
func BlackContact(c *gin.Context) {
	var req request.BlackContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.BlackContact(req)
	JsonBack(c, message, code, nil)
}
func CancelBlackContact(c *gin.Context) {
	var req request.BlackContactRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.CancelBlackContact(req)
	JsonBack(c, message, code, nil)
}
func GetAddGroupList(c *gin.Context) {
	var req request.AddGroupListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.GetAddGroupList(req)
	JsonBack(c, message, code, nil)
}
func BlackApply(c *gin.Context) {
	var req request.BlackApplyRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.BlackApply(req)
	JsonBack(c, message, code, nil)
}
func CancelBlackApply(c *gin.Context) {
	var req request.BlackApplyRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code := gorm.UserContactService.CancelBlackApply(req)
	JsonBack(c, message, code, nil)
}
