package http_server

import (
	v1 "gochat/api/v1"

	"github.com/gin-gonic/gin"
)

var GE *gin.Engine

func init() {
	GE = gin.Default()
	GE.POST("/register", v1.Register)
	GE.POST("/login", v1.Login)
}
