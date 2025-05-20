package response

type LoadMyGroupResponse struct {
	GroupId   string `json:"uuid"`
	GroupName string `json:"name"`
	Avatar    string `json:"avatar"`
}
