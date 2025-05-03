package v1

import "logrus"

func ApplyContact(c *gin.Context) {
	var applyContactRequest ApplyContactRequest
	if err := c.ShouldBindJSON(&applyContactRequest); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	logrus.Infof("applyContactRequest: %v", applyContactRequest)
	message,code,data:=gorm.ContactInfoService.ApplyContact(applyContactRequest)
	JsonBack(message,code,data)	
}