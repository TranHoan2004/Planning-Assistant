package api

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/user_profile/pkg"
	"go.uber.org/zap"
)

type ProfileHandler struct {
	profileService usecases.IProfileService
	log            *zap.Logger
}

func NewProfileHandler(profileService usecases.IProfileService, log *zap.Logger) *ProfileHandler {
	return &ProfileHandler{
		profileService: profileService,
		log:            log,
	}
}

func NewRequestContext(ctx *gin.Context) (context.Context, context.CancelFunc) {
	baseCtx := ctx.Request.Context()

	// c, _ := context.WithTimeout(baseCtx, config.RequestTimeout*time.Second)
	c, cancel := context.WithTimeout(baseCtx, 5*time.Second)

	// userID := ctx.GetHeader("X-User-ID")
	// c = context.WithValue(c, "userID", userID)

	return c, cancel
}

func (h *ProfileHandler) GetUserProfile(ctx *gin.Context) {
	c, cancel := NewRequestContext(ctx)
	defer cancel()

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "userID is required"})
		return
	}

	profile, err := h.profileService.GetUserProfile(c, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[usecases.UserProfileResponse]{
			StatusCode: http.StatusOK,
			Data:       *profile,
		})
}

func (h *ProfileHandler) GetAll(c *gin.Context) {
	ctx, cancel := NewRequestContext(c)
	defer cancel()

	profiles, err := h.profileService.GetAllUserProfiles(ctx)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK,
		pkg.ApiResponse[[]*usecases.UserProfileResponse]{
			StatusCode: http.StatusOK,
			Data:       profiles,
		})
}

func (h *ProfileHandler) UpdateUserProfileInformation(ctx *gin.Context) {
	c, cancel := NewRequestContext(ctx)
	defer cancel()

	var req usecases.UserProfileInformationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "details": "Invalid request body"})
		return
	}

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "userID is required"})
		return
	}

	updatedCount, err := h.profileService.UpdateUserProfileInformation(c, userID, req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if updatedCount == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Nothing changed"})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[map[string]interface{}]{
			StatusCode: http.StatusOK,
			Data:       map[string]interface{}{"updated_count": updatedCount},
		})
}

func (h *ProfileHandler) UpdateUserProfileAvatar(ctx *gin.Context) {
	c, cancel := NewRequestContext(ctx)
	defer cancel()

	// Lấy userID từ route
	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "userID is required"})
		return
	}

	// Lấy file từ form-data
	file, err := ctx.FormFile("avatar")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "avatar file is required"})
		return
	}

	// Gọi service để update avatar
	updatedCount, err := h.profileService.UpdateUserProfileAvatar(c, userID, file)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, pkg.ApiResponse[int64]{
		StatusCode: http.StatusOK,
		Data:       updatedCount,
	})
}

func (h *ProfileHandler) AddUserProfile(ctx *gin.Context) {
	c, cancel := NewRequestContext(ctx)
	defer cancel()

	var req usecases.UserProfileRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "details": "Invalid request body"})
		return
	}

	if strings.TrimSpace(req.UserId) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	if strings.TrimSpace(req.FullName) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_fullname is required"})
		return
	}

	insertedID, err := h.profileService.AddUserProfile(c, req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated,
		pkg.ApiResponse[int64]{
			StatusCode: http.StatusCreated,
			Data:       insertedID,
		})
}

func (h *ProfileHandler) GetUserAvatarURL(ctx *gin.Context) {
	c, cancel := NewRequestContext(ctx)
	defer cancel()

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "userID is required"})
		return
	}

	avatarURL, err := h.profileService.GetUserAvatarURL(c, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[map[string]string]{
			StatusCode: http.StatusOK,
			Data:       map[string]string{"avatar_url": avatarURL},
		})
}

func (h *ProfileHandler) HandleMissingUserID(ctx *gin.Context) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"error": `Missing user_id. The URL must be in the format: {api_url}/{user_id}`,
	})
}
