package v1

import (
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
	"gochat/internal/log"
	"gochat/internal/model"
	"gochat/pkg/util/random"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func GetMessageList(c *gin.Context) {
	var req request.GetMessageListRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var msgs []model.Message
	if res := dao.DB.Where("(send_id = ? AND receive_id = ?) OR (send_id = ? AND receive_id = ?)", req.UserOneId, req.UserTwoId, req.UserTwoId, req.UserOneId).
		Order("created_at ASC").Find(&msgs); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "DB error", -1, nil)
		return
	}
	rsp := make([]respond.GetMessageListRespond, 0, len(msgs))
	for _, m := range msgs {
		rsp = append(rsp, respond.GetMessageListRespond{
			SendId:     m.SendId,
			SendName:   m.SendName,
			SendAvatar: m.SendAvatar,
			ReceiveId:  m.ReceiveId,
			Type:       m.Type,
			Content:    m.Content,
			Url:        m.Url,
			FileType:   m.FileType,
			FileName:   m.FileName,
			FileSize:   m.FileSize,
			CreatedAt:  m.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	JsonBack(c, "success", 0, rsp)
}
func GetGroupMessageList(c *gin.Context) {
	var req request.GetGroupMessageListRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	var msgs []model.Message
	if res := dao.DB.Where("receive_id = ?", req.GroupId).Order("created_at ASC").Find(&msgs); res.Error != nil {
		log.LOG.Error(res.Error)
		JsonBack(c, "DB error", -1, nil)
		return
	}
	rsp := make([]respond.GetGroupMessageListRespond, 0, len(msgs))
	for _, m := range msgs {
		rsp = append(rsp, respond.GetGroupMessageListRespond{
			SendId:     m.SendId,
			SendName:   m.SendName,
			SendAvatar: m.SendAvatar,
			ReceiveId:  m.ReceiveId,
			Type:       m.Type,
			Content:    m.Content,
			Url:        m.Url,
			FileType:   m.FileType,
			FileName:   m.FileName,
			FileSize:   m.FileSize,
			CreatedAt:  m.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	JsonBack(c, "success", 0, rsp)
}
func UploadAvatar(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		log.LOG.Error(err)
		JsonBack(c, "file required", -1, nil)
		return
	}
	name := fmt.Sprintf("A%s_%s", random.GetNowAndLenRandomString(6), filepath.Base(file.Filename))
	path := "/static/avatars/" + name
	if err := c.SaveUploadedFile(file, "."+path); err != nil {
		log.LOG.Error(err)
		JsonBack(c, "save failed", -1, nil)
		return
	}
	JsonBack(c, "success", 0, gin.H{"url": path})
}
func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		log.LOG.Error(err)
		JsonBack(c, "file required", -1, nil)
		return
	}
	name := fmt.Sprintf("F%s_%s", random.GetNowAndLenRandomString(6), filepath.Base(file.Filename))
	path := "/static/files/" + name
	if err := c.SaveUploadedFile(file, "."+path); err != nil {
		log.LOG.Error(err)
		JsonBack(c, "save failed", -1, nil)
		return
	}
	JsonBack(c, "success", 0, gin.H{"url": path, "uploaded_at": time.Now().Format("2006-01-02 15:04:05")})
}
