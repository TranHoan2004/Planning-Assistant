package config

import (
	"os"

	"go.uber.org/zap"
)

type Config struct {
	Environment      string
	Port             string
	AllowedOrigins   string
	AmadeusAPIKey    string
	AmadeusAPISecret string
	AmadeusBaseURL   string
}

func ProvideConfig(log *zap.Logger) *Config {
	config := Config{
		Environment:      os.Getenv("ENVIRONMENT"),
		Port:             os.Getenv("PORT"),
		AllowedOrigins:   os.Getenv("ALLOWED_ORIGINS"),
		AmadeusAPIKey:    os.Getenv("AMADEUS_API_KEY"),
		AmadeusAPISecret: os.Getenv("AMADEUS_API_SECRET"),
		AmadeusBaseURL:   os.Getenv("AMADEUS_API_BASE_URL"),
	}

	return &config
}
