package api

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, hotelHandler *HotelHandler) {
	hotelRoutes := r.Group("/v1/hotel")
	{
		hotelRoutes.GET("/city", hotelHandler.SearchHotelsByCityCode)
		hotelRoutes.GET("/geocode", hotelHandler.SearchHotelsByGeoCode)
		hotelRoutes.GET("/ids", hotelHandler.SearchHotelsByIds)
	}
}
