package request

type ApplyContactRequest struct {
	UserId int `json:"user_id"`
	FriendId int `json:"friend_id"`
	Message string `json:"message"`
}