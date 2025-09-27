package main

import (
	"net/http"

	"gitlab.com/plango-travel/backend/services/accommodation/bootstrap"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/application"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/presentation"
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"go.uber.org/zap"
)

func main() {
	fx.New(
		infrastructure.Modules,
		application.Modules,
		presentation.Modules,
		bootstrap.Modules,
		fx.Invoke(
			func(*http.Server) {},
		),
		fx.WithLogger(func(log *zap.Logger) fxevent.Logger {
			return &fxevent.ZapLogger{Logger: log}
		}),
	).Run()
}
