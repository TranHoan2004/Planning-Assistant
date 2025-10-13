package usecases

import (
	"context"
	"mime/multipart"
)

type IProfileService interface {
	GetUserProfile(ctx context.Context, userID string) (*UserProfileResponse, error)
	UpdateUserProfileInformation(ctx context.Context, userID string, profile UserProfileInformationRequest) (int64, error)
	UpdateUserProfileAvatar(ctx context.Context, userID string, avatar *multipart.FileHeader) (int64, error)
	AddUserProfile(ctx context.Context, profile UserProfileRequest) (int64, error)
	GetAllUserProfiles(ctx context.Context) ([]*UserProfileResponse, error)
	IsExist(ctx context.Context, userID string) (bool, error)
	GetUserAvatarURL(ctx context.Context, userID string) (string, error)
}

type UserProfileInformationRequest struct {
	UserId   string `json:"user_id"`
	FullName string `json:"user_fullname"`
}

type UserProfileAvatarRequest struct {
	AvatarURL string `json:"user_avatar"`
}

type UserProfileRequest struct {
	UserId   string `json:"user_id"`
	FullName string `json:"user_fullname"`
	Avatar   string `json:"user_avatar"`
}

type UserProfileResponse struct {
	UserId   string `json:"user_id"`
	FullName string `json:"user_fullname"`
	Avatar   string `json:"user_avatar"`
}
