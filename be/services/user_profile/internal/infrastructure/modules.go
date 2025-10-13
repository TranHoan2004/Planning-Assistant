package infrastructure

import (
	"gitlab.com/plango-travel/backend/services/user_profile/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/config"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/database"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/middlewares"
	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/repositories"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/services"
	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(
		config.ProvideConfig,
		config.ProvideLogger,
		database.InitMongoDB,
		database.ProvideMongoDatabase,
		repositories.NewMongoUserRepository,
		repositories.NewMongoUserSavedRepository,
		services.NewGCSService,
		middlewares.AuthMiddleware,
		fx.Annotate(
			services.NewProfileService,
			fx.As(new(usecases.IProfileService)),
			fx.ResultTags(`name:"profile"`),
		),
		fx.Annotate(
			services.NewSavedService,
			fx.As(new(usecases.ISavedService)),
			fx.ResultTags(`name:"saved"`),
		),
		fx.Annotate(
			services.NewGCSService,
			fx.ResultTags(`name:"gcs"`),
		),
	),
)
