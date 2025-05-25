package gorm

import (
	"encoding/json"
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
	"gochat/internal/log"
	"gochat/internal/model"
	myredis "gochat/internal/service/redis"
	"gochat/pkg/constants"
	"gochat/pkg/enum/contact/contact_status_enum"
	"gochat/pkg/enum/contact/contact_type_enum"
	"gochat/pkg/util/random"
	"time"
)

type groupInfoService struct{}

var GroupInfoService = new(groupInfoService)

func (g *groupInfoService) CreateGroup(request request.CreateGroupRequest) (string, int) {
	//检查用户是否存在
	var user model.UserInfo
	if res := dao.DB.First(&user, request.OwnerId); res.Error != nil {
		return "用户不存在", -1
	}

	//创建群聊
	var group model.GroupInfo
	group.OwnerId = request.OwnerId
	group.Name = request.Name
	group.Notice = request.Notice
	group.AddMode = request.AddMode
	group.Avatar = request.Avatar
	group.Uuid = fmt.Sprintf("G%s", random.GetNowAndLenRandomString(11))

	if res := dao.DB.Create(&group); res.Error != nil {
		return "创建群聊失败", -1
	}

	//添加联系人
	contact := model.UserContact{
		UserId:      request.OwnerId,
		ContactId:   group.Uuid,
		ContactType: 1,
		Status:      0,
		CreatedAt:   time.Now(),
		UpdateAt:    time.Now(),
	}
	if res := dao.DB.Create(&contact); res.Error != nil {
		return "添加群聊联系人失败", -1
	}
	return "创建群聊成功", 0
}

func (g *groupInfoService) GetGroupInfo(request request.GetGroupInfoRequest) (string, int, respond.GetGroupInfoRespond) {
	var group model.GroupInfo
	if res := dao.DB.First(&group, "uuid=?", request.GroupID); res.Error != nil {
		return "群聊不存在", -1, respond.GetGroupInfoRespond{}
	}
	groupInfo := respond.GetGroupInfoRespond{
		Uuid:      group.Uuid,
		Name:      group.Name,
		Notice:    group.Notice,
		MemberCnt: group.MemberCnt,
		OwnerId:   group.OwnerId,
		AddMode:   group.AddMode,
		Status:    group.Status,
		Avatar:    group.Avatar,
	}
	if group.DeletedAt.Valid {
		groupInfo.IsDeleted = true
	}
	return "获取群聊信息成功", 0, groupInfo
}

func (g *groupInfoService) LoadMyGroup(req request.OwnListRequest) (message string, code int, groupsinfo []respond.LoadMyGroupRespond) {
	rspString, err := myredis.GetKeyNilIsErr("contact_mygroup_list_" + req.OwnerId)
	if err != nil { //no info cached with redis
		var grouplist []model.GroupInfo
		if res := dao.DB.Order("created_at DESC").Where("owner_id = ?", req.OwnerId).Find(&grouplist); res.Error != nil {
			log.LOG.Error(res.Error)
			return "DB error", -1, nil
		}
		groupListRespond := []respond.LoadMyGroupRespond{}
		log.LOG.Infof("found %d groups", len(grouplist))
		for _, group := range grouplist {
			groupListRespond = append(groupListRespond,
				respond.LoadMyGroupRespond{
					GroupId:   group.Uuid,
					GroupName: group.Name,
					Avatar:    group.Avatar,
				},
			)
		}
		log.LOG.Info(groupListRespond)
		rspString, err := json.Marshal(groupListRespond)
		if err != nil {
			log.LOG.Error(err)
		}
		myredis.SetKeyEx("contact_mygroup_list_"+req.OwnerId, string(rspString), int64(time.Minute*constants.REDIS_TIMEOUT))
		return "success", 0, groupListRespond
	}
	var groupListRsp []respond.LoadMyGroupRespond
	if err := json.Unmarshal([]byte(rspString), &groupListRsp); err != nil {
		log.LOG.Info(string(rspString))
		log.LOG.Error(err)
	}
	return "success", 0, groupListRsp
}

func (g *groupInfoService) CheckGroupAddMode(req request.CheckGroupAddModeRequest) (message string, code int, addMode int8) {
	var res model.GroupInfo
	if err := dao.DB.Find(&res, "group_id=?", req.GroupId); err != nil {
		log.LOG.Error(err)
		return fmt.Sprintf("group %s doesn't exist", req.GroupId), -1, 0
	}
	return "success", 0, res.AddMode
}
func (g *groupInfoService) EnterGroupDirectly(req request.EnterGroupDirectlyRequest) (message string, code int) {
	var res model.GroupInfo
	if err := dao.DB.First(&res, "group_id=?", req.OwnerId); err != nil {
		log.LOG.Error(err)
		return fmt.Sprintf("group %s doesn't exist", req.OwnerId), -1
	}
	var members []string
	if err := json.Unmarshal(res.Members, &members); err != nil {
		log.LOG.Error(err)
		return "unmarshal failed", -1
	}
	members = append(members, req.ContactId)
	data, err := json.Marshal(members)
	if err != nil {
		log.LOG.Error(err)
		return "marshal failed", -1
	}
	res.Members = data
	res.MemberCnt++
	if res := dao.DB.Save(&res); res.Error != nil {
		log.LOG.Error(err)
		return "update faied", -1
	}
	newContact := model.UserContact{
		UserId:      req.ContactId,
		ContactId:   req.OwnerId,
		ContactType: contact_type_enum.GROUP,
		Status:      contact_status_enum.NORMAL,
		CreatedAt:   time.Now(),
		UpdateAt:    time.Now(),
	}
	if res := dao.DB.Create(&newContact); res.Error != nil {
		log.LOG.Error(err)
		return "create failed", -1
	}
	return "success", 0
}
func (g *groupInfoService) LeaveGroup(req request.LeaveGroupRequest) (message string, code int) {
	//remove user from group
	var groupInfo model.GroupInfo
	if res := dao.DB.First(&groupInfo, "group_id=?", req.GroupId); res.Error != nil {
		log.LOG.Error(res.Error)
		return fmt.Sprintf("group %s doesn't exist", req.GroupId), -1
	}
	var members []string
	if err := json.Unmarshal(groupInfo.Members, &members); err != nil {
		log.LOG.Error(err)
		return "unmarshal failed", -1
	}
	for i, member := range members {
		if member == req.UserId {
			members = append(members[:i], members[i+1:]...)
			return
		}
	}
	data, err := json.Marshal(members)
	if err != nil {
		log.LOG.Error(err)
		return "marshal failed", -1
	}
	groupInfo.Members = data
	groupInfo.MemberCnt--
	if res := dao.DB.Save(&groupInfo); res.Error != nil {
		log.LOG.Error(res.Error)
		return "save failed", -1
	}
	//delete contact from user,automatically get a soft delete
	var contact model.UserContact
	if res := dao.DB.First(&contact, "user_id=?", req.UserId, "contact_id=?", req.GroupId); res.Error != nil {
		log.LOG.Error(res.Error)
		return "no contact relation found", -1
	}
	return "success", 0
}
func (g *groupInfoService) DismissGroup(req request.DismissGroupRequest) (message string, code int) {
	//soft delete group
	dao.DB.Where("group_id=?", req.GroupId).Delete(&model.GroupInfo{})
	//find cotact
	var contacts []model.UserContact
	dao.DB.Find(&contacts, "contact_id=?", req.GroupId)
	for contact := range contacts {
		dao.DB.Delete(&contact)
	}
	return "success", 0
}
func (g *groupInfoService) GetGroupMemberList(req request.GetGroupMemberListRequest) (message string, code int, rsp []respond.GetGroupMemberListRespond) {
	var group model.GroupInfo
	if res := dao.DB.First(&group, "group_id=?", req.GroupId); res.Error != nil {
		log.LOG.Error(res.Error)
		return fmt.Sprintf("group %s not found", req.GroupId), -1, nil
	}
	members := []string{}
	if err := json.Unmarshal(group.Members, &members); err != nil {
		log.LOG.Error(err)
		return "unmarshal failed", 0, nil
	}
	for _, member := range members {
		var userinfo model.UserInfo
		if res := dao.DB.First(&userinfo, "user_id=?", member); res.Error != nil {
			log.LOG.Error(res.Error)
			break
		}
		rsp = append(rsp, respond.GetGroupMemberListRespond{
			Avatar:   userinfo.Avatar,
			Nickname: userinfo.Nickname,
			UserId:   member,
		})
	}
	return "success", 0, rsp
}
func (g *groupInfoService) RemoveGroupMembers(req request.RemoveGroupMembersRequest) (message string, code int) {
	//equals to some members leave group
	for _, userID := range req.UuidList {
		if userID == req.OwnerId {
			break //owner cannot be removed
		}
		r := request.LeaveGroupRequest{
			GroupId: req.GroupId,
			UserId:  userID,
		}
		m, _ := g.LeaveGroup(r)
		log.LOG.Infof("user %s leave group %s :%s", userID, req.GroupId, m)
	}

	return "success", 0
}
