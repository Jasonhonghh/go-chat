package gorm

import (
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/response"
	"gochat/internal/model"
	"gochat/internal/service/redis"
	user_status_enums "gochat/pkg/enum/user_info"
	"gochat/pkg/util/random"
	"time"

	"github.com/sirupsen/logrus"
)

type userInfoService struct{}

var UserInfoService = new(userInfoService)

// 判断电话号码是否被注册过
func (u *userInfoService) checkTelephoneExist(telephone string) bool {
	return false
}

// 判断用户是不是管理员
func (u *userInfoService) checkUserIsAdmin(telephone string) int8 {
	return 0
}

// 注册功能
func (u *userInfoService) Register(request request.RegisterRequest) (string, *response.RegisterResponse, int) {
	//查redis，校验验证码
	key := "auth_code_" + request.Telephone
	code, err := redis.GetKey(key)
	if err != nil {
		logrus.Error(err)
	}
	if code != request.SMSCode {
		logrus.Errorf("验证码不正确，请重试")
	}

	//校验电话号码，前端已经校验
	//判断电话号码是否已经被注册过了
	if u.checkTelephoneExist(request.Telephone) {
		logrus.Errorf("手机号码已被注册")
	}

	//未被注册，注册到数据库
	var newUser model.UserInfo
	newUser.Uuid = "U" + random.GetNowAndLenRandomString(11)
	newUser.Telephone = request.Telephone
	newUser.Password = request.Password
	newUser.Nickname = request.Nickname
	newUser.Avatar = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
	newUser.CreatedAt = time.Now()
	newUser.IsAdmin = u.checkUserIsAdmin(newUser.Telephone)
	newUser.Status = user_status_enums.Normal
	res := dao.DB.Create(&newUser)
	if res.Error != nil {
		logrus.Errorf("写入到数据库失败")
	}
	registerRsp := &response.RegisterResponse{
		Uuid:      newUser.Uuid,
		Nickname:  newUser.Nickname,
		Telephone: newUser.Telephone,
		Avatar:    newUser.Avatar,
		Email:     newUser.Email,
		Gender:    newUser.Gender,
		Birthday:  newUser.Birthday,
		Signature: newUser.Signature,
		IsAdmin:   newUser.IsAdmin,
		Status:    newUser.Status,
	}
	year, month, date := newUser.CreatedAt.Date()
	registerRsp.CreatedAt = fmt.Sprintf("%s.%s.%s", year, month, date)
	return "注册成功", registerRsp, 0
}
