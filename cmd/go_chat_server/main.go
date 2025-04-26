package main

import (
	"github.com/sirupsen/logrus"
	"gochat/internal/config"
	"gochat/internal/http_server"
)

func main() {

	conf := config.Config
	host := conf.GetString("mainConfig.host")
	port := conf.GetString("mainConfig.port")

	GE := http_server.GE

	if err := GE.Run(host + ":" + port); err != nil {
		logrus.Fatalf(err.Error())
	}
}
