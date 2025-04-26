package http_server

import (
	"github.com/gin-gonic/gin"
	"gochat/api/v1"
)

var GE *gin.Engine

func init() {
	GE = gin.Default()
	GE.POST("/register", v1.Register)
}
