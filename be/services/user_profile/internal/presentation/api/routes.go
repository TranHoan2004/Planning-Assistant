package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/middlewares"
)

func RegisterRoutes(r *gin.Engine, profileHandler *ProfileHandler, savedHandler *SavedHandler) {
	v1 := r.Group("/v1")

	profileRoutes := v1.Group("/profile")
	{
		profileRoutes.POST("/register", profileHandler.AddUserProfile)

		profileRoutes.Use(middlewares.AuthMiddleware())

		profileRoutes.GET("/:user_id", profileHandler.GetUserProfile)
		profileRoutes.GET("/avatar/:user_id", profileHandler.GetUserAvatarURL)
		profileRoutes.PUT("/update-information/:user_id", profileHandler.UpdateUserProfileInformation)
		profileRoutes.PUT("/update-avatar/:user_id", profileHandler.UpdateUserProfileAvatar)

		profileRoutes.GET("/", profileHandler.HandleMissingUserID)
		profileRoutes.GET("/avatar/", profileHandler.HandleMissingUserID)
		profileRoutes.PUT("/update-information/", profileHandler.HandleMissingUserID)
		profileRoutes.PUT("/update-avatar/", profileHandler.HandleMissingUserID)
	}

	savedRoutes := v1.Group("/saved")
	savedRoutes.Use(middlewares.AuthMiddleware())
	{
		// All
		savedRoutes.GET("/:user_id", savedHandler.GetAllSavedItems)

		// Hotel
		savedRoutes.GET("/hotel/:user_id", savedHandler.GetSavedHotels)
		savedRoutes.POST("/hotel/:user_id", savedHandler.AddSavedHotel)
		savedRoutes.DELETE("/hotel/:user_id", savedHandler.RemoveSavedHotel)

		// Place to go
		savedRoutes.GET("/place-to-go/:user_id", savedHandler.GetSavedPlacesToGo)
		savedRoutes.POST("/place-to-go/:user_id", savedHandler.AddSavedPlaceToGo)
		savedRoutes.DELETE("/place-to-go/:user_id", savedHandler.RemoveSavedPlaceToGo)

		// Handle missing userid on route
		savedRoutes.GET("/", savedHandler.HandleMissingUserID)
		savedRoutes.GET("/hotel/", savedHandler.HandleMissingUserID)
		savedRoutes.POST("/hotel/", savedHandler.HandleMissingUserID)
		savedRoutes.DELETE("/hotel/", savedHandler.HandleMissingUserID)
		savedRoutes.GET("/place-to-go/", savedHandler.HandleMissingUserID)
		savedRoutes.POST("/place-to-go/", savedHandler.HandleMissingUserID)
		savedRoutes.DELETE("/place-to-go/", savedHandler.HandleMissingUserID)
	}
}
