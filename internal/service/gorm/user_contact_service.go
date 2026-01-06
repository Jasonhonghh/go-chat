package gorm

import (
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
	"gochat/internal/log"
	"gochat/internal/model"
	"time"
)

type userContactService struct{}

var UserContactService userContactService

func (c *userContactService) ApplyContact(req request.ApplyContactRequest) (messsage string, code int) {
	apply := model.ContactApply{
		Uuid:        fmt.Sprintf("CA%s", time.Now().UnixNano()),
		UserId:      fmt.Sprintf("%d", req.UserId),
		ContactId:   fmt.Sprintf("%d", req.FriendId),
		ContactType: 0,
		Status:      0,
		Message:     req.Message,
		LastApplyAt: time.Now(),
	}
	if res := dao.DB.Create(&apply); res.Error != nil {
		log.LOG.Error(res.Error)
		return "申请失败", -1
	}
	return "申请成功", 0
}

func (c *userContactService) GetContactList(req request.OwnListRequest) (messsage string, code int, rsp []respond.MyUserListRespond) {
	var contacts []model.UserContact
	if res := dao.DB.Where("user_id = ? AND contact_type = ? AND status = 0", req.OwnerId, 0).Find(&contacts); res.Error != nil {
		log.LOG.Error(res.Error)
		return "DB error", -1, nil
	}
	for _, ct := range contacts {
		var u model.UserInfo
		if res := dao.DB.First(&u, "uuid = ?", ct.ContactId); res.Error != nil {
			log.LOG.Error(res.Error)
			continue
		}
		rsp = append(rsp, respond.MyUserListRespond{
			UserId:   u.Uuid,
			UserName: u.Nickname,
			Avatar:   u.Avatar,
		})
	}
	return "success", 0, rsp
}

func (c *userContactService) LoadMyJoinedGroup(req request.OwnListRequest) (messsage string, code int, rsp []respond.LoadMyJoinedGroupRespond) {
	var contacts []model.UserContact
	if res := dao.DB.Where("user_id = ? AND contact_type = ? AND status = 0", req.OwnerId, 1).Find(&contacts); res.Error != nil {
		log.LOG.Error(res.Error)
		return "DB error", -1, nil
	}
	for _, ct := range contacts {
		var g model.GroupInfo
		if res := dao.DB.First(&g, "uuid = ?", ct.ContactId); res.Error != nil {
			log.LOG.Error(res.Error)
			continue
		}
		rsp = append(rsp, respond.LoadMyJoinedGroupRespond{
			GroupId:   g.Uuid,
			GroupName: g.Name,
			Avatar:    g.Avatar,
		})
	}
	return "success", 0, rsp
}

func (c *userContactService) GetContactInfo(req request.GetContactInfoRequest) (messsage string, code int, rsp respond.GetContactInfoRespond) {
	if len(req.ContactId) == 0 {
		return "invalid id", -1, respond.GetContactInfoRespond{}
	}
	if req.ContactId[0] == 'U' {
		var u model.UserInfo
		if res := dao.DB.First(&u, "uuid = ?", req.ContactId); res.Error != nil {
			log.LOG.Error(res.Error)
			return "用户不存在", -1, respond.GetContactInfoRespond{}
		}
		return "success", 0, respond.GetContactInfoRespond{
			ContactId:        u.Uuid,
			ContactName:      u.Nickname,
			ContactAvatar:    u.Avatar,
			ContactPhone:     u.Telephone,
			ContactEmail:     u.Email,
			ContactGender:    u.Gender,
			ContactSignature: u.Signature,
			ContactBirthday:  u.Birthday,
		}
	}
	var g model.GroupInfo
	if res := dao.DB.First(&g, "uuid = ?", req.ContactId); res.Error != nil {
		log.LOG.Error(res.Error)
		return "群聊不存在", -1, respond.GetContactInfoRespond{}
	}
	return "success", 0, respond.GetContactInfoRespond{
		ContactId:        g.Uuid,
		ContactName:      g.Name,
		ContactAvatar:    g.Avatar,
		ContactNotice:    g.Notice,
		ContactMembers:   g.Members,
		ContactMemberCnt: g.MemberCnt,
		ContactOwnerId:   g.OwnerId,
		ContactAddMode:   g.AddMode,
	}
}

func (c *userContactService) DeleteContact(req request.DeleteContactRequest) (messsage string, code int) {
	if res := dao.DB.Where("user_id = ? AND contact_id = ?", req.OwnerId, req.ContactId).Delete(&model.UserContact{}); res.Error != nil {
		log.LOG.Error(res.Error)
		return "删除失败", -1
	}
	return "删除成功", 0
}

func (c *userContactService) GetNewContactApplyList(req request.OwnListRequest) (messsage string, code int, rsp []respond.NewContactListRespond) {
	var applies []model.ContactApply
	if res := dao.DB.Where("contact_id = ? AND status = 0", req.OwnerId).Order("last_apply_at DESC").Find(&applies); res.Error != nil {
		log.LOG.Error(res.Error)
		return "DB error", -1, nil
	}
	for _, a := range applies {
		var u model.UserInfo
		if res := dao.DB.First(&u, "uuid = ?", a.UserId); res.Error != nil {
			log.LOG.Error(res.Error)
			continue
		}
		rsp = append(rsp, respond.NewContactListRespond{
			ContactId:     u.Uuid,
			ContactName:   u.Nickname,
			ContactAvatar: u.Avatar,
			Message:       a.Message,
		})
	}
	return "success", 0, rsp
}
func (c *userContactService) PassContactApply(req request.PassContactApplyRequest) (messsage string, code int) {
	var a model.ContactApply
	if res := dao.DB.Where("user_id = ? AND contact_id = ? AND status = 0", req.ContactId, req.OwnerId).First(&a); res.Error != nil || res.RowsAffected == 0 {
		return "申请不存在", -1
	}
	a.Status = 1
	if res := dao.DB.Save(&a); res.Error != nil {
		log.LOG.Error(res.Error)
		return "更新失败", -1
	}
	c1 := model.UserContact{
		UserId:      req.OwnerId,
		ContactId:   req.ContactId,
		ContactType: 0,
		Status:      0,
		CreatedAt:   time.Now(),
		UpdateAt:    time.Now(),
	}
	c2 := model.UserContact{
		UserId:      req.ContactId,
		ContactId:   req.OwnerId,
		ContactType: 0,
		Status:      0,
		CreatedAt:   time.Now(),
		UpdateAt:    time.Now(),
	}
	dao.DB.Create(&c1)
	dao.DB.Create(&c2)
	return "通过成功", 0
}
func (c *userContactService) RejectContactApply(req request.PassContactApplyRequest) (messsage string, code int) {
	if res := dao.DB.Model(&model.ContactApply{}).Where("user_id = ? AND contact_id = ? AND status = 0", req.ContactId, req.OwnerId).
		Update("status", 2); res.Error != nil {
		log.LOG.Error(res.Error)
		return "更新失败", -1
	}
	return "已拒绝", 0
}
func (c *userContactService) BlackContact(req request.BlackContactRequest) (messsage string, code int) {
	if res := dao.DB.Model(&model.UserContact{}).Where("user_id = ? AND contact_id = ?", req.OwnerId, req.ContactId).
		Update("status", 1); res.Error != nil {
		log.LOG.Error(res.Error)
		return "拉黑失败", -1
	}
	return "拉黑成功", 0
}
func (c *userContactService) CancelBlackContact(req request.BlackContactRequest) (messsage string, code int) {
	if res := dao.DB.Model(&model.UserContact{}).Where("user_id = ? AND contact_id = ?", req.OwnerId, req.ContactId).
		Update("status", 0); res.Error != nil {
		log.LOG.Error(res.Error)
		return "取消失败", -1
	}
	return "取消成功", 0
}
func (c *userContactService) GetAddGroupList(req request.AddGroupListRequest) (messsage string, code int) {
	var applies []model.ContactApply
	if res := dao.DB.Where("contact_id = ? AND contact_type = ? AND status = 0", req.GroupId, 1).Find(&applies); res.Error != nil {
		log.LOG.Error(res.Error)
		return "DB error", -1
	}
	return "success", 0
}
func (c *userContactService) BlackApply(req request.BlackApplyRequest) (messsage string, code int) {
	if res := dao.DB.Model(&model.ContactApply{}).Where("user_id = ? AND contact_id = ?", req.ContactId, req.OwnerId).
		Update("status", 3); res.Error != nil {
		log.LOG.Error(res.Error)
		return "拉黑失败", -1
	}
	return "拉黑成功", 0
}
func (c *userContactService) CancelBlackApply(req request.BlackApplyRequest) (messsage string, code int) {
	if res := dao.DB.Model(&model.ContactApply{}).Where("user_id = ? AND contact_id = ?", req.ContactId, req.OwnerId).
		Update("status", 0); res.Error != nil {
		log.LOG.Error(res.Error)
		return "取消失败", -1
	}
	return "取消成功", 0
}
