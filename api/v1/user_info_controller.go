package v1

import (
	"fmt"
	"gochat/internal/dto/request"
	"gochat/internal/service/gorm"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func Register(c *gin.Context) {
	var registerReq request.RegisterRequest
	if err := c.BindJSON(&registerReq); err == nil {
		logrus.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logrus.Info(fmt.Sprintf("registerReq: %+v", registerReq))
	message, data, code := gorm.UserInfoService.Register(registerReq)
	JsonBack(c, message, code, data)
}

func Login(c *gin.Context) {
	var loginReq request.LoginRequest
	if err := c.BindJSON(&loginReq); err == nil {
		logrus.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logrus.Info(fmt.Sprintf("loginReq: %+v", loginReq))
	message, data, code := gorm.UserInfoService.Login(loginReq)
	JsonBack(c, message, code, data)
}

func GetUserInfo(c *gin.Context) {
	var getUserInfoReq request.GetUserInfoRequest
	if err := c.BindJSON(&getUserInfoReq); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		logrus.Error(err)
		return
	}
	logrus.Info(fmt.Sprintf("getUserInfoReq: %+v", getUserInfoReq))
	message, data, code := gorm.UserInfoService.GetUserInfo(getUserInfoReq)
	JsonBack(c, message, code, data)
}
