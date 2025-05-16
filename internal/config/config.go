package config

import (
	"gochat/internal/log"

	"github.com/spf13/viper"
)

var Config viper.Viper

func init() {
	Config = *viper.New()
	Config.SetConfigName("config")
	Config.SetConfigType("toml")
	Config.AddConfigPath("./configs")
	err := Config.ReadInConfig()
	if err != nil {
		log.LOG.Fatalf("%v", err.Error()) //读取配置文件出错，直接日志报错
	}
}
