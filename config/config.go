package config

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

var Config viper.Viper

func init() {
	Config = *viper.New()
	Config.SetConfigName("config")
	Config.SetConfigType("toml")
	Config.AddConfigPath("../")
	Config.AddConfigPath(".")
	err := Config.ReadInConfig()
	if err != nil {
		logrus.Fatalf(err.Error()) //读取配置文件出错，直接日志报错
	}
}
