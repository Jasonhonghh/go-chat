package v1

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func JsonBack(c *gin.Context, message string, ret int, data interface{}) {
	if ret == 0 {
		if data != nil {
			c.JSON(http.StatusOK, gin.H{
				"code": 200,
				"msg":  message,
				"data": data,
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code": 200,
				"msg":  message,
			})
		}
	} else if ret == -2 {
		c.JSON(http.StatusOK, gin.H{
			"code": 400,
			"msg":  message,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"code": ret,
			"msg":  message,
		})
	}
}
