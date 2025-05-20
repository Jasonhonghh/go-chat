package v1

import (
	"fmt"
	"gochat/internal/dto/request"
	"gochat/internal/service/gorm"

	"net/http"

	"gochat/internal/log"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var registerReq request.RegisterRequest
	if err := c.BindJSON(&registerReq); err != nil {
		log.LOG.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.LOG.Info(fmt.Sprintf("registerReq: %+v", registerReq))
	message, data, code := gorm.UserInfoService.Register(registerReq)
	JsonBack(c, message, code, data)
}

func Login(c *gin.Context) {
	var loginReq request.LoginRequest
	if err := c.BindJSON(&loginReq); err != nil {
		log.LOG.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.LOG.Info(fmt.Sprintf("loginReq: %+v", loginReq))
	message, data, code := gorm.UserInfoService.Login(loginReq)
	JsonBack(c, message, code, data)
}

func GetUserInfo(c *gin.Context) {
	var getUserInfoReq request.GetUserInfoRequest
	if err := c.Bind(&getUserInfoReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.LOG.Error(err)
		return
	}
	log.LOG.Info(fmt.Sprintf("getUserInfoReq: %+v", getUserInfoReq))
	message, data, code := gorm.UserInfoService.GetUserInfo(getUserInfoReq)
	JsonBack(c, message, code, data)
}

func UpdateUserInfo(c *gin.Context) {
	var updateUserInfoReq request.UpdateUserInfoRequest
	if err := c.BindJSON(&updateUserInfoReq); err != nil {
		//BindJso解析错误，会自动返回400错误
		log.LOG.Error(err)
		return
	}
	log.LOG.Info(fmt.Sprintf("updateUserInfoReq: %+v", updateUserInfoReq))
	message, code := gorm.UserInfoService.UpdateUserInfo(updateUserInfoReq)
	JsonBack(c, message, code, nil)
}