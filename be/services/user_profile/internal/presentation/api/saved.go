package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/user_profile/pkg"
	"go.uber.org/zap"
)

type SavedHandler struct {
	savedService usecases.ISavedService
	log          *zap.Logger
}

func NewSavedHandler(savedService usecases.ISavedService, log *zap.Logger) *SavedHandler {
	return &SavedHandler{
		savedService: savedService,
		log:          log,
	}
}

func (h *SavedHandler) GetSavedHotels(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	savedHotels, err := h.savedService.GetSavedHotels(c, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[[]*usecases.SavedHotelResponse]{
			StatusCode: http.StatusOK,
			Data:       savedHotels,
		})
}

func (h *SavedHandler) AddSavedHotel(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	var req usecases.SavedHotelRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "detail": "Invalid request body"})
		return
	}

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	_, err := h.savedService.AddSavedHotel(c, userID, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(
		http.StatusCreated,
		pkg.ApiResponse[map[string]interface{}]{
			StatusCode: http.StatusCreated,
		})
}

func (h *SavedHandler) RemoveSavedHotel(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	var req usecases.SavedHotelRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "detail": "Invalid request body"})
		return
	}

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	_, err := h.savedService.RemoveSavedHotel(c, userID, req.HotelId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(
		http.StatusOK,
		pkg.ApiResponse[map[string]interface{}]{
			StatusCode: http.StatusOK,
			Data: map[string]interface{}{
				"removed_hotel_id": req.HotelId,
			},
		})
}

func (h *SavedHandler) GetSavedPlacesToGo(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	placeToGo, err := h.savedService.GetSavedPlacesToGo(c, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[[]*usecases.SavedPlaceToGoResponse]{
			StatusCode: http.StatusOK,
			Data:       placeToGo,
		})
}

func (h *SavedHandler) AddSavedPlaceToGo(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	var req usecases.SavedPlaceToGoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "detail": "Invalid request body"})
		return
	}

	userId := ctx.Param("user_id")
	if strings.TrimSpace(userId) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	_, err := h.savedService.AddSavedPlaceToGo(c, userId, req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, pkg.ApiResponse[map[string]interface{}]{
		StatusCode: http.StatusCreated,
	})
}

func (h *SavedHandler) RemoveSavedPlaceToGo(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	var req usecases.SavedPlaceToGoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "detail": "Invalid request body"})
		return
	}

	userId := ctx.Param("user_id")
	if strings.TrimSpace(userId) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	result, err := h.savedService.RemoveSavedPlaceToGo(c, userId, req.PlaceId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, pkg.ApiResponse[map[string]interface{}]{
		StatusCode: http.StatusOK,
		Data: map[string]interface{}{
			"removed_place_id": result,
		},
	})
}

func (h *SavedHandler) GetAllSavedItems(ctx *gin.Context) {
	c, cancle := NewRequestContext(ctx)
	defer cancle()

	userID := ctx.Param("user_id")
	if strings.TrimSpace(userID) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	items, err := h.savedService.GetAllSavedItems(c, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[usecases.AllSavedItemsResponse]{
			StatusCode: http.StatusOK,
			Data:       *items,
		})
}

func (h *SavedHandler) HandleMissingUserID(ctx *gin.Context) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"error": `Missing user_id. The URL must be in the format: {api_url}/{user_id}`,
	})
}
