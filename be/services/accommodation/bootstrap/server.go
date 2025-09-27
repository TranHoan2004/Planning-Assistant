package bootstrap

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/gzip"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/config"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/middlewares"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

func NewGinEngine(log *zap.Logger, cfg *config.Config) *gin.Engine {
	r := gin.New()

	// Middlewares setup
	r.Use(middlewares.CORSMiddleware(cfg))
	r.Use(ginzap.Ginzap(log, time.RFC3339, true))
	r.Use(gin.Recovery())
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "OK",
			"env":    cfg.Environment,
		})
	})

	return r
}

func NewHttpServer(lc fx.Lifecycle, r *gin.Engine, cfg *config.Config, log *zap.Logger) *http.Server {
	srv := http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Port),
		Handler: r.Handler(),
	}

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			log.Info("Starting HTTP server", zap.String("Addr", srv.Addr))
			go func() {
				if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					log.Fatal("Listen error", zap.Error(err))
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			defer log.Sync()
			log.Info("Stopping HTTP server...")
			return srv.Shutdown(ctx)
		},
	})

	return &srv
}
