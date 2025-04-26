package v1

import (
	"fmt"
	"gochat/internal/dto/request"
	"gochat/internal/service/gorm"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func Register(c *gin.Context) {
	var registerReq request.RegisterRequest
	if err := c.BindJSON(&registerReq); err == nil {
		logrus.Error(err)
	}
	logrus.Info(fmt.Sprintf("registerReq: %+v", registerReq))
	message, data, code := gorm.UserInfoService.Register(registerReq)
	JsonBack(c, message, code, data)
}
