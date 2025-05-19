package chat

import (
	"encoding/json"
	"fmt"
	"gochat/internal/dao"
	"gochat/internal/dto/request"
	"gochat/internal/dto/response"
	"gochat/internal/log"
	"gochat/internal/model"
	myredis "gochat/internal/service/redis"
	"gochat/pkg/constants"
	"gochat/pkg/enum/message/message_type_enum"
	"gochat/pkg/util/random"
	"strings"
	"sync"
	"time"
)

type Server struct {
	Clients  map[string]*Client
	mutex    sync.Mutex
	Transmit chan []byte
	Login    chan *Client
	Logout   chan *Client
}

var ChatServer *Server

func init() {
	if ChatServer == nil {
		ChatServer = &Server{
			Clients:  make(map[string]*Client),
			Transmit: make(chan []byte, constants.CHANNEL_SIZE),
			Login:    make(chan *Client, constants.CHANNEL_SIZE),
			Logout:   make(chan *Client, constants.CHANNEL_SIZE),
		}
	}
}

// 将https://127.0.0.1:8000/static/xxx 转为 /static/xxx
func normalizePath(path string) string {
	// 查找 "/static/" 的位置
	if path == "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" {
		return path
	}
	staticIndex := strings.Index(path, "/static/")
	if staticIndex < 0 {
		log.LOG.Errorf("path %s not start with /static/", path)
		return path
	}
	// 返回从 "/static/" 开始的部分
	return path[staticIndex:]
}

func (s *Server) Start() {
	defer s.Close()
	for {
		select {
		case client := <-s.Login:
			{
				s.mutex.Lock()
				s.Clients[client.Uuid] = client
				s.mutex.Unlock()
				log.LOG.Infof("client %s logined", client.Uuid)
				err := client.Conn.WriteMessage(1, []byte("欢迎来到go-chat聊天服务器，亲爱的用户！"))
				if err != nil {
					log.LOG.Errorf("client %s write message error: %v", client.Uuid, err)
				}
			}
		case client := <-s.Logout:
			{
				s.mutex.Lock()
				delete(s.Clients, client.Uuid)
				s.mutex.Unlock()
				log.LOG.Infof("client %s logout", client.Uuid)
				err := client.Conn.WriteMessage(1, []byte("亲爱的用户，您已成功退出登录！"))
				if err != nil {
					log.LOG.Errorf("client %s write message error: %v", client.Uuid, err)
				}
			}
		case message := <-s.Transmit:
			{
				var chatMessageReq request.ChatMessageRequest
				if err := json.Unmarshal(message, &chatMessageReq); err != nil {
					log.LOG.Errorf("反序列化错误: %v", err)
					continue
				}
				if chatMessageReq.Type == message_type_enum.Text {
					message := model.Message{
						Uuid:       fmt.Sprintf("M%s", random.GetNowAndLenRandomString(11)),
						SessionId:  chatMessageReq.SessionId,
						Type:       chatMessageReq.Type,
						Content:    chatMessageReq.Content,
						Url:        "",
						SendId:     chatMessageReq.SendId,
						SendName:   chatMessageReq.SendName,
						SendAvatar: normalizePath(chatMessageReq.SendAvatar),
						ReceiveId:  chatMessageReq.ReceiveId,
						FileType:   "",
						FileName:   "",
						FileSize:   "0B",
						Status:     1,
						CreatedAt:  time.Now(),
						AVdata:     "",
					}
					if res := dao.DB.Create(&message); res.Error != nil {
						log.LOG.Errorf("存储消息失败: %v", res.Error)
					}

					// 发送消息
					if message.ReceiveId[0] == 'U' {
						messageRsp := response.GetMessageListResponse{
							SendId:     message.SendId,
							SendName:   message.SendName,
							SendAvatar: chatMessageReq.SendAvatar,
							ReceiveId:  message.ReceiveId,
							Type:       message.Type,
							Content:    message.Content,
							Url:        message.Url,
							FileSize:   message.FileSize,
							FileName:   message.FileName,
							FileType:   message.FileType,
							CreatedAt:  message.CreatedAt.Format("2006-01-02 15:04:05"),
						}
						jsonData, err := json.Marshal(messageRsp)
						if err != nil {
							log.LOG.Errorf("序列化消息失败: %v", err)
							continue
						}
						log.LOG.Infof("发送消息: %v", messageRsp)
						log.LOG.Infof("序列化为json: %s", string(jsonData))

						var messageBack = &MessageBack{
							Message: jsonData,
							Uuid:    message.Uuid,
						}
						s.mutex.Lock()
						if receiveClient, ok := s.Clients[message.ReceiveId]; ok {
							receiveClient.SendBack <- messageBack
						}
						sendClient := s.Clients[message.SendId]
						sendClient.SendBack <- messageBack //消息回显
						s.mutex.Unlock()

						var rspString string
						rspString, err = myredis.GetKeyNilIsErr("message_list_" + message.SendId + "_" + message.ReceiveId)
						if err == nil {
							var rsp []response.GetMessageListResponse
							if err := json.Unmarshal([]byte(rspString), &rsp); err != nil {
								log.LOG.Errorf("反序列化错误: %v", err)
							}
							rsp = append(rsp, messageRsp)
							rspByte, err := json.Marshal(rsp)
							if err != nil {
								log.LOG.Errorf("序列化错误: %v", err)
							}
							expireDuration := time.Minute * time.Duration(constants.REDIS_TIMEOUT)
							myredis.SetKeyEx("message_list_"+message.SendId+"_"+message.ReceiveId, string(rspByte), int64(expireDuration))
						} else {
							log.LOG.Errorf("获取redis数据失败: %v", err)
						}
					}
				}
				if chatMessageReq.Type == message_type_enum.AudioOrVideo {
					var avData request.AvDataRequest
					if err := json.Unmarshal([]byte(chatMessageReq.AVdata), &avData); err != nil {
						log.LOG.Errorf("反序列化错误: %v", err)
						continue
					}
					message := model.Message{
						Uuid:       fmt.Sprintf("M%s", random.GetNowAndLenRandomString(11)),
						SessionId:  chatMessageReq.SessionId,
						Type:       chatMessageReq.Type,
						Content:    chatMessageReq.Content,
						Url:        "",
						SendId:     chatMessageReq.SendId,
						SendName:   chatMessageReq.SendName,
						SendAvatar: normalizePath(chatMessageReq.SendAvatar),
						ReceiveId:  chatMessageReq.ReceiveId,
						FileType:   "",
						FileName:   "",
						FileSize:   "0B",
						Status:     1,
						CreatedAt:  time.Now(),
						AVdata:     chatMessageReq.AVdata,
					}
					if avData.MessageID == "PROXY" && avData.Type == "start_call" ||
						avData.Type == "receive_call" || avData.Type == "reject_call" {
						message.SendAvatar = normalizePath(message.SendAvatar)
						if res := dao.DB.Create(&message); res.Error != nil {
							log.LOG.Errorf("存储消息失败: %v", res.Error)
						}
					}
					if chatMessageReq.ReceiveId[0] == 'U' {
						messageRsp := response.AVMessageResponse{
							SendId:     message.SendId,
							SendName:   message.SendName,
							SendAvatar: chatMessageReq.SendAvatar,
							ReceiveId:  message.ReceiveId,
							Type:       message.Type,
							Content:    message.Content,
							Url:        message.Url,
							FileSize:   message.FileSize,
							FileName:   message.FileName,
							FileType:   message.FileType,
							CreatedAt:  message.CreatedAt.Format("2006-01-02 15:04:05"),
							AVdata:     message.AVdata,
						}
						jsonData, err := json.Marshal(messageRsp)
						if err != nil {
							log.LOG.Errorf("序列化消息失败: %v", err)
							continue
						}
						var messageBack = &MessageBack{
							Message: jsonData,
							Uuid:    message.Uuid,
						}
						s.mutex.Lock()
						if receiveClient, ok := s.Clients[message.ReceiveId]; ok {
							receiveClient.SendBack <- messageBack //发送给接收者
						}
						//注意这个消息不能回显。
						s.mutex.Unlock()
					}
				}
			}
		}
	}
}

func (s *Server) Close() {
	close(s.Login)
	close(s.Logout)
	close(s.Transmit)
}

func (s *Server) SendClientToLogin(client *Client) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Login <- client
	log.LOG.Infof("client %s logining", client.Uuid)
}
func (s *Server) SendClientToLogout(client *Client) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Logout <- client
	log.LOG.Infof("client %s logout", client.Uuid)
}
func (s *Server) SendClientToTransmit(message []byte) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.Transmit <- message
}
func (s *Server) Remove(uuid string) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	delete(s.Clients, uuid)
}
