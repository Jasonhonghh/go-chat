package gorm

import "gochat/internal/dto/request"

type userContactService struct{}

var UserContactService userContactService

func(c *userContactService)ApplyContact(req request.ApplyContactRequest)(messsage string,code int){
	return
}

func(c *userContactService)GetUserList(req request.ApplyContactRequest)(messsage string,code int){
	return
}

func(c *userContactService)LoadMyJoinedGroup(req request.ApplyContactRequest)(messsage string,code int){
	return
}

func(c *userContactService)GetContactInfo(req request.ApplyContactRequest)(messsage string,code int){
	return
}

func(c *userContactService)GetNewContactList(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)PassContactApply(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)RejectContactApply(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)BlackContact(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)CancelBlackContact(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)GetAddGroupList(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)BlackApply(req request.ApplyContactRequest)(messsage string,code int){
	return
}
func(c *userContactService)CancelBlackApply(req request.ApplyContactRequest)(messsage string,code int){
	return
}

