package presentation

import (
	"gitlab.com/plango-travel/backend/services/user_profile/internal/presentation/api"
	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(
		fx.Annotate(
			api.NewProfileHandler,
			fx.ParamTags(`name:"profile"`),
		),
		fx.Annotate(
			api.NewSavedHandler,
			fx.ParamTags(`name:"saved"`),
		),
	),
	fx.Invoke(
		api.RegisterRoutes,
	),
)
