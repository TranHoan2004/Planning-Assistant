package middlewares

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/config"
)

func CORSMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Access-Control-Allow-Origin", cfg.AllowedOrigins)
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.Header("Access-Control-Allow-Headers", "*")
		ctx.Header("Access-Control-Allow-Methods", "*")

		ctx.Next()
	}
}
