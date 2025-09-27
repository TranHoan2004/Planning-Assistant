package infrastructure

import (
	"gitlab.com/plango-travel/backend/services/accommodation/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/config"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/middlewares"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/services"
	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(
		config.ProvideConfig,
		config.ProvideLogger,
		middlewares.NewAmaduesInterceptor,
		fx.Annotate(
			services.NewAmadeusService,
			fx.As(new(usecases.IHotelService)),
			fx.ResultTags(`name:"amadeus"`),
		),
	),
)
