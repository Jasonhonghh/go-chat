package request

type RegisterRequest struct {
	Telephone string `json:"telephone"`
	Password  string `json:"password"`
	Nickname  string `json:"nickname"`
	SMSCode   string `json:"sms_code"`
}
