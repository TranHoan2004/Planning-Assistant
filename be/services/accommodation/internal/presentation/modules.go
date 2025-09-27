package presentation

import (
	"gitlab.com/plango-travel/backend/services/accommodation/internal/presentation/api"
	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(
		fx.Annotate(
			api.NewHotelHandler,
			fx.ParamTags(`name:"amadeus"`),
		),
	),
	fx.Invoke(
		api.RegisterRoutes,
	),
)
