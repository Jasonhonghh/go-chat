package gorm

import (
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
)

type userContactService struct{}

var UserContactService userContactService

func (c *userContactService) ApplyContact(req request.ApplyContactRequest) (messsage string, code int) {
	return
}

func (c *userContactService) GetContactList(req request.OwnListRequest) (messsage string, code int, rsp []respond.MyUserListRespond) {
	return
}

func (c *userContactService) LoadMyJoinedGroup(req request.OwnListRequest) (messsage string, code int, rsp []respond.LoadMyJoinedGroupRespond) {
	return
}

func (c *userContactService) GetContactInfo(req request.GetContactInfoRequest) (messsage string, code int, rsp respond.GetContactInfoRespond) {
	return
}

func (c *userContactService) DeleteContact(req request.DeleteContactRequest) (messsage string, code int) {
	return
}

func (c *userContactService) GetNewContactApplyList(req request.OwnListRequest) (messsage string, code int, rsp []respond.NewContactListRespond) {
	return
}
func (c *userContactService) PassContactApply(req request.PassContactApplyRequest) (messsage string, code int) {
	return
}
func (c *userContactService) RejectContactApply(req request.PassContactApplyRequest) (messsage string, code int) {
	return
}
func (c *userContactService) BlackContact(req request.BlackContactRequest) (messsage string, code int) {
	return
}
func (c *userContactService) CancelBlackContact(req request.BlackContactRequest) (messsage string, code int) {
	return
}
func (c *userContactService) GetAddGroupList(req request.AddGroupListRequest) (messsage string, code int) {
	return
}
func (c *userContactService) BlackApply(req request.BlackApplyRequest) (messsage string, code int) {
	return
}
func (c *userContactService) CancelBlackApply(req request.BlackApplyRequest) (messsage string, code int) {
	return
}
