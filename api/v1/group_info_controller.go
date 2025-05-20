package v1

import (
	"fmt"
	"gochat/internal/dto/request"
	"gochat/internal/log"
	"gochat/internal/service/gorm"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateGroup(c *gin.Context) {
	var req request.CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.LOG.Info(fmt.Sprintf("req: %+v", req))
	message, code := gorm.GroupInfoService.CreateGroup(req)
	JsonBack(c, message, code, nil)
}

func GetGroupInfo(c *gin.Context) {
	var req request.GetGroupInfoRequest
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.LOG.Info(fmt.Sprintf("req: %+v", req))
	message, code, groupInfo := gorm.GroupInfoService.GetGroupInfo(req)
	JsonBack(c, message, code, groupInfo)
}

// get groups owned by an user
func LoadMyGroup(c *gin.Context) {
	var req request.OwnListRequest
	if err := c.BindJSON(&req); err != nil {
		//BindJSON method will automaticaly return 400 error if bindinf failed.
		log.LOG.Error(err)
		return
	}
	log.LOG.Infof("res:%v", req)
	message, code, groupsinfo := gorm.GroupInfoService.LoadMyGroup(req)
	JsonBack(c, message, code, groupsinfo)
}
