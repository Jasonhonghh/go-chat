package main

import (
	"gochat/internal/config"
	"gochat/internal/http_server"
	"gochat/internal/log"
)

func main() {

	conf := config.Config
	host := conf.GetString("mainConfig.host")
	port := conf.GetString("mainConfig.port")

	log.Init(conf.GetString("logConfig.level"))

	GE := http_server.GE

	if err := GE.Run(host + ":" + port); err != nil {
		log.LOG.Fatal("Failed to start server: ", err)
	}
}
