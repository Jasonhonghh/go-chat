package redis

import (
	"gochat/internal/config"

	"gochat/internal/log"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client

func init() {
	conf := config.Config
	host := conf.GetString("redisConfig.host")
	port := conf.GetString("redisConfig.port")
	password := conf.GetString("redisConfig.password")
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     host + ":" + port, // Redis 服务器地址和端口
		Password: password,          // Redis 服务器密码（如果有）
		DB:       0,                 // 使用默认数据库
	})
}

func SetKey(key string, value string) {
	err := RedisClient.Set(RedisClient.Context(), key, value, 0).Err()
	if err != nil {
		log.LOG.Errorf("写入到redis失败")
	}
}

func GetKey(key string) (string, error) {
	return RedisClient.Get(RedisClient.Context(), key).Result()
}
