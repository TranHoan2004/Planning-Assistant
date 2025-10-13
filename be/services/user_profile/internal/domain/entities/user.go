package entities

type User struct {
	UserId   string `bson:"user_id" json:"user_id"`
	Fullname string `bson:"user_fullname" json:"user_fullname"`
	Avatar   string `bson:"user_avatar" json:"user_avatar"`
}
