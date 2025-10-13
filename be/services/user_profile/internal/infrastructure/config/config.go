package config

import (
	"os"

	"go.uber.org/zap"
)

type GCSConfig struct {
	BucketName     string
	CredentialPath string
}

type MongoConfig struct {
	URI      string
	DBName   string
	User     string
	Password string
	Timeout  string
}

type Config struct {
	Environment      string
	Port             string
	AllowedOrigins   string
	DefaultAvatarURL string
	Mongo            MongoConfig
	GCS              GCSConfig
}

func ProvideConfig(log *zap.Logger) *Config {
	config := Config{
		Environment:      os.Getenv("ENVIRONMENT"),
		Port:             os.Getenv("PORT"),
		AllowedOrigins:   os.Getenv("ALLOWED_ORIGINS"),
		DefaultAvatarURL: os.Getenv("DEFAULT_AVATAR_URL"),

		Mongo: MongoConfig{
			URI:      os.Getenv("MONGO_URI"),
			DBName:   os.Getenv("MONGO_DB_NAME"),
			User:     os.Getenv("MONGO_USER"),
			Password: os.Getenv("MONGO_PASSWORD"),
			Timeout:  os.Getenv("MONGO_TIMEOUT_MS"),
		},

		GCS: GCSConfig{
			BucketName:     os.Getenv("GCS_BUCKET_NAME"),
			CredentialPath: os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"),
		},
	}

	return &config
}
