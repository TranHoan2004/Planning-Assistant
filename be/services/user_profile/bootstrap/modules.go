package bootstrap

import "go.uber.org/fx"

var Modules = fx.Options(
	fx.Provide(
		NewGinEngine,
		NewHttpServer,
	),
)
