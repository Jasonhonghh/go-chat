package main

import (
	"gochat/internal/config"
	"gochat/internal/http_server"
	"gochat/internal/log"
	"gochat/internal/service/chat"
)

func main() {

	conf := config.Config
	host := conf.GetString("mainConfig.host")
	port := conf.GetString("mainConfig.port")

	log.Init(conf.GetString("logConfig.level"))

	GE := http_server.GE

	go chat.ChatServer.Start()
	if err := GE.Run(host + ":" + port); err != nil {
		log.LOG.Fatal("Failed to start server: ", err)
	}
}
