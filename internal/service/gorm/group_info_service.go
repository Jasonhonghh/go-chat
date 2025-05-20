package gorm

import (
	"encoding/json"
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/response"
	"gochat/internal/log"
	"gochat/internal/model"
	myredis "gochat/internal/service/redis"
	"gochat/pkg/constants"
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

func (g *groupInfoService) LoadMyGroup(req request.OwnListRequest) (message string, code int, groupsinfo []response.LoadMyGroupResponse) {
	rspString, err := myredis.GetKeyNilIsErr("contact_mygroup_list_" + req.OwnerId)
	if err != nil { //no info cached with redis
		var grouplist []model.GroupInfo
		if res := dao.DB.Order("created_at DESC").Where("owner_id = ?", req.OwnerId).Find(&grouplist); res.Error != nil {
			log.LOG.Error(res.Error)
			return "DB error", -1, nil
		}
		groupListResponse := []response.LoadMyGroupResponse{}
		log.LOG.Infof("found %d groups", len(grouplist))
		for _, group := range grouplist {
			groupListResponse = append(groupListResponse,
				response.LoadMyGroupResponse{
					GroupId:   group.Uuid,
					GroupName: group.Name,
					Avatar:    group.Avatar,
				},
			)
		}
		log.LOG.Info(groupListResponse)
		rspString, err := json.Marshal(groupListResponse)
		if err != nil {
			log.LOG.Error(err)
		}
		myredis.SetKeyEx("contact_mygroup_list_"+req.OwnerId, string(rspString), int64(time.Minute*constants.REDIS_TIMEOUT))
		return "success", 0, groupListResponse
	}
	var groupListRsp []response.LoadMyGroupResponse
	if err := json.Unmarshal([]byte(rspString), &groupListRsp); err != nil {
		log.LOG.Info(string(rspString))
		log.LOG.Error(err)
	}
	return "success", 0, groupListRsp
}
