package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/accommodation/pkg"
	"go.uber.org/zap"
)

type HotelHandler struct {
	hotelService usecases.IHotelService
	log          *zap.Logger
}

func NewHotelHandler(hotelService usecases.IHotelService, log *zap.Logger) *HotelHandler {
	return &HotelHandler{
		hotelService: hotelService,
		log:          log,
	}
}

func (h *HotelHandler) SearchHotelsByCityCode(ctx *gin.Context) {
	var params pkg.SearchHotelsByCityCodeParams
	if err := ctx.ShouldBindQuery(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.log.Info("SearchParams", zap.Any("params", params))

	hotels, err := h.hotelService.SearchHotelsByCityCode(params.CityCode)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[[]usecases.HotelResponse]{
			StatusCode: http.StatusOK,
			Data:       hotels,
		})
}

func (h *HotelHandler) SearchHotelsByGeoCode(ctx *gin.Context) {
	var params pkg.SearchHotelsByGeoCodeParams
	if err := ctx.ShouldBindQuery(&params); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hotels, err := h.hotelService.SearchHotelsByGeoCode(params.Latitude, params.Longitude)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[[]usecases.HotelResponse]{
			StatusCode: http.StatusOK,
			Data:       hotels,
		})
}

func (h *HotelHandler) SearchHotelsByIds(ctx *gin.Context) {
	idsString := ctx.Query("hotelIds")

	ids := strings.Split(idsString, ",")
	if len(ids) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "hotelIds is required"})
		return
	}

	hotels, err := h.hotelService.SearchHotelsByIds(ids)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	ctx.JSON(http.StatusOK,
		pkg.ApiResponse[[]usecases.HotelResponse]{
			StatusCode: http.StatusOK,
			Data:       hotels,
		})
}
