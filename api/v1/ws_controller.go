package v1

import (
	"gochat/internal/log"
	"gochat/internal/service/chat"
	"net/http"

	"github.com/gin-gonic/gin"
)

func WsLogin(c *gin.Context) {
	clientId := c.Query("client_id")
	if clientId == "" {
		log.LOG.Error("client_id is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    http.StatusBadRequest,
			"message": "client_id is empty",
		})
		return
	}
	chat.NewClientInit(c,clientId)
}
