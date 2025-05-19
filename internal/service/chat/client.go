package chat

import (
	"gochat/internal/config"
	"gochat/internal/dao"
	"gochat/internal/log"
	"gochat/internal/model"
	"gochat/pkg/constants"
	"gochat/pkg/enum/message/message_status_enum"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type MessageBack struct {
	Message []byte
	Uuid    string
}

type Client struct {
	Conn     *websocket.Conn
	Uuid     string
	SendTo   chan []byte
	SendBack chan *MessageBack
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  2048,
	WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (c *Client) Read() {
	log.LOG.Infof("client %s read go routine start", c.Uuid)
	for {
		_, jsonMessage, err := c.Conn.ReadMessage()
		if err != nil {
			log.LOG.Errorf("client %s read message error: %v", c.Uuid, err)
			break
		} else {
			log.LOG.Infof("client %s read message: %s", c.Uuid, jsonMessage)
			// 处理消息
			// 这里可以根据业务需求进行处理，比如存储到数据库等
			// 发送消息到 SendTo 通道
			c.SendTo <- jsonMessage
		}
	}
}
func (c *Client) Write() {
	log.LOG.Infof("client %s write go routine start", c.Uuid)
	for messageBack := range c.SendBack {
		err := c.Conn.WriteMessage(websocket.TextMessage, messageBack.Message)
		if err != nil {
			log.LOG.Errorf("client %s write message error: %v", c.Uuid, err)
			break
		}
		if res := dao.DB.Model(&model.Message{}).Where("uuid=?", messageBack.Uuid).Update("status", message_status_enum.Sent); res.Error != nil {
			log.LOG.Errorf("client %s update message status error: %v", c.Uuid, res.Error)
		} else {
			log.LOG.Infof("client %s write message success", c.Uuid)
		}
	}
}

func NewClientInit(c *gin.Context, clientId string) {
	conf := config.Config
	messageMode := conf.GetString("chanConfig.messageMode")
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.LOG.Errorf("websocket upgrade error: %v", err)
	}
	client := &Client{
		Conn:     conn,
		Uuid:     clientId,
		SendTo:   make(chan []byte, constants.CHANNEL_SIZE),
		SendBack: make(chan *MessageBack, constants.CHANNEL_SIZE),
	}
	if messageMode == "channel" {
		ChatServer.SendClientToLogin(client)
	}
	ChatServer.SendClientToLogin(client)

	go client.Read()
	go client.Write()
	log.LOG.Infof("client %s connected", clientId)
}
