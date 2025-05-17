package gorm

import (
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/response"
	"gochat/internal/model"
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

func (g *groupInfoService) GetGroupInfo(request request.GetGroupInfoRequest) (string, int, response.GetGroupInfoResponse) {
	var group model.GroupInfo
	if res := dao.DB.First(&group, "uuid=?", request.GroupID); res.Error != nil {
		return "群聊不存在", -1, response.GetGroupInfoResponse{}
	}
	groupInfo := response.GetGroupInfoResponse{
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
