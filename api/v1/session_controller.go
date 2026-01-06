package v1

import (
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
	"gochat/internal/log"
	"gochat/internal/model"
	"gochat/pkg/util/random"
	"strings"

	"github.com/gin-gonic/gin"
)

func OpenSession(c *gin.Context) {
	var req request.OpenSessionRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var s model.Session
	if res := dao.DB.Where("(send_id = ? AND receive_id = ?) OR (send_id = ? AND receive_id = ?)", req.SendId, req.ReceiveId, req.ReceiveId, req.SendId).First(&s); res.Error == nil && res.RowsAffected > 0 {
		JsonBack(c, "success", 0, gin.H{"session_id": s.Uuid})
		return
	}
	var name string
	var avatar string
	if strings.HasPrefix(req.ReceiveId, "G") {
		var g model.GroupInfo
		if res := dao.DB.First(&g, "uuid = ?", req.ReceiveId); res.Error == nil {
			name = g.Name
			avatar = g.Avatar
		}
	} else {
		var u model.UserInfo
		if res := dao.DB.First(&u, "uuid = ?", req.ReceiveId); res.Error == nil {
			name = u.Nickname
			avatar = u.Avatar
		}
	}
	newSession := model.Session{
		Uuid:        "S" + random.GetNowAndLenRandomString(11),
		SendId:      req.SendId,
		ReceiveId:   req.ReceiveId,
		ReceiveName: name,
		Avatar:      avatar,
	}
	if res := dao.DB.Create(&newSession); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "create failed", -1, nil)
		return
	}
	JsonBack(c, "success", 0, gin.H{"session_id": newSession.Uuid})
}
func GetUserSessionList(c *gin.Context) {
	var req request.GetUserInfoListRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var sessions []model.Session
	if res := dao.DB.Where("(send_id = ? AND receive_id LIKE 'U%') OR (receive_id = ? AND send_id LIKE 'U%')", req.OwnerId, req.OwnerId).Find(&sessions); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "DB error", -1, nil)
		return
	}
	rsp := make([]respond.UserSessionListRespond, 0, len(sessions))
	for _, s := range sessions {
		otherId := s.ReceiveId
		if s.ReceiveId == req.OwnerId {
			otherId = s.SendId
		}
		rsp = append(rsp, respond.UserSessionListRespond{
			SessionId: s.Uuid,
			Avatar:    s.Avatar,
			UserId:    otherId,
			Username:  s.ReceiveName,
		})
	}
	JsonBack(c, "success", 0, rsp)
}
func GetGroupSessionList(c *gin.Context) {
	var req request.GetUserInfoListRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var sessions []model.Session
	if res := dao.DB.Where("send_id = ? AND receive_id LIKE 'G%'", req.OwnerId).Find(&sessions); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "DB error", -1, nil)
		return
	}
	rsp := make([]respond.GroupSessionListRespond, 0, len(sessions))
	for _, s := range sessions {
		rsp = append(rsp, respond.GroupSessionListRespond{
			SessionId: s.Uuid,
			GroupName: s.ReceiveName,
			GroupId:   s.ReceiveId,
			Avatar:    s.Avatar,
		})
	}
	JsonBack(c, "success", 0, rsp)
}
func DeleteSession(c *gin.Context) {
	var req request.DeleteSessionRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	if res := dao.DB.Where("uuid = ?", req.SessionId).Delete(&model.Session{}); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "delete failed", -1, nil)
		return
	}
	JsonBack(c, "success", 0, nil)
}
func CheckOpenSessionAllowed(c *gin.Context) {
	var req request.GetCurContactListInChatRoomRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var contact model.UserContact
	if res := dao.DB.First(&contact, "user_id = ? AND contact_id = ?", req.OwnerId, req.ContactId); res.Error != nil || res.RowsAffected == 0 {
		JsonBack(c, "not allowed", -1, nil)
		return
	}
	JsonBack(c, "allowed", 0, nil)
}
