package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/entities"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/domain/repositories"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/config"
	"go.uber.org/zap"
)

type ProfileService struct {
	repo       repositories.UserRepository
	gcsService *GCSService
	log        *zap.Logger
	cfg        *config.Config
}

const (
	MaxAvatarSize = 5 // 5MB
)

var AcceptedAvatarTypes = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
}

var AcceptedMimeTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/jpg":  true,
}

var _ usecases.IProfileService = (*ProfileService)(nil)

func NewProfileService(repo repositories.UserRepository, log *zap.Logger, gcs *GCSService, cfg *config.Config) *ProfileService {
	return &ProfileService{
		repo:       repo,
		log:        log,
		gcsService: gcs,
		cfg:        cfg,
	}
}

func (u *ProfileService) GetUserProfile(ctx context.Context, userID string) (*usecases.UserProfileResponse, error) {
	user, err := u.repo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
	}
	return &usecases.UserProfileResponse{
		UserId:   user.UserId,
		FullName: user.Fullname,
		Avatar:   user.Avatar,
	}, nil
}

func (u *ProfileService) UpdateUserProfileInformation(ctx context.Context, userID string, profile usecases.UserProfileInformationRequest) (int64, error) {
	updateData := map[string]interface{}{
		"user_fullname": profile.FullName,
	}

	exist, _ := u.IsExist(ctx, userID)

	if !exist {
		return 0, fmt.Errorf("user with ID %s does not exist", userID)
	}

	if profile.FullName == "" {
		return 0, fmt.Errorf("full name cannot be empty")
	}

	updatedCount, err := u.repo.UpdateByID(ctx, userID, updateData)
	if err != nil {
		return 0, err
	}
	return updatedCount, nil
}

func (u *ProfileService) UpdateUserProfileAvatar(ctx context.Context, userID string, file *multipart.FileHeader) (int64, error) {
	// Validate file
	if file == nil {
		return 0, fmt.Errorf("avatar file is required")
	}

	// kiểm tra dung lượng
	if file.Size > MaxAvatarSize*1024*1024 {
		return 0, fmt.Errorf("file size exceeds %dMB", MaxAvatarSize)
	}

	// kiểm tra extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !AcceptedAvatarTypes[ext] {
		return 0, fmt.Errorf("unsupported file type: %s", ext)
	}

	src, err := file.Open()
	if err != nil {
		return 0, fmt.Errorf("cannot open uploaded file: %w", err)
	}
	defer src.Close()

	buf := make([]byte, 512)
	n, _ := src.Read(buf)
	mimeType := http.DetectContentType(buf[:n])

	src.Seek(0, io.SeekStart)

	if !isAllowedMimeType(mimeType) {
		return 0, fmt.Errorf("unsupported MIME type: %s", mimeType)
	}

	cloudPath := "avatars/" + userID + ext
	isExist, err := u.gcsService.IsAvatarExists(ctx, cloudPath)
	if err != nil {
		return 0, fmt.Errorf("failed to check if avatar exists: %w", err)
	}

	if isExist {
		if err := u.gcsService.DeleteAvatar(ctx, cloudPath); err != nil {
			return 0, fmt.Errorf("failed to delete existing avatar: %w", err)
		}
	}

	// Lưu file vào disk / cloud
	saveUrl, err := u.gcsService.UploadAvatar(ctx, cloudPath, src)
	if err != nil {
		return 0, fmt.Errorf("failed to upload avatar: %w", err)
	}

	// Update DB
	updateData := map[string]interface{}{
		"user_avatar": saveUrl,
	}

	updatedCount, err := u.repo.UpdateByID(ctx, userID, updateData)
	if err != nil {
		return 0, err
	}

	return updatedCount, nil
}

func (u *ProfileService) GetAllUserProfiles(ctx context.Context) ([]*usecases.UserProfileResponse, error) {
	users, err := u.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}
	var profiles []*usecases.UserProfileResponse
	for _, user := range users {
		profiles = append(profiles, &usecases.UserProfileResponse{
			UserId:   user.UserId,
			FullName: user.Fullname,
			Avatar:   user.Avatar,
		})
	}
	return profiles, nil
}

func (u *ProfileService) AddUserProfile(ctx context.Context, profile usecases.UserProfileRequest) (int64, error) {
	user := &entities.User{
		UserId:   profile.UserId,
		Fullname: profile.FullName,
		Avatar:   profile.Avatar,
	}

	exist, _ := u.IsExist(ctx, profile.UserId)

	if exist {
		return 0, fmt.Errorf("user with ID %s already exists", profile.UserId)
	}

	if user.Avatar == "" {
		user.Avatar = u.cfg.DefaultAvatarURL
	}

	return u.repo.InsertOne(ctx, user)
}

func (u *ProfileService) IsExist(ctx context.Context, userID string) (bool, error) {
	user, err := u.repo.FindByID(ctx, userID)
	if err != nil {
		return false, err
	}
	return user != nil, nil
}

func isAllowedMimeType(mimeType string) bool {
	mimeType = strings.TrimSpace(strings.ToLower(mimeType))

	_, ok := AcceptedMimeTypes[mimeType]
	return ok
}

func (u *ProfileService) GetUserAvatarURL(ctx context.Context, userID string) (string, error) {
	user, err := u.repo.FindByID(ctx, userID)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", fmt.Errorf("user with ID %s not found", userID)
	}
	return user.Avatar, nil
}
