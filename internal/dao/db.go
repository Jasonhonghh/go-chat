package dao

import (
	"fmt"
	"gochat/internal/config"
	"gochat/internal/model"

	"gochat/internal/log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {

	conf := config.Config
	host := conf.GetString("mysqlConfig.host")
	port := conf.GetString("mysqlConfig.port")
	user := conf.GetString("mysqlConfig.user")
	password := conf.GetString("mysqlConfig.password")
	database := conf.GetString("mysqlConfig.databaseName")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, database)
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.LOG.Fatalf(err.Error())
	}
	err = DB.AutoMigrate(&model.ContactApply{}, &model.Message{}, &model.GroupInfo{}, &model.GroupInfo{}, &model.UserInfo{}, &model.Session{}, &model.UserContact{})
	if err != nil {
		log.LOG.Fatalf(err.Error())
	}
}
