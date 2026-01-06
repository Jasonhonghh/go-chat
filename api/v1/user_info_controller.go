package v1

import (
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/respond"
	"gochat/internal/model"
	"gochat/internal/service/chat"
	"gochat/internal/service/gorm"
	"gochat/internal/service/redis"
	"gochat/pkg/util/random"
	"time"

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

func SendSmsCode(c *gin.Context) {
	var req request.SendSmsCodeRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	code := fmt.Sprintf("%06d", random.GetRandomInt(6))
	redis.SetKeyEx("auth_code_"+req.Telephone, code, int64(time.Minute*5))
	JsonBack(c, "发送成功", 0, gin.H{"expire": 300})
}
func SmsLogin(c *gin.Context) {
	var req request.SmsLoginRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	key := "auth_code_" + req.Telephone
	val, err := redis.GetKey(key)
	if err != nil || val != req.SmsCode {
		JsonBack(c, "验证码错误", -1, nil)
		return
	}
	var user model.UserInfo
	res := dao.DB.First(&user, "telephone = ?", req.Telephone)
	if res.Error != nil || res.RowsAffected == 0 {
		JsonBack(c, "用户不存在", -1, nil)
		return
	}
	loginRsp := &respond.LoginRespond{
		Uuid:      user.Uuid,
		Nickname:  user.Nickname,
		Telephone: user.Telephone,
		Avatar:    user.Avatar,
		Email:     user.Email,
		Gender:    user.Gender,
		Birthday:  user.Birthday,
		Signature: user.Signature,
		IsAdmin:   user.IsAdmin,
		Status:    user.Status,
	}
	year, month, date := user.CreatedAt.Date()
	loginRsp.CreatedAt = fmt.Sprintf("%d.%d.%d", year, month, date)
	JsonBack(c, "登录成功", 0, loginRsp)
}
func WsLogout(c *gin.Context) {
	var req request.WsLogoutRequest
	if err := c.BindJSON(&req); err != nil {
		log.LOG.Error(err)
		return
	}
	if client, ok := chat.ChatServer.Clients[req.OwnerId]; ok {
		chat.ChatServer.SendClientToLogout(client)
		JsonBack(c, "退出成功", 0, nil)
		return
	}
	JsonBack(c, "未找到连接", -1, nil)
}
