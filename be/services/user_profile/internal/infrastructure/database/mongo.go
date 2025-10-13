package database

import (
	"context"
	"time"

	"gitlab.com/plango-travel/backend/services/user_profile/internal/infrastructure/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

func InitMongoDB(cfg *config.Config, log *zap.Logger) (*mongo.Client, error) {
	clientOpts := options.Client().ApplyURI(cfg.Mongo.URI)

	// Nếu có user/password
	if cfg.Mongo.User != "" && cfg.Mongo.Password != "" {
		clientOpts.SetAuth(options.Credential{
			Username: cfg.Mongo.User,
			Password: cfg.Mongo.Password,
		})
	}

	// Parse timeout từ ENV
	timeoutDuration, err := time.ParseDuration(cfg.Mongo.Timeout)
	if err != nil {
		log.Warn("Invalid timeout value, fallback to 5s", zap.String("timeout", cfg.Mongo.Timeout))
		timeoutDuration = 5 * time.Second
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeoutDuration)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatal("Cannot connect to MongoDB", zap.Error(err))
		return nil, err
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("MongoDB ping failed", zap.Error(err))
		return nil, err
	}

	log.Info("Connected to MongoDB successfully")
	return client, nil
}

func ProvideMongoDatabase(client *mongo.Client, cfg *config.Config) *mongo.Database {
	return client.Database(cfg.Mongo.DBName)
}
